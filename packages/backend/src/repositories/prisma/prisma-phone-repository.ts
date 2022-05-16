import { prisma } from '../../prisma'
import { PhoneRepository, PhoneRepositoryProps } from '../phone-repository'

export class PrismaPhoneRepository implements PhoneRepository {
  async create(data: PhoneRepositoryProps) {
    await prisma.phone.create({
      data
    })
    return
  }
}
