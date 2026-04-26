const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://merolagani.com/CompanyList.aspx';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const $ = cheerio.load(data);
        const sectors = {};
        
        // Loop over the table body rows
        $('table tbody tr').each((i, row) => {
            const cols = $(row).find('td');
            if (cols.length >= 4) {
                const symbol = $(cols[0]).text().trim();
                const sector = $(cols[3]).text().trim();
                if (symbol && sector) {
                    sectors[symbol] = sector;
                }
            }
        });

        console.log(`Scraped ${Object.keys(sectors).length} symbols.`);
        fs.writeFileSync('frontend/src/utils/sectors.json', JSON.stringify(sectors, null, 2));
    });
}).on('error', (err) => console.log('Error: ' + err.message));
