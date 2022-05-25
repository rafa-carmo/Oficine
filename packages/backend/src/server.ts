import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

import { startApolloServer } from './middlewares/graphql'
import { routes } from './routes'

const app = express()
const port = process.env.PORT || 3333

app.use(express.json())
app.use(cors())

if (process.env.GRAPHQL_USE) {
  startApolloServer(app)
}

app.use(routes)

app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}⭐️`)
})
