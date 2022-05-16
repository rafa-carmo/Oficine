import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer, gql } from 'apollo-server-express'
import { Express } from 'express'

import { getUsers } from '../api/users'

const typeDefs = gql`
  type User {
    id: String
    email: String
    name: String
    login: String
    isTech: Boolean
    isAdmin: Boolean
    createdAt: String
  }
  type Query {
    users(start: Int, end: Int): [User]
  }
`

type usersProps = {
  start: number
  end: number
}
const resolvers = {
  Query: {
    users(_: null, args: usersProps) {
      return getUsers(args)
    }
  }
}

export async function startApolloServer(app: Express) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
  })

  await server.start()

  app.use(server.getMiddleware({}))
  server.applyMiddleware({ app, path: '/graphql' })
  app.use('/graphql', () => server.start())
}
