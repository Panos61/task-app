import { gql } from 'graphql-tag';

export const GET_TASK = gql`
  query task($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      assigneeID
      projectID
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($projectID: ID!) {
    tasks(projectID: $projectID) {
      id
      title
      description
      status
      priority
      assigneeID
      projectID
    }
  }
`;

export const GET_ASSIGNED_TASKS = gql`
  query getAssignedTasks($projectID: ID!) {
    assignedTasks(projectID: $projectID) {
      id
      title
      description
      status
      priority
      assigneeID
      projectID
    }
  }
`;