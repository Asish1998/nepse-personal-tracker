import CryptoJS from 'crypto-js'

/**
 * Encrypts data using a PIN. If no PIN is provided, returns the stringified data.
 */
export const encryptData = (data, pin) => {
  if (!pin) return JSON.stringify(data)
  return CryptoJS.AES.encrypt(JSON.stringify(data), pin).toString()
}

/**
 * Decrypts data using a PIN. If data is not encrypted (valid JSON), returns the parsed object.
 */
export const decryptData = (encryptedData, pin) => {
  if (!encryptedData) return null
  
  // Check if it's already a JSON string (unencrypted)
  try {
    const parsed = JSON.parse(encryptedData)
    return parsed
  } catch (e) {
    // Treat as encrypted
    if (!pin) throw new Error('Data is encrypted. Master PIN required.')
    
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, pin)
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      if (!decrypted) throw new Error('Incorrect PIN')
      return JSON.parse(decrypted)
    } catch (err) {
      throw new Error('Could not decrypt data. Incorrect PIN or corrupted storage.')
    }
  }
}
