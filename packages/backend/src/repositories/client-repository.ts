export interface ClientCreateData {
  name: string
  email?: string
  address?: string
}

export interface ClientRepository {
  create: (data: ClientCreateData) => Promise<void>
}
