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

export const GET_PROJECTS = gql`
  query projects($ownerID: ID! ) {
    projects(ownerID: $ownerID) {
      id
      name
      color
      invitation
      taskCount
    }
  }
`