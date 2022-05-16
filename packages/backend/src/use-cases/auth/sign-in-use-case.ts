import { AuthAdapter } from '../../adapters/auth-adapter'
import { EncryptAdapter } from '../../adapters/encrypt-adapter'
import { UserRepository } from '../../repositories/user-repository'

interface SignInUserData {
  username?: string
  email?: string
  isPermanent?: boolean
  password: string
}

export class SignInUseCase {
  constructor(
    private userRepository: UserRepository,
    private encryptAdapter: EncryptAdapter,
    private authAdapter: AuthAdapter
  ) {}
  async execute(credentials: SignInUserData) {
    const { username, email, password } = credentials

    if (!username && !email) {
      throw new Error('Username or email is required')
    }
    if (!password) {
      throw new Error('Password is required')
    }

    const userData = await this.userRepository.search({
      login: username,
      email
    })

    if (userData?.length === 0 || !userData) {
      throw new Error('Username or email incorrect')
    }

    const passwordIsValid = this.encryptAdapter.decrypt({
      password,
      passwordHash: userData[0].password
    })

    if (!passwordIsValid) {
      throw new Error('Password invalid or incorrect')
    }

    const { id, name, isAdmin, isTech } = userData[0]

    const token = this.authAdapter.encode({
      id,
      name,
      admin: isAdmin,
      tech: isTech
    })

    return token
  }
}
