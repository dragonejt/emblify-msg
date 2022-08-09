require("dotenv").config()
const fs = require("fs")
const { ApolloServer, gql } = require("apollo-server")
const mongoose = require("mongoose")
const Query = require("./src/resolvers/queries")
const Mutation = require("./src/resolvers/mutations")

ALLOWED_HOSTS = ["https://api.emblify.me", "138.197.227.144", "127.0.0.1"]
mongoose.connect(process.env.MONGO_URL)

// Construct a schema, using GraphQL schema language

const typeDefs = gql(fs.readFileSync("./src/schema.gql", "utf-8"))

// The root provides a resolver function for each API endpoint
const resolvers = { Query, Mutation }

if (process.env.ENV != "prod") {
    // Allows Apollo Studio access if not in production
    ALLOWED_HOSTS.push("https://studio.apollographql.com")
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    cors: {
        origin: ALLOWED_HOSTS
    }
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});