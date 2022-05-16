import jwt from 'jwt-simple'

import { AuthAdapter, JWTPayloadData } from '../auth-adapter'

const authSecret = process.env.AUTH_SECRET || 'authSecret'

const dateToday = Math.floor(Date.now() / 1000)
const expirationTime = 60 * 60 * 24 * 3
export class JWTAdapter implements AuthAdapter {
  encode({ id, name, admin, tech }: JWTPayloadData) {
    const payloadToken = {
      id,
      name,
      admin,
      tech,
      iat: dateToday,
      exp: dateToday + expirationTime
    }

    return jwt.encode(payloadToken, authSecret)
  }

  decode(token: string) {
    try {
      const tokenData = jwt.decode(token, authSecret)
      return tokenData
    } catch (e) {
      return null
    }
  }
}
