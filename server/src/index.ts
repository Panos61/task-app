import {
  expressMiddleware,
  ExpressMiddlewareOptions,
} from '@apollo/server/express4';
import { ApolloServer, BaseContext } from '@apollo/server';
import { GraphQLError } from 'graphql';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs } from '@/schema/index.js';
import { resolvers } from '@/schema/resolvers.js';
import { getUserIDFromToken } from './utils/jwt.js';

export interface Context extends ExpressMiddlewareOptions<BaseContext> {
  user: {
    id: string;
  } | null;
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const createApolloServer = async () => {
  const server = new ApolloServer<Context>({
    schema,
  });

  await server.start();
  return server;
};

const app = express();
const httpServer = http.createServer(app);
const PORT = 4000;

const bootstrap = async () => {
  const server = new ApolloServer<Context>({
    schema,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers['token'] as string | undefined;
        if (!token) return { user: null };
        try {
          const userID = getUserIDFromToken(token);
          return { user: { id: userID } };
        } catch {
          throw new GraphQLError('Invalid token', {
            extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
          });
        }
      },
    }) as any
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};

bootstrap().catch(console.error);
