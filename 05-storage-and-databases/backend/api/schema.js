// Dependencies
const { gql } = require('apollo-server-cloud-functions');

// Helper functions
const { invokeFunction } = require('../helpers/invokeFunction');

// New functions that use the database
const { createArtwork } = require('../functions/api/createArtwork');
const { readArtworks } = require('../functions/api/readArtworks');
const { readArtworksByTitle } = require('../functions/api/readArtworksByTitle');
const { readArtworksByFilter } = require('../functions/api/readArtworksByFilter');
const { updateArtwork } = require('../functions/api/updateArtwork');
const { deleteArtwork } = require('../functions/api/deleteArtwork');

// Configuration
const { REGION, PROJECT_ID, TOPIC_NAME } = require('../configuration');

const typeDefs = gql`
	# The basic shape of an artwork
	type Artwork {
		artist: String
		imageUrl: String
		originalImageUrl: String
		title: String
		year: Int
		uuid: String
		labels: [String]
		createdByUser: String
	}

	# The shape of artwork input data
	input ArtworkInput {
		artist: String!
		imageUrl: String!
		title: String
		year: Int
		createdByUser: String
	}

	# The shape of artwork (update) input data
	input UpdateArtworkInput {
		artist: String
		imageUrl: String
		title: String
		year: Int
		uuid: String!
	}

	# The basic shape of an image
	type ImageLabels {
		labels: [String]
	}

	type ArtworkDbUpdateEvent {
		artwork: Artwork
	}

	type ArtworkDbDeleteEvent {
		uuid: String
	}

	# Any queries that can be made
	type Query {
		getArtworks: [Artwork]
		getArtworkByTitle(title: String!): [Artwork]
		getArtworkByFilter(
			artist: String
			imageUrl: String
			originalImageUrl: String
			title: String
			year: Int
			uuid: String
			labels: [String]
			createdByUser: String
		): [Artwork]
	}

	# Any mutations that can be made
	type Mutation {
		getLabels(imageUrl: String!): ImageLabels
		createArtwork(artwork: ArtworkInput!): Artwork
		updateArtwork(artwork: UpdateArtworkInput!): ArtworkDbUpdateEvent
		deleteArtwork(uuid: String!): ArtworkDbDeleteEvent
	}
`;

const resolvers = {
	Query: {
		// Get all artworks from Firestore
		getArtworks: async () => await readArtworks(),

		// Get individual artwork by title in the typical REST+SQL style; note that the second parameter is 'arguments'
		getArtworkByTitle: async (_, { title }) => await readArtworksByTitle(title),

		// Get artwork(s) in the GQL+NoSQL style with filtering just before sending back to client
		getArtworkByFilter: async (_, args) => await readArtworksByFilter(args)
	},
	Mutation: {
		// External function
		getLabels: async (_, { imageUrl }) => {
			return new Promise(async (resolve, reject) => {
				const ENDPOINT = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/getLabels`; // Make sure that this exactly matches your own function name from the image labeling service that you should have deployed (https://github.com/mikaelvesavuori/gcp-ml-image-labeling-service)
				const res = await invokeFunction(ENDPOINT, imageUrl);
				resolve(res);
			}).then(labels => {
				console.log('Labels:', labels);
				return { labels };
			});
		},
		// Local bundled CRUD functions
		createArtwork: async (_, { artwork }) => await createArtwork(artwork),
		updateArtwork: async (_, { artwork }) => await updateArtwork(artwork),
		deleteArtwork: async (_, { uuid }) => await deleteArtwork(uuid)
	}
};

module.exports = { typeDefs, resolvers };
