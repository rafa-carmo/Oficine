import { StrategyAdapter } from '../../adapters/strategy-adapter'
import { UserRepository } from '../../repositories/user-repository'
export class PassportUseCase {
  constructor(
    private userRepository: UserRepository,
    private passportAdapter: StrategyAdapter
  ) {}
  execute() {
    const passport = this.passportAdapter.jwtSignIn(this.userRepository)

    return passport.authenticate('jwt', { session: false })
  }
}
