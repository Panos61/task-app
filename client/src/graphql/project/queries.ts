import { gql } from '@apollo/client';

export const GET_PROJECT = gql`
  query project($projectID: ID!) {
    project(projectID: $projectID) {
      id
      name
      color
      invitation
      taskCount
    }
  }
`;

export const GET_OWN_PROJECTS = gql`
  query GetOwnProjects($ownerID: ID! ) {
    getOwnProjects(ownerID: $ownerID) {
      id
      name
      color
      invitation
      taskCount
    }
  }
`

export const GET_PROJECTS = gql`
  query GetProjects {
    getProjects {
      id
      name
      color
      invitation
      taskCount
    }
  }
`