const cheerio = require('cheerio');
const axios = require('axios');
async function test() {
  const { data } = await axios.get('https://merolagani.com/LatestMarket.aspx', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const $ = cheerio.load(data);
  console.log('Index HTML:', $('.market-status').html() || $('#ctl00_ContentPlaceHolder1_LiveTrading').html());
}
test();
