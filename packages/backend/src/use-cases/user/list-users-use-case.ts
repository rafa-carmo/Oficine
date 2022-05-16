import { UserRepository } from '../../repositories/user-repository'
export interface ListUserUseCaseResponse {
  id: string
  email: string
  name: string | null
  login: string
  isTech: boolean
  isAdmin: boolean
  createdAt: Date
}

export interface ListUserUseCaseProps {
  start?: number
  end?: number
}

function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
): Omit<User, Key> {
  for (const key of keys) {
    delete user[key]
  }
  return user
}
export class ListUserUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(data: ListUserUseCaseProps) {
    Object.entries(data).map(([key, value]) => {
      if (value) {
        if (isNaN(value)) {
          throw new Error(`${key} must be a number`)
        }
      }
    })
    const { start, end } = data
    const requestUsers = await this.userRepository.list({ start, end })

    const users = requestUsers?.map((user) => exclude(user, 'password'))
    return users
  }
}
