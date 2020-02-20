'use strict';

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();

const { COLLECTION_NAME } = require('../../configuration');

/**
 * Reads artworks by title, from Firestore
 *
 * @async
 * @function
 * @param {string} title - The title of an artwork the user is looking for
 * @returns {array} - Returns array of artworks
 * @throws {error} - Throws error if it fails to read from Firestore
 */
exports.readArtworksByTitle = async title => {
	return await firestore
		.collection(COLLECTION_NAME)
		.where('title', '==', title)
		.get()
		.then(querySnapshot => {
			const artworks = [];

			querySnapshot.forEach(doc => {
				artworks.push(doc.data());
			});

			return artworks;
		})
		.then(artworks => {
			console.log('Success!');
			return artworks;
		})
		.catch(error => {
			console.error('Error reading!');
			return error;
		});
};
