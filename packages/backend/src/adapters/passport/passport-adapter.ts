import passport from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserRepository } from '../../repositories/user-repository'
import { JWTPayloadData } from '../auth-adapter'
import { StrategyAdapter } from '../strategy-adapter'
const authSecret = process.env.AUTH_SECRET || 'secret'

export class PassportAdapter implements StrategyAdapter {
  jwtSignIn(userRepository: UserRepository) {
    const params = {
      secretOrKey: authSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }
    const strategy = new Strategy(params, (payload: JWTPayloadData, done) => {
      userRepository
        .find(payload.id)
        .then((user) => done(null, user ? { ...payload } : false))
        .catch((err) => done(err, false))
    })
    const passportUse = passport.use(strategy)

    return passportUse
  }
}
