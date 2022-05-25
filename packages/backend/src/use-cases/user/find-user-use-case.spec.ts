import { FindUserUseCase } from './find-user-use-case'

const createUserSpy = jest.fn()
const listUsersSpy = jest.fn()
const findUserSpy = jest.fn()
const searchUserSpy = jest.fn()
const updateUserSpy = jest.fn()

const findUserUseCase = new FindUserUseCase({
  create: createUserSpy,
  list: listUsersSpy,
  find: findUserSpy,
  search: searchUserSpy,
  update: updateUserSpy
})
describe('find user', () => {
  it('should be find a user', () => {
    expect(findUserUseCase.execute('id')).resolves.not.toThrow()
    expect(findUserSpy).toHaveBeenCalled()
  })

  it('should not be execute if not have a id', () => {
    expect(findUserUseCase.execute('')).rejects.toThrow('id is required')
  })
})
