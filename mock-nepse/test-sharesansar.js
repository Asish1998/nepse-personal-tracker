const axios = require('axios');
const cheerio = require('cheerio');
async function test() {
  const {data} = await axios.get('https://www.sharesansar.com/');
  const $ = cheerio.load(data);
  const index = $('.index-val').first().text().replace(/,/g, '').trim();
  const change = $('.index-change').first().text().replace(/,/g,'').trim();
  const pct = $('.index-per').first().text().replace(/[%]/g,'').trim();
  const status = $('.market-status-badge').text().trim();
  console.log({index: parseFloat(index), change: parseFloat(change), pct: parseFloat(pct), status});
}
test();
