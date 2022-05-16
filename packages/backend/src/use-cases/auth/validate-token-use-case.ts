import { AuthAdapter } from '../../adapters/auth-adapter'
export class ValidateTokenUseCase {
  constructor(private authAdapter: AuthAdapter) {}

  execute(token: string) {
    const tokenData = this.authAdapter.decode(token)

    if (!tokenData) {
      throw new Error('Invalid Token')
    }

    const todayData = new Date()
    const expirationData = new Date(tokenData.exp * 1000)

    if (expirationData > todayData) {
      return tokenData
    }
    throw new Error('Expired token')
  }
}
