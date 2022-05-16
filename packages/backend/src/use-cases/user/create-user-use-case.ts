import { EncryptAdapter } from '../../adapters/encrypt-adapter'
import { PhoneRepository } from '../../repositories/phone-repository'
import { UserRepository } from '../../repositories/user-repository'

interface Phone {
  phone: string
  isWhats: boolean
}

interface CreateUserUseCaseRequest {
  name: string
  email: string
  phones?: Phone[]
  address?: string
  login: string
  password: string
  isTech: boolean
}

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private encryptAdapter: EncryptAdapter,
    private phoneAdapter: PhoneRepository
  ) {}

  async execute(request: CreateUserUseCaseRequest) {
    const { email, isTech, login, name, password, address, phones } = request
    if (!name || !email || !login || !password) {
      throw new Error('Name, email, login and password is required')
    }

    if (!email.includes('@')) {
      throw new Error('Field e-mail is invalid')
    }
    const emailExists = await this.userRepository.search({ email })

    if (emailExists) {
      throw new Error('Email already exits')
    }
    const usernameExists = await this.userRepository.search({ login })

    if (usernameExists) {
      throw new Error('Username already exits')
    }

    const cryptPassword = this.encryptAdapter.encrypt(password)

    const createdUser = await this.userRepository.create({
      email,
      isTech,
      login,
      name,
      password: cryptPassword,
      address
    })
    if (createdUser) {
      if (phones) {
        Promise.all(
          phones?.map(async (phone) => {
            await this.phoneAdapter.create({
              owner: createdUser,
              isWhats: phone.isWhats,
              phone: phone.phone
            })
          })
        )
      }
    }

    return
  }
}
