import { ListUserUseCase } from './list-users-use-case'
const createUserSpy = jest.fn()
const listUsersSpy = jest.fn()
const findUserSpy = jest.fn()
const searchUserSpy = jest.fn()

const listUserUseCase = new ListUserUseCase({
  create: createUserSpy,
  list: listUsersSpy,
  find: findUserSpy,
  search: searchUserSpy
})

listUsersSpy.mockResolvedValue([
  {
    id: 'sameId',
    email: 'email@email.com',
    name: 'same name',
    password: '123456',
    login: 'same user',
    isTech: true,
    isAdmin: false,
    createdAt: 'date',
    phones: null
  }
])

describe('find user', () => {
  it('should be find a list of users', async () => {
    await expect(listUserUseCase.execute({})).resolves.not.toThrow()
  })
  it('should be not find password field in users list', async () => {
    const usersWithoutPassword = [
      {
        id: 'sameId',
        email: 'email@email.com',
        name: 'same name',
        login: 'same user',
        isTech: true,
        isAdmin: false,
        createdAt: 'date'
      }
    ]
    const listUserResult = await listUserUseCase.execute({})
    expect(listUserResult).toMatchObject(usersWithoutPassword)
  })
  it('should be not pass if start or end not a number', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    expect(listUserUseCase.execute({ start: 'a' })).rejects.toThrow(
      'start must be a number'
    )
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    expect(listUserUseCase.execute({ end: 'a' })).rejects.toThrow(
      'end must be a number'
    )
  })
})
