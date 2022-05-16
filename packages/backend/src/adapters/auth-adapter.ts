export interface JWTPayloadData {
  id: string
  name: string
  admin: boolean
  tech: boolean
}

export interface JWTData {
  id: string
  name: string
  admin: boolean
  tech: boolean
  iat: number
  exp: number
}

export interface AuthAdapter {
  encode: (payload: JWTPayloadData) => string
  decode: (token: string) => JWTData | null
}
