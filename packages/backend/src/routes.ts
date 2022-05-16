import { Router } from 'express'

import { authenticate, signIn, validateToken } from './api/auth'
import { createUser, findUser, getUsers } from './api/users'

export const routes = Router()

routes.get('/', (req, res) => {
  res.send('hello world')
})

routes.get('/users', async (request, response) => {
  const { start, end } = request.query
  try {
    let numberStart = undefined
    let numberEnd = undefined
    if (start) {
      numberStart = Number(start)
    }
    if (end) {
      numberEnd = Number(end)
    }

    const users = await getUsers({ start: numberStart, end: numberEnd })
    return response.json(users).send()
  } catch (e) {
    return response.status(400).send()
  }
})

routes.get('/user/:id', async (request, response) => {
  const { id } = request.params
  if (!id) {
    response.send(400)
    throw new Error('parameter id is required')
  }
  const user = await findUser(id)

  if (user) {
    return response.json(user).send()
  }

  response.json({ message: 'user not found' }).send()
})

routes
  .route('/user')
  .all(authenticate())
  .post(async (req, res) => {
    const { email, isTech, login, name, password, address, phones } = req.body

    await createUser({
      email,
      isTech,
      login,
      name,
      password,
      address,
      phones
    }).catch((error) => {
      res.status(400).json({ message: error.message }).send()
    })

    return res.status(201).send()
  })

routes.post('/signIn', async (req, res) => {
  const { username, email, password } = req.body
  await signIn({ username, email, password })
    .then((token) => res.json(token).send())
    .catch((err) => res.json({ error: { message: err.message } }).send())
  return
})

routes.post('/user/validateToken', async (req, res) => {
  const { token } = req.body
  await validateToken(token)
    .then((token) => res.json(token).send())
    .catch((err) => res.json({ error: { message: err.message } }).send())
})
