import { CreateUserUseCase } from './create-user-use-case'

const createUserSpy = jest.fn()
const listUsersSpy = jest.fn()
const findUserSpy = jest.fn()
const searchUserSpy = jest.fn()

const encryptPasswordSpy = jest.fn()

const createPhoneSpy = jest.fn()

const createUserUseCase = new CreateUserUseCase(
  {
    create: createUserSpy,
    list: listUsersSpy,
    find: findUserSpy,
    search: searchUserSpy
  },
  { encrypt: encryptPasswordSpy, decrypt: () => false },
  {
    create: createPhoneSpy
  }
)

describe('Create user', () => {
  it('should not be able to create a user without a fields name, email, login or password', () => {
    const emptyValueError = 'Name, email, login and password is required'
    expect(
      createUserUseCase.execute({
        email: 'email',
        isTech: false,
        login: 'teste',
        name: '',
        password: 'pass',
        address: ''
      })
    ).rejects.toThrow(emptyValueError)

    expect(
      createUserUseCase.execute({
        email: '',
        isTech: false,
        login: 'teste',
        name: 'name',
        password: 'pass',
        address: ''
      })
    ).rejects.toThrow(emptyValueError)

    expect(
      createUserUseCase.execute({
        email: 'email',
        isTech: false,
        login: '',
        name: '',
        password: 'pass',
        address: ''
      })
    ).rejects.toThrow(emptyValueError)

    expect(
      createUserUseCase.execute({
        email: 'email',
        isTech: false,
        login: 'teste',
        name: 'name',
        password: '',
        address: ''
      })
    ).rejects.toThrow(emptyValueError)

    expect(encryptPasswordSpy).not.toBeCalled()
  })

  it('should not be able to create a user with a invalid email', () => {
    expect(
      createUserUseCase.execute({
        email: 'email',
        isTech: false,
        login: 'teste',
        name: 'name',
        password: '123',
        address: ''
      })
    ).rejects.toThrow('Field e-mail is invalid')
  })

  it('should not be able to create if email already exists', async () => {
    const searchUserSpy = jest.fn()
    const createUserUseCase = new CreateUserUseCase(
      {
        create: createUserSpy,
        list: listUsersSpy,
        find: findUserSpy,
        search: searchUserSpy
      },
      { encrypt: encryptPasswordSpy, decrypt: () => false },
      { create: createPhoneSpy }
    )
    searchUserSpy.mockResolvedValueOnce('exists')
    expect(
      createUserUseCase.execute({
        email: 'email@email.com',
        isTech: false,
        login: 'teste',
        name: 'name',
        password: 'pass',
        address: ''
      })
    ).rejects.toThrow('Email already exits')
  })

  it('should not be able to create if username already exists', async () => {
    const searchUserSpy = jest.fn()
    const createUserUseCase = new CreateUserUseCase(
      {
        create: createUserSpy,
        list: listUsersSpy,
        find: findUserSpy,
        search: searchUserSpy
      },
      { encrypt: encryptPasswordSpy, decrypt: () => false },
      { create: createPhoneSpy }
    )
    searchUserSpy.mockResolvedValueOnce(null)
    searchUserSpy.mockResolvedValueOnce('exists')
    expect(
      createUserUseCase.execute({
        email: 'email@email.com',
        isTech: false,
        login: 'teste',
        name: 'name',
        password: 'pass',
        address: ''
      })
    ).rejects.toThrow('Username already exits')
  })

  it('should be able to create a user', async () => {
    searchUserSpy.mockResolvedValue(null)
    createUserSpy.mockResolvedValue('string')
    await createUserUseCase.execute({
      email: 'email@email.com',
      isTech: false,
      login: 'teste',
      name: 'name',
      password: 'pass',
      address: ''
    })

    expect(searchUserSpy).toHaveBeenCalledWith({ email: 'email@email.com' })
    expect(searchUserSpy).toHaveBeenCalledWith({ login: 'teste' })

    expect(encryptPasswordSpy).toHaveBeenCalled()
    expect(createUserSpy).toBeCalled()
  })

  it('should be able to create a user with a telephone number', async () => {
    const searchUserSpy = jest.fn()
    searchUserSpy.mockResolvedValue(null)
    createUserSpy.mockResolvedValue('string')

    await createUserUseCase.execute({
      email: 'email@email.com',
      isTech: false,
      login: 'teste',
      name: 'name',
      password: 'pass',
      address: '',
      phones: [{ phone: '9999', isWhats: true }]
    })

    expect(createPhoneSpy).toHaveBeenCalled()
  })
})
