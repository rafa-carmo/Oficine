import { NextFunction, Request, Response } from 'express'

import { JWTAdapter } from '../adapters/jwt/jwt-adapter'
import { ValidateTokenUseCase } from '../use-cases/auth/validate-token-use-case'

const authAdapter = new JWTAdapter()

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('bearer ', '')

  const validateTokenUseCase = new ValidateTokenUseCase(authAdapter).execute(
    // eslint-disable-next-line
    token!
  )
  if (validateTokenUseCase.admin) {
    next()
    return
  }
  return res.status(401).send()
}

export { isAdmin }
