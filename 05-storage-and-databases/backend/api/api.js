'use strict';

const { ApolloServer } = require('apollo-server-cloud-functions');
const { typeDefs, resolvers } = require('./schema');

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: true,
	resolverValidationOptions: {
		requireResolversForResolveType: false
	}
});

const server = apolloServer.createHandler({
	cors: {
		origin: '*' // This is just for playing with; please set this to your actual allowed domain
	}
});

module.exports = server;
