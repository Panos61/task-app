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

export const GET_OVERVIEW = gql`
  query Overview {
    overview {
      id
      projectCount
      tasksCompleted
      tasksAssigned
      collaborators
      projects {
        id
        name
        color
      }
      tasks { 
        id
        title
        description
        status
        priority
        assigneeID
      }
    }
  }
`
