import { gql } from 'graphql-tag';

export const typeDefs = gql`
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
    invitation: String!
    owner_id: String!
    taskCount: Int!
    created_at: String!
    updated_at: String!
  }

  input AuthInput {
    username: String!
    password: String!
  }

  input CreateProjectInput {
    name: String!
    color: String!
  }

  type Task {
    id: ID!
    title: String
    description: String
    status: String
    projectID: ID
    assigneeID: ID
    created_at: String
    updated_at: String
  }

  input TaskInput {
    id: ID
    title: String
    description: String
    status: String
    projectID: String
    assigneeID: String
  }

  type Query {
    me: User!
    users(projectID: ID!): [User!]!
    project(projectID: ID!): Project!
    getOwnProjects(ownerID: ID!): [Project]!
    getProjects: [Project]!
    task(id: ID!): Task!
    tasks(projectID: ID!): [Task]!
    getAssignedTasks(assigneeID: ID!): [Task]!
  }

  type Mutation {
    register(input: AuthInput!): AuthPayload!
    login(input: AuthInput!): AuthPayload!
    logout: Boolean!
    deleteAccount: Boolean!
    createProject(input: CreateProjectInput): Project!
    joinProject(invitation: String!): Project!
    deleteProject(projectID: ID!): Boolean!
    createTask(input: TaskInput): Task
    updateTask(input: TaskInput): Task
    deleteTask(taskID: ID!): Boolean!
  }

  type Subscription {
    taskCreated(
      projectID: ID!
      title: String!
      description: String
      status: String
    ): Task!
    taskUpdated(
      projectID: ID!
      title: String!
      description: String!
      status: String!
    ): Task!
    taskDeleted(taskID: ID!): ID!
  }
`;
