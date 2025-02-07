import { ExpressMiddlewareOptions } from '@apollo/server/express4';
import { ApolloServer, BaseContext } from '@apollo/server';
export interface Context extends ExpressMiddlewareOptions<BaseContext> {
    user: {
        id: string;
    } | null;
}
export declare const createApolloServer: () => Promise<ApolloServer<Context>>;
