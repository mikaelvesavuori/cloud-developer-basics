'use strict';

const { ApolloServer } = require('apollo-server-cloud-functions');
const { typeDefs, resolvers } = require('./schema');

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	playground: true,
	introspection: true,
	resolverValidationOptions: {
		requireResolversForResolveType: false
	}
});

const server = apolloServer.createHandler({
	cors: {
		origin: '*',
		credentials: true
	}
});

module.exports = server;
