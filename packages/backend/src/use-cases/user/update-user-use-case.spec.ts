import { UpdateUserUseClase } from './update-user-use-case'

const createUserSpy = jest.fn()
const listUsersSpy = jest.fn()
const findUserSpy = jest.fn()
const searchUserSpy = jest.fn()
const updateUserSpy = jest.fn()

const updateUserUseCase = new UpdateUserUseClase({
  create: createUserSpy,
  list: listUsersSpy,
  find: findUserSpy,
  search: searchUserSpy,
  update: updateUserSpy
})

describe('Update User', () => {
  it('not should be progress without any field', () => {
    expect(updateUserUseCase.execute('id', {}, false)).rejects.toThrow(
      'At least one field is required.'
    )
  })

  it('should not be set a invalid email', () => {
    expect(
      updateUserUseCase.execute(
        'id',
        {
          email: 'invalid email'
        },
        false
      )
    ).rejects.toThrow('Set a valid email')
  })

  it('should be return error if email or username already exists', () => {
    searchUserSpy.mockResolvedValueOnce([
      {
        id: 'some_id'
      }
    ])
    expect(
      updateUserUseCase.execute(
        'other_id',
        {
          email: 'email@email.com'
        },
        false
      )
    ).rejects.toThrow('Username or Email already in use')
  })

  it('should not be able to set isAdmin or isTech different of boolean', () => {
    searchUserSpy.mockResolvedValueOnce(null)
    expect(
      updateUserUseCase.execute(
        'id',
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore:next-line
          isAdmin: 'String'
        },
        false
      )
    ).rejects.toThrow('Admin field have to be boolean')

    searchUserSpy.mockResolvedValueOnce(null)
    expect(
      updateUserUseCase.execute(
        'id',
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore:next-line
          isTech: 'String'
        },
        false
      )
    ).rejects.toThrow('Tech field have to be boolean')
  })
  it('should be not able to resolve if id is invalid', () => {
    searchUserSpy.mockResolvedValueOnce(null)
    updateUserSpy.mockResolvedValue(true)
    findUserSpy.mockResolvedValueOnce(false)
    expect(
      updateUserUseCase.execute(
        'id',
        {
          email: 'email@email.com'
        },
        false
      )
    ).rejects.toThrow('Invalid user id')
  })
  it('should not be update if user not admin and edit another user', () => {
    searchUserSpy.mockResolvedValueOnce(null)
    updateUserSpy.mockResolvedValue(true)
    findUserSpy.mockResolvedValueOnce({
      id: 'other_id'
    })
    expect(
      updateUserUseCase.execute(
        'id',
        {
          email: 'email@email.com'
        },
        false
      )
    ).rejects.toThrow('Unauthorized')
  })
  it('should be update if fields is valid if user is same of edit or user logged is admin', () => {
    searchUserSpy.mockResolvedValueOnce(null)
    updateUserSpy.mockResolvedValue(true)
    findUserSpy.mockResolvedValueOnce({
      id: 'id'
    })
    expect(
      updateUserUseCase.execute(
        'id',
        {
          email: 'email@email.com'
        },
        false
      )
    ).resolves.not.toThrow()

    searchUserSpy.mockResolvedValueOnce(null)
    updateUserSpy.mockResolvedValue(true)
    findUserSpy.mockResolvedValueOnce({
      id: 'other_id'
    })
    expect(
      updateUserUseCase.execute(
        'id',
        {
          email: 'email@email.com'
        },
        true
      )
    ).resolves.not.toThrow()
  })
})
