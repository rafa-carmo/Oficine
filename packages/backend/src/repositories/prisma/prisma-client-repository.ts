import { prisma } from '../../prisma'
import { ClientCreateData, ClientRepository } from '../client-repository'
export class PrismaClientRepository implements ClientRepository {
  async create(data: ClientCreateData) {
    await prisma.client.create({
      data
    })
    return
  }
}
