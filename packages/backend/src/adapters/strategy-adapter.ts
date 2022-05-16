import passport from 'passport'

import { UserRepository } from '../repositories/user-repository'

export interface StrategyAdapter {
  jwtSignIn: (userRepository: UserRepository) => passport.PassportStatic
}
