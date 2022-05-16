export interface Phone {
  phone: string
  isWhats: boolean
}

export interface UserCreateData {
  name: string
  email: string
  address?: string
  login: string
  password: string
  isTech: boolean
}

export interface UserData {
  id: string
  email: string
  name: string
  password: string
  login: string
  isTech: boolean
  isAdmin: boolean
  createdAt: Date
  phones?: Phone[] | null
}

export interface SearchData {
  id?: string
  email?: string
  name?: string
  login?: string
  isTech?: boolean
  isAdmin?: boolean
}

export interface ListData {
  start?: number
  end?: number
}

export interface UserRepository {
  list: (data: ListData) => Promise<UserData[] | null>
  find: (id: string) => Promise<UserData | null>
  search: (data: SearchData) => Promise<UserData[] | null>
  create: (data: UserCreateData) => Promise<string | null>
}
