import { SignInUseCase } from './sign-in-use-case'

const encryptSpy = jest.fn()
const decryptSpy = jest.fn()

const createUserSpy = jest.fn()
const listUserSpy = jest.fn()
const findUserSpy = jest.fn()
const searchUserSpy = jest.fn()

const encodeJWTSpy = jest.fn()
const decodeJWTSpy = jest.fn()

const signInUseCase = new SignInUseCase(
  {
    create: createUserSpy,
    list: listUserSpy,
    find: findUserSpy,
    search: searchUserSpy
  },
  { encrypt: encryptSpy, decrypt: decryptSpy },
  {
    encode: encodeJWTSpy,
    decode: decodeJWTSpy
  }
)

const userData = [
  {
    id: 'uuid',
    name: 'name',
    password: '00'
  }
]

describe('SignIn user', () => {
  it('should be error if not have email and username or password', () => {
    expect(
      signInUseCase.execute({
        password: '00'
      })
    ).rejects.toThrow('Username or email is required')

    expect(
      signInUseCase.execute({
        username: 'teste',
        password: ''
      })
    ).rejects.toThrow('Password is required')
  })

  it('should be not auth if user not found', () => {
    searchUserSpy.mockResolvedValueOnce(null)
    expect(
      signInUseCase.execute({
        email: 'email@email.com',
        password: '00'
      })
    ).rejects.toThrow('Username or email incorrect')

    searchUserSpy.mockResolvedValueOnce([])
    expect(
      signInUseCase.execute({
        email: 'email@email.com',
        password: '00'
      })
    ).rejects.toThrow('Username or email incorrect')
  })

  it('should be not auth if password is incorrect', () => {
    searchUserSpy.mockResolvedValueOnce(userData)
    decryptSpy.mockReturnValueOnce(false)
    expect(
      signInUseCase.execute({
        email: 'email@email.com',
        password: '00'
      })
    ).rejects.toThrow('Password invalid or incorrect')
  })

  it('should be SignIn with email or username', async () => {
    searchUserSpy.mockResolvedValue(userData)
    decryptSpy.mockReturnValue(true)

    expect(
      signInUseCase.execute({
        email: 'email@email.com',
        password: '00'
      })
    ).resolves.not.toThrow()

    expect(
      signInUseCase.execute({
        username: 'username',
        password: '00'
      })
    ).resolves.not.toThrow()

    await signInUseCase.execute({
      username: 'username',
      password: '00'
    })
    expect(decryptSpy).toHaveBeenCalled()
    expect(encodeJWTSpy).toBeCalled()
  })
})
