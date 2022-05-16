import { UserRepository } from '../../repositories/user-repository'

export class FindUserUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(id: string) {
    if (!id) {
      throw new Error('id is required')
    }
    const user = await this.userRepository.find(id)

    return user
  }
}
