export interface DecryptData {
  password: string
  passwordHash: string
}

export interface EncryptAdapter {
  encrypt: (password: string) => string
  decrypt: (data: DecryptData) => boolean
}
