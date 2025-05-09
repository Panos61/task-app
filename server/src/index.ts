import express, { Response } from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
  expressMiddleware,
  ExpressMiddlewareOptions,
} from '@apollo/server/express4';
import { ApolloServer, BaseContext } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs } from './schema/index.js';
import { resolvers } from './schema/resolvers.js';

import config from './config.js';
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

const app = express();
const httpServer = http.createServer(app);

const PORT = config.PORT;

const server = new ApolloServer<Context>({
  schema,
  csrfPrevention: false, // Disable CSRF for now to debug
});

await server.start();

app.use(cookieParser());
app.use(
  '/graphql',
  cors<cors.CorsRequest>({
    origin: ['http://localhost:5173', 'http://frontend:5173', 'http://167.235.30.231'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'apollo-require-preflight', 'Authorization'],
  }),
  express.json(),
  // @ts-ignore - Temporary fix for express middleware type mismatch
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      console.log('req', req);
      console.log('res', res);
      const token = req.cookies.token;
      console.log('token', token);
      if (!token) return { user: null, res };

      try {
        const userID = getUserIDFromToken(token);
        console.log('userID', userID);
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
