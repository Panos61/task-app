import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      color
      invitation
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectID: ID!) {
    deleteProject(projectID: $projectID)
  }
`;

export const JOIN_PROJECT = gql`
  mutation JoinProject($invitation: String!) {
    joinProject(invitation: $invitation) {
      id
      name
      color
      invitation
    }
  }
`;
