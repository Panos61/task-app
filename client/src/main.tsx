import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import App from './App.tsx';
import './index.css';

// Use environment-aware API URL
const isDevelopment = import.meta.env.DEV;
const apiUrl = isDevelopment 
  ? 'http://localhost:4000/graphql'  // Development
  : '/graphql';                      // Production

console.log('API URL:', apiUrl, 'Environment:', isDevelopment ? 'development' : 'production');

const httpLink = createHttpLink({
  uri: apiUrl,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ extensions }) => {
      if (extensions?.code === 'UNAUTHENTICATED') {
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      }
    });
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  credentials: 'include',
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
