import bcrypt from 'bcrypt'

import { EncryptAdapter, DecryptData } from '../encrypt-adapter'

export class BcryptAdapter implements EncryptAdapter {
  encrypt(password: string) {
    const salt = bcrypt.genSaltSync(10)
    const cryptPassword = bcrypt.hashSync(password, salt)

    return cryptPassword
  }
  decrypt({ password, passwordHash }: DecryptData) {
    const decrypt = bcrypt.compareSync(password, passwordHash)
    return decrypt
  }
}
