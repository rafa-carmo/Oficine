import { ValidateTokenUseCase } from './validate-token-use-case'

const encodeSpy = jest.fn()
const decodeSpy = jest.fn()

const validateTokenUseCase = new ValidateTokenUseCase({
  encode: encodeSpy,
  decode: decodeSpy
})

describe('Validate Token test', () => {
  it('should be not decode if invalid token or expired token', () => {
    decodeSpy.mockReturnValueOnce(null)
    expect(() => validateTokenUseCase.execute('invalid token')).toThrowError(
      'Invalid Token'
    )
  })
  it('should not be validate if a token expired', () => {
    const payloadExpired = {
      id: 'any id',
      name: 'any name',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) - 1000
    }

    decodeSpy.mockReturnValueOnce(payloadExpired)
    expect(() => validateTokenUseCase.execute('expired token')).toThrowError(
      'Expired token'
    )
  })
  it('should be decode and validate the token', () => {
    const payload = {
      id: 'any id',
      name: 'any name',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3
    }
    decodeSpy.mockReturnValue(payload)
    expect(() => validateTokenUseCase.execute('token')).not.toThrow()
  })
})
