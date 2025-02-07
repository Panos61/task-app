import { expressMiddleware, } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { GraphQLError } from 'graphql';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from '@/schema/index.js';
import { resolvers } from '@/schema/resolvers.js';
import { getUserIDFromToken } from './utils/jwt.js';
export const createApolloServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();
    return server;
};
const app = express();
const httpServer = http.createServer(app);
const PORT = 4000;
const bootstrap = async () => {
    const server = await createApolloServer();
    app.use('/graphql', cors(), express.json(), expressMiddleware(server, {
        context: async ({ req }) => {
            const token = req.headers['token'];
            if (!token)
                return { user: null };
            try {
                const userID = getUserIDFromToken(token);
                return { user: { id: userID } };
            }
            catch {
                throw new GraphQLError('Invalid token', {
                    extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
                });
            }
        },
    }));
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};
bootstrap().catch(console.error);
