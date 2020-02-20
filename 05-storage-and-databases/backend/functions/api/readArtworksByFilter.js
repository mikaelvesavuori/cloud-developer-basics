'use strict';

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();

const { COLLECTION_NAME } = require('../../configuration');

/**
 * Get artwork(s) in the GQL+NoSQL style with filtering just before sending back to client
 * This should ideally be paired with good caching on the client, and also if possible, on the backend
 * Because these serverless functions aren't persisted for very long, this cannot be cached in a classic manner
 *
 * @async
 * @function
 * @param {string} artist - The artist's name
 * @param {string} imageUrl - URL to the Cloud Storage bucket-stored image
 * @param {string} originalImageUrl - URL to the original image
 * @param {string} title - Title of the artwork
 * @param {number} year - Year of the artwork's creation
 * @param {string} uuid - The unique UUID of the artwork
 * @param {array} labels - Array of labels (strings)
 * @param {string} createdByUser - The name of the user who created this artwork listing
 * @returns {array} - Returns array of artwork objects
 * @throws {error} - Throws error if it fails to read from Firestore
 */
exports.readArtworksByFilter = async ({
	artist,
	imageUrl,
	originalImageUrl,
	title,
	year,
	uuid,
	labels,
	createdByUser
}) => {
	return await firestore
		.collection(COLLECTION_NAME)
		.get()
		.then(querySnapshot => {
			const artworks = [];

			querySnapshot.forEach(doc => {
				artworks.push(doc.data());
			});

			return artworks;
		})
		.then(artworks => {
			const SELECTED_ARTWORKS = artworks
				.filter(artwork => {
					return artist ? artwork.artist === artist : artwork;
				})
				.filter(artwork => {
					return imageUrl ? artwork.imageUrl === imageUrl : artwork;
				})
				.filter(artwork => {
					return originalImageUrl ? artwork.originalImageUrl === originalImageUrl : artwork;
				})
				.filter(artwork => {
					return title ? artwork.title === title : artwork;
				})
				.filter(artwork => {
					return year ? artwork.year === year : artwork;
				})
				.filter(artwork => {
					return uuid ? artwork.uuid === uuid : artwork;
				})
				.filter(artwork => {
					return labels ? artwork.labels === labels : artwork;
				})
				.filter(artwork => {
					return createdByUser ? artwork.createdByUser === createdByUser : artwork;
				});

			console.log('SELECTED_ARTWORKS', SELECTED_ARTWORKS);
			return SELECTED_ARTWORKS;
		})
		.catch(error => {
			console.error('Error reading!');
			return error;
		});
};
