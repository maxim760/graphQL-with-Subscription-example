import { ApolloServer, gql } from "apollo-server-express";
import { PubSub } from "apollo-server";

const pubsub = new PubSub();

const users = [{ id: 1, username: "Vasya", age: 22 }];
const mark = { pluses: 0 };

const PLUS_ADDED = "PLUS_ADDED";

export const typeDefs = gql`
  type User {
    id: ID
    username: String
    age: Int
    posts: [Post]
  }
  type Post {
    id: ID
    title: String
    content: String
  }
  type Mark {
    pluses: Int
  }

  input UserInput {
    id: ID
    username: String!
    age: Int!
    posts: [PostInput!]
  }
  input UsernameInput {
    id: ID!
    username: String!
  }
  input PostInput {
    id: ID
    title: String!
    content: String!
  }

  type Query {
    getAllUsers: [User]
    getUser(id: ID!): User
    getPluses: Mark
  }
  type Mutation {
    createUser(input: UserInput): User
    addPlus: Mark
    updateUserUsername(user: UsernameInput): User
    deleteUser(id: ID!): User
  }
  type Subscription {
    pluses: Mark
  }
`;

export const resolvers = {
  Query: {
    getAllUsers() {
      console.log(users);
      return users;
    },
    getUser(_, { id }) {
      console.log(id);
      return users.find((user) => user.id == id);
    },
    getPluses() {
      return mark;
    },
  },
  Mutation: {
    addPlus() {
      mark.pluses += 1;
      console.log(mark.pluses);
      pubsub.publish(PLUS_ADDED, { pluses: mark });
      return mark;
    },
    createUser(_, { input }) {
      const id = Date.now();
      const user = { id, ...input };
      users.splice(-1, 0, user);
      return user;
    },
    deleteUser(_, { id }) {
      const index = users.findIndex((user) => user.id == id);
      const deleted = users.splice(index, 1);

      return deleted[0];
    },
    updateUserUsername(_, { user: { username, id } }) {
      console.log("update:", username, id);
      const index = users.findIndex((user) => user.id == id);
      users[index].username = username;
      return users[index];
    },
  },
  Subscription: {
    pluses: {
      subscribe: () => pubsub.asyncIterator(PLUS_ADDED),
    },
  },
};
