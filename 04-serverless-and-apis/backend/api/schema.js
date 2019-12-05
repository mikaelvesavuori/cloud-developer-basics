// Dependencies
const { gql } = require('apollo-server-cloud-functions');

// Helper functions
const { artworks } = require('../helpers/artworks');
const { invokeFunction } = require('../helpers/invokeFunction');

// Your own functions or business logic
const { helloWorld } = require('../functions/helloWorld');
const { postMessageToPubSub } = require('../functions/postMessageToPubSub');

// Configuration
const { REGION, PROJECT_ID, TOPIC_NAME } = require('../configuration');

const typeDefs = gql`
	# The basic shape of an artwork
	type Artwork {
		artist: String
		imageUrl: String
		title: String
		year: Int
		uuid: String
		labels: [String]
	}

	# The basic shape of an image
	type ImageLabels {
		labels: [String]
	}

	# The shape of image response
	type ImagePayload {
		imageLabels: ImageLabels
	}

	# Any queries that can be made
	type Query {
		helloWorld: String
		getArtworks: [Artwork]
		getArtworkByTitle(title: String!): Artwork
		postMessageToPubSub: String
	}

	# Any mutations that can be made
	type Mutation {
		getLabels(imageUrl: String!): ImageLabels
	}
`;

const resolvers = {
	Query: {
		// Function bundled in API, á la "monolith" style
		helloWorld: () => helloWorld(),

		// Get all artworks from local data file
		getArtworks: () => artworks,

		// Get individual artwork by title from the local data file
		getArtworkByTitle: (_, { title }) => artworks.find(artwork => artwork.title === title),

		// Publish a message to a Pub/Sub queue, which will trigger our integration function
		postMessageToPubSub: async () => await postMessageToPubSub(PROJECT_ID, TOPIC_NAME)
	},
	Mutation: {
		// External function; "microservice"-style, called with helper "invoker" function
		getLabels: async (_, { imageUrl }) => {
			return new Promise(async resolve => {
				const ENDPOINT = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/getLabels`; // Set vars in 'configuration.js'; point to your separately uploaded image labeling service
				const res = await invokeFunction(ENDPOINT, { imageUrl: imageUrl });
				resolve(res);
			}).then(labels => {
				console.log('Labels:', labels);
				return { labels };
			});
		}
	}
};

module.exports = { typeDefs, resolvers };
