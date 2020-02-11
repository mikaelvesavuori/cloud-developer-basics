'use strict';

const { ApolloServer } = require('apollo-server-cloud-functions');
const { typeDefs, resolvers } = require('./schema');

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	resolverValidationOptions: {
		requireResolversForResolveType: false
	}
});

const server = apolloServer.createHandler({
	cors: {
		origin: '*' // This is just for playing with; please set this to your actual allowed domain
		//credentials: true // If you need to authenticate
	}
});

module.exports = server;
