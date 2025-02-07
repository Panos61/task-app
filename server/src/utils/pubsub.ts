import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export const EVENTS = {
  TASK_CREATED: 'TASK_CREATED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_DELETED: 'TASK_DELETED',
};
