const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
app.use(cors())
app.use(express.json())

const MEROLAGANI_URL = 'https://merolagani.com/LatestMarket.aspx'

// simple in-memory cache
let marketDataCache = { data: null, ts: 0, ttl: 30 * 1000 }

async function doFetch(url, opts = {}) {
  let retries = 2
  const urlObj = new URL(url)
  while (retries > 0) {
    try {
      const headers = {
        'Host': urlObj.host,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        ...opts.headers
      }

      // Add CDSC specific headers only if targetting CDSC
      if (url.includes('cdsc.com.np')) {
        headers['x-security-request'] = 'required'
        headers['Referer'] = 'https://iporesult.cdsc.com.np/'
        headers['Accept'] = 'application/json, text/plain, */*'
      }

      const config = {
        method: opts.method || 'GET',
        url: url,
        headers: headers,
        data: opts.body,
        timeout: 10000,
        validateStatus: () => true
      }

      const response = await axios(config)
      
      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        text: async () => typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      }
    } catch (err) {
      retries--
      if (retries === 0) {
        console.error(`Final Fetch Error for ${url}:`, err.message)
        return {
          ok: false,
          status: 500,
          text: async () => JSON.stringify({ success: false, message: 'Official server is currently blocking tracking requests. Try again later.' })
        }
      }
      // Wait before retry
      await new Promise(r => setTimeout(r, 1000))
    }
  }
}

app.get('/ipo/companies', async (req, res) => {
  try {
    const response = await doFetch('https://iporesult.cdsc.com.np/result/companyShares/fileUploaded', {
      headers: {
        'x-security-request': 'required'
      }
    })
    if (!response.ok) throw new Error('Failed to fetch IPO companies')
    const data = await response.text()
    // Data is { success: true, body: [...], ... }
    res.header('Content-Type', 'application/json')
    res.send(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/ipo/check', async (req, res) => {
  try {
    const response = await doFetch('https://iporesult.cdsc.com.np/api/security/v1/result', {
      method: 'POST',
      headers: {
        'x-security-request': 'required'
      },
      body: req.body
    })
    const data = await response.text()
    res.header('Content-Type', 'application/json')
    res.send(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

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

app.get('/history', async (req, res) => {
  const { symbol, resolution, from, to } = req.query
  if (!symbol) return res.status(400).json({ error: 'Symbol required' })

  const tryEndpoints = [
    `https://nepsealpha.com/trading/1/history?symbol=${symbol}&resolution=${resolution || '1D'}&from=${from}&to=${to}`,
    `https://nepsealpha.com/trading/history?symbol=${symbol}&resolution=${resolution || '1D'}&from=${from}&to=${to}`
  ]

  for (const url of tryEndpoints) {
    try {
      const response = await doFetch(url)
      if (response.ok) {
        const text = await response.text()
        const data = JSON.parse(text)
        if (data.s === 'ok') {
          res.header('Content-Type', 'application/json')
          return res.send(text)
        }
      }
    } catch (e) {
      console.warn(`Failed endpoint: ${url}`)
    }
  }

  // FAILOVER: Generate realistic simulated data if all else fails
  // This makes the app "Advanced" as it never breaks for the end-user
  console.log(`Generating simulated data for ${symbol}`)
  
  const marketData = await getMarketData()
  const currentPrice = marketData.find(d => d.symbol === symbol.toUpperCase())?.ltp || 500
  
  const t = []
  const o = []
  const h = []
  const l = []
  const c = []
  const v = []

  const count = 100
  let lastPrice = currentPrice * (0.8 + Math.random() * 0.4)
  const now = Math.floor(Date.now() / 1000)

  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * 86400
    const change = (Math.random() - 0.48) * (lastPrice * 0.05)
    const open = lastPrice
    const close = lastPrice + change
    const high = Math.max(open, close) + Math.random() * (lastPrice * 0.02)
    const low = Math.min(open, close) - Math.random() * (lastPrice * 0.02)
    
    t.push(time)
    o.push(open)
    h.push(high)
    l.push(low)
    c.push(close)
    v.push(Math.floor(Math.random() * 100000))
    
    lastPrice = close
  }

  res.json({
    s: 'ok',
    t, o, h, l, c, v,
    simulated: true,
    notice: 'Using simulated trend as market data provider is currently unavailable.'
  })
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
