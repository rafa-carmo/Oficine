import { UserRepository } from '../../repositories/user-repository'

export interface UpdateUserData {
  name?: string
  email?: string
  login?: string
  isTech?: boolean
  isAdmin?: boolean
}
export class UpdateUserUseClase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, data: UpdateUserData, editorIsAdmin: boolean) {
    const { email, isAdmin, isTech, login, name } = data

    if (!email && !isAdmin && !isTech && !login && !name) {
      throw new Error('At least one field is required.')
    }

    if (email) {
      if (!email.includes('@')) {
        throw new Error('Set a valid email')
      }
    }

    const loginOrEmailExists = await this.userRepository.search({
      email,
      login
    })

    if (loginOrEmailExists) {
      if (loginOrEmailExists[0].id !== id) {
        throw new Error('Username or Email already in use')
      }
    }

    if (isAdmin) {
      if (typeof isAdmin !== 'boolean') {
        throw new Error('Admin field have to be boolean')
      }
    }
    if (isTech) {
      if (typeof isTech !== 'boolean') {
        throw new Error('Tech field have to be boolean')
      }
    }
    const validUser = await this.userRepository.find(id)
    if (!validUser) {
      throw new Error('Invalid user id')
    }
    if (validUser.id !== id) {
      if (!editorIsAdmin) {
        throw new Error('Unauthorized')
      }
    }

    this.userRepository.update(id, data)
  }
}
