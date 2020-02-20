'use strict';

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();

const { COLLECTION_NAME } = require('../../configuration');

/**
 * Reads all artworks in Firestore
 *
 * @async
 * @function
 * @param {string} title - The project ID for your project
 * @returns {string} - Returns confirmation string
 * @throws {error} - Throws error if it fails to read from Firestore
 */
exports.readArtworks = async title => {
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
			console.log('Success!');
			return artworks;
		})
		.catch(error => {
			console.error('Error reading!');
			return error;
		});
};
