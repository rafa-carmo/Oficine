import { ClientRepository } from '../../repositories/client-repository'
interface CreateClientProps {
  name: string
  email?: string
  address?: string
}
export class CreateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(data: CreateClientProps) {
    await this.clientRepository.create(data)
  }
}
