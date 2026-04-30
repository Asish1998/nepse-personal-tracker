// Utility to wrap calls to Gemini API via Fetch
export async function tellGemini(prompt, apiKey) {
  const effectiveKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY
  if (!effectiveKey) throw new Error('AI functionality is currently unavailable.')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${effectiveKey}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
           temperature: 0.7
        }
      })
    })

    if (!res.ok) {
      if (res.status === 400 || res.status === 403) throw new Error('Invalid API Key or Blocked request.')
      throw new Error(`Gemini Error: ${res.status}`)
    }

    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return text
  } catch (err) {
    console.error('AI Error:', err)
    throw err
  }
}

// Format the portfolio constraints into a raw string for the LLM
export function generateContextString(state) {
  const holdings = state.holdings || []
  let totalInv = 0
  let currentVal = 0

  const holdStrs = holdings.map(h => {
    const cur = h.cur > 0 ? h.cur : h.buy
    totalInv += h.qty * h.buy
    currentVal += h.qty * cur
    return `- ${h.qty} shares of ${h.sym} bought at ${h.buy.toFixed(2)}, currently at ${cur.toFixed(2)}.`
  }).join('\n')

  return `
USER CONTEXT:
The user is a NEPSE (Nepal Stock Exchange) investor/trader.
Currency is NPR (Nepali Rupees). 
Standard transaction fees in NEPSE include:
- Broker Commission (ranges 0.27% to 0.40% mostly)
- SEBON fee: 0.015%
- DP Fee: NPR 25
- Capital Gains Tax: 5% (long term > 1yr) or 7.5% (short term < 1yr).

CURRENT PORTFOLIO:
Total Invested: ${totalInv.toFixed(2)}
Current Value: ${currentVal.toFixed(2)}

HOLDINGS:
${holdStrs || 'No holdings currently.'}

Respond directly to the user based on this context. Be concise, act like a professional quantitative analyst. Do not use markdown headers unless necessary.
  `
}
