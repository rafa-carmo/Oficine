import { User } from '@prisma/client'
import {
  SearchData,
  UserCreateData,
  UserRepository
} from 'repositories/user-repository'

import { prisma } from '../../prisma'
import { ListData } from '../user-repository'

type Phone = {
  phone: string
  isWhats: boolean
}

type UserProps = {
  phones?: Phone[] | null
} & User

async function findPhones(listUsers: User[]) {
  let users: UserProps[] = []

  await Promise.all(
    listUsers.map(async (user) => {
      const phones = await prisma.phone.findMany({
        where: {
          owner: user.id
        }
      })

      return {
        ...user,
        phones:
          phones.length > 0
            ? phones?.map((phone) => ({
                phone: phone.phone,
                isWhats: phone.isWhats
              }))
            : null
      }
    })
  ).then((data) => (users = data))
  return users
}

export class PrismaUserRepository implements UserRepository {
  async list({ start, end }: ListData) {
    const findUsers = await prisma.user.findMany({
      skip: start,
      take: end
    })

    const users = await findPhones(findUsers)

    return users
  }

  async find(id: string) {
    const findUser = await prisma.user.findFirst({ where: { id } })
    if (findUser) {
      const user = await findPhones([findUser])
      return user[0]
    }
    return null
  }

  async search({ email, id, isAdmin, isTech, login, name }: SearchData) {
    const findUsers = await prisma.user.findMany({
      where: {
        email,
        id,
        isAdmin,
        isTech,
        login,
        name
      }
    })

    const users = await findPhones(findUsers)
    if (users.length > 0) {
      return users
    }
    return null
  }

  async create(data: UserCreateData) {
    const user = await prisma.user.create({
      data
    })
    if (user) {
      return user.id
    }
    return null
  }
}
