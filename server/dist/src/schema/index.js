import { gql } from 'graphql-tag';
export const typeDefs = gql `
  type User {
    id: ID!
    username: String!
    created_at: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
  
  type Project { 
    id: String!
    name: String!
    color: String!
    owner_id: String!
    created_at: String!
    updated_at: String!
  }
  
  type Task {
    id: String!
    title: String!
    description: String
    status: String!
    projectID: String!
    assigneeID: String!
    created_at: String!
    updated_at: String
  }
  
  input TaskInput {
    title: String!
    description: String
    status: String!
    projectID: String!
    assigneeID: String!
  }
  
  input RegisterInput {
    username: String!
    password: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }
  
  input CreateProjectInput {
    name: String!
    color: String!
  }
  
  type Query {
    me: User!
    users: [User!]!
    getProjects(ownerID: ID!): [Project]!
    getTasks(projectID: ID!): [Task]!
    getAssignedTasks(assigneeID: ID!): [Task]!
  }
  
  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: Boolean!
    deleteAccount: Boolean!
    createProject(input: CreateProjectInput): Project!
    createTask(input: TaskInput): Task!
  }
`;
