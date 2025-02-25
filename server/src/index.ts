import express, { Response } from 'express';
import http from 'http';
import {
  expressMiddleware,
  ExpressMiddlewareOptions,
} from '@apollo/server/express4';
import { ApolloServer, BaseContext } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { typeDefs } from '@/schema/index.js';
import { resolvers } from '@/schema/resolvers.js';
import { getUserIDFromToken } from './utils/jwt.js';

export interface Context extends ExpressMiddlewareOptions<BaseContext> {
  user: {
    id: string;
  } | null;
  res: Response;
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const createApolloServer = async () => {
  const server = new ApolloServer<Context>({
    schema,
    csrfPrevention: true,
  });

  await server.start();
  return server;
};

const app = express();
app.use(cookieParser());

const httpServer = http.createServer(app);
const PORT = 4000;

const bootstrap = async () => {
  const server = new ApolloServer<Context>({
    schema,
    csrfPrevention: true,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }),
    express.json(),
    // @ts-ignore - Temporary fix for express middleware type mismatch
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = req.cookies.token;
        if (!token) return { user: null, res };

        try {
          const userID = getUserIDFromToken(token);
          return { user: { id: userID }, res };
        } catch {
          res.clearCookie('token');
          throw new GraphQLError('Invalid token');
        }
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};

bootstrap().catch(console.error);
