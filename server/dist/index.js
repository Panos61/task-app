import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { typeDefs } from '@/typeDefs/index.js';
import { resolvers } from '@/resolvers/index.js';
const startServer = async () => {
    const app = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();
    app.use('/graphql', cors(), express.json(), expressMiddleware(server, {
        context: async ({ req }) => {
            const token = req.headers['token'];
            return { token };
        },
    }));
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
};
startServer().catch((error) => {
    console.error('Error starting server:', error);
});
