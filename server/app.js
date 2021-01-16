import express from "express";
import cors from "cors";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./schema.js";

const app = express();
const PORT = 5000;

// const server = createServer(app);
const apolloServer = new ApolloServer({ resolvers, typeDefs });
apolloServer.applyMiddleware({ app, path: "/graphql" });

const httpServer = createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

app.use(cors());

httpServer.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}/graphql`)
);
