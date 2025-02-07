import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($input: AuthInput!) {
    register(input: $input) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: AuthInput!) {
    login(input: $input) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`
