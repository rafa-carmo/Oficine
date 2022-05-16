export interface PhoneRepositoryProps {
  phone: string
  isWhats: boolean
  owner: string
}

export interface PhoneRepository {
  create: (data: PhoneRepositoryProps) => Promise<void>
}
