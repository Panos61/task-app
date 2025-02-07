import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      created_at
    }
  }
`;

export const GET_USERS = gql`
  query Users($projectID: ID!) {
    users(projectID: $projectID) {
      id 
      username
    }
  }
`

