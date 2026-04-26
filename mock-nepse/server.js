const express = require('express')
const cors = require('cors')
const http = require('http')
const https = require('https')
const { URL } = require('url')
const cheerio = require('cheerio')

const app = express()
app.use(cors())

const MEROLAGANI_URL = 'https://merolagani.com/LatestMarket.aspx'

// simple in-memory cache
let marketDataCache = { data: null, ts: 0, ttl: 30 * 1000 }

async function doFetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url)
      const lib = u.protocol === 'https:' ? https : http
      const headers = Object.assign({ 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml' 
      }, opts.headers || {})
      
      const req = lib.request(u, { method: opts.method || 'GET', headers }, res => {
        const { statusCode } = res
        let body = ''
        res.setEncoding('utf8')
        res.on('data', c => body += c)
        res.on('end', () => resolve({ 
          ok: statusCode >= 200 && statusCode < 300, 
          status: statusCode, 
          text: async () => body 
        }))
      })
      req.on('error', reject)
      if (opts.body) req.write(opts.body)
      req.end()
    } catch (err) {
      reject(err)
    }
  })
}

async function getMarketData(force = false) {
  const now = Date.now()
  if (!force && marketDataCache.data && now - marketDataCache.ts < marketDataCache.ttl) {
    return marketDataCache.data
  }

  try {
    const res = await doFetch(MEROLAGANI_URL)
    if (!res.ok) throw new Error('Failed to fetch Merolagani')
    const html = await res.text()
    const $ = cheerio.load(html)
    const out = []

    // Merolagani Latest Market table structure:
    // <tr><td><a ...>SYMBOL</a></td><td>LTP</td>...</tr>
    const seen = new Set()
    $('table tr').each((i, tr) => {
      const cols = $(tr).find('td')
      if (cols.length >= 2) {
        const symbol = $(cols[0]).find('a').text().trim().toUpperCase()
        const name = $(cols[0]).find('a').attr('title') || null
        const ltpStr = $(cols[1]).text().trim().replace(/,/g, '')
        const ltp = parseFloat(ltpStr)
        
        if (symbol && !isNaN(ltp) && !seen.has(symbol)) {
          seen.add(symbol)
          out.push({ symbol, name, ltp })
        }
      }
    })

    if (out.length > 0) {
      marketDataCache = { data: out, ts: now, ttl: 30 * 1000 }
      return out
    }
    return marketDataCache.data || []
  } catch (err) {
    console.error('Scraping error:', err.message)
    return marketDataCache.data || []
  }
}

app.get('/symbols', async (req, res) => {
  const force = req.query.force === '1' || req.query.force === 'true'
  const data = await getMarketData(force)
  res.json(data)
})

app.get('/price', async (req, res) => {
  const symbol = (req.query.symbol || '').toUpperCase()
  if (!symbol) return res.status(400).json({ error: 'Symbol required' })

  const data = await getMarketData()
  const found = data.find(d => d.symbol === symbol)
  
  if (found) {
    res.json({ price: found.ltp })
  } else {
    res.status(404).json({ error: 'Symbol not found' })
  }
})

app.get('/news', async (req, res) => {
  try {
    const response = await doFetch('https://merolagani.com/NewsList.aspx')
    if (!response.ok) throw new Error('Failed to fetch from Merolagani')
    const html = await response.text()
    const $ = cheerio.load(html)
    
    const headlines = []
    $('.media-body').each((i, el) => {
      if (i >= 15) return false // get top 15
      const title = $(el).find('h4.media-title a').text().trim()
      const date = $(el).find('.media-label').text().trim()
      if (title) headlines.push({ title, date })
    })

    res.json(headlines)
  } catch (err) {
    console.error('News error:', err.message)
    res.status(500).json({ error: 'Failed to scrape news' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`mock NEPSE API listening on ${PORT}`))
