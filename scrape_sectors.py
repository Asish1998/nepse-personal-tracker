import urllib.request
from bs4 import BeautifulSoup
import json
import ssl
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://www.sharesansar.com/company-list', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read()
    soup = BeautifulSoup(html, 'html.parser')
    table = soup.find('table', {'id': 'myTable'})
    sectors = {}
    for row in table.find_all('tr')[1:]:
        cols = row.find_all('td')
        if len(cols) >= 3:
            symbol = cols[0].text.strip()
            sector = cols[2].text.strip()
            if symbol and sector:
              sectors[symbol] = sector

    os.makedirs('frontend/src/utils', exist_ok=True)
    with open('frontend/src/utils/sectors.json', 'w') as f:
        json.dump(sectors, f, indent=2)
    print(f'Successfully scraped {len(sectors)} symbols to frontend/src/utils/sectors.json')
except Exception as e:
    print('Failed:', e)
