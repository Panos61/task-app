import { gql } from 'graphql-tag';

export const GET_TASK = gql`
  query Task($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      assigneeID
      projectID
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASKS = gql`
  query Tasks($projectID: ID!) {
    tasks(projectID: $projectID) {
      id
      title
      description
      status
      priority
      assigneeID
      projectID
      createdAt
      updatedAt
    }
  }
`;