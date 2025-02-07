import { gql } from 'graphql-tag';

export const TASK_CREATED_SUBSCRIPTION = gql`
  subscription TaskCreated($projectID: ID!, $title: String!, $description: String, $status: String) {
    taskCreated(projectID: $projectID, title: $title, description: $description, status: $status) {
      id
      title
      description
      assignee {
        id
        name
      }
    }
  }
`;

export const TASK_UPDATED_SUBSCRIPTION = gql`
  subscription TaskUpdated(
    $projectID: ID!
    $title: String!
    $description: String!
    $status: String!
  ) {
    taskUpdated(
      projectID: $projectID
      title: $title
      description: $description
      status: $status
    ) {
      id
      title
      description
      assignee {
        id
        name
      }
      status
    }
  }
`;

export const TASK_DELETED_SUBSCRIPTION = gql`
  subscription TaskDeleted($taskID: ID!) {
    taskDeleted(taskID: $taskID)
  }
`;
