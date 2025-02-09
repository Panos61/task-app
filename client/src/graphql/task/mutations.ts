import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      projectID
      assigneeID
      created_at
      updated_at
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: TaskInput!) {
    updateTask(input: $input) {
      id
      title
      description
      status
      priority
      projectID
      assigneeID
      created_at
      updated_at
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($taskID: ID!) {
    deleteTask(taskID: $taskID)
  }
`;
