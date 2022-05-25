import { Request } from 'express'

import { BcryptAdapter } from '../adapters/bcrypt/bcrypt-adapter'
import { JWTAdapter } from '../adapters/jwt/jwt-adapter'
import { PrismaPhoneRepository } from '../repositories/prisma/prisma-phone-repository'
import { PrismaUserRepository } from '../repositories/prisma/prisma-user-repository'
import { ValidateTokenUseCase } from '../use-cases/auth/validate-token-use-case'
import { CreateUserUseCase } from '../use-cases/user/create-user-use-case'
import { FindUserUseCase } from '../use-cases/user/find-user-use-case'
import { ListUserUseCase } from '../use-cases/user/list-users-use-case'
import {
  UpdateUserUseClase,
  UpdateUserData
} from '../use-cases/user/update-user-use-case'

const userRepository = new PrismaUserRepository()
const phoneRepository = new PrismaPhoneRepository()
const encryptAdapter = new BcryptAdapter()
const authAdapter = new JWTAdapter()
interface getUsersProps {
  start?: number
  end?: number
}
const getUsers = async ({ start, end }: getUsersProps) => {
  const listUsersUseCase = new ListUserUseCase(userRepository)
  const users = await listUsersUseCase.execute({ start, end })
  return users
}

interface Phone {
  phone: string
  isWhats: boolean
}

interface createUserProps {
  name: string
  email: string
  login: string
  isTech: boolean
  password: string
  address?: string
  phones?: Phone[]
}
const createUser = async ({
  email,
  isTech,
  login,
  name,
  password,
  address,
  phones
}: createUserProps) => {
  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    encryptAdapter,
    phoneRepository
  )
  return await createUserUseCase.execute({
    email,
    isTech,
    login,
    name,
    password,
    address,
    phones
  })
}

const findUser = async (id: string) => {
  const findUserUseCase = new FindUserUseCase(userRepository)
  return await findUserUseCase.execute(id)
}

const updateUser = async (req: Request, id: string, data: UpdateUserData) => {
  const updateUserUseCase = new UpdateUserUseClase(userRepository)
  const token = req.headers.authorization?.replace('bearer ', '')
  const validateTokenUseCase = new ValidateTokenUseCase(authAdapter)

  // eslint-disable-next-line
  const validate = validateTokenUseCase.execute(token!)
  return await updateUserUseCase.execute(id, data, validate.admin)
}

export { getUsers, createUser, findUser, updateUser }
