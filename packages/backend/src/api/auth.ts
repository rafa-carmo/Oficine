import { BcryptAdapter } from '../adapters/bcrypt/bcrypt-adapter'
import { JWTAdapter } from '../adapters/jwt/jwt-adapter'
import { PassportAdapter } from '../adapters/passport/passport-adapter'
import { PrismaUserRepository } from '../repositories/prisma/prisma-user-repository'
import { PassportUseCase } from '../use-cases/auth/passport-use-case'
import { SignInUseCase } from '../use-cases/auth/sign-in-use-case'
import { ValidateTokenUseCase } from '../use-cases/auth/validate-token-use-case'

interface SignInProps {
  username?: string
  email?: string
  password: string
}

const userRepository = new PrismaUserRepository()
const encryptAdapter = new BcryptAdapter()
const authAdapter = new JWTAdapter()

const passportAdapter = new PassportAdapter()

const signIn = async (credentials: SignInProps) => {
  const signInUseCase = new SignInUseCase(
    userRepository,
    encryptAdapter,
    authAdapter
  )

  const token = await signInUseCase.execute(credentials)

  return token
}

const validateToken = async (token: string) => {
  const validateTokenUseCase = new ValidateTokenUseCase(authAdapter)

  const validate = validateTokenUseCase.execute(token)
  return validate
}

const authenticate = () => {
  const passportUseCase = new PassportUseCase(userRepository, passportAdapter)
  return passportUseCase.execute()
}

export { signIn, validateToken, authenticate }
