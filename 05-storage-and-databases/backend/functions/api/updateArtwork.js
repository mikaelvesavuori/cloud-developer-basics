'use strict';

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();

const { COLLECTION_NAME } = require('../../configuration');

/**
 * Updates an artwork
 *
 * @async
 * @function
 * @param {object} artwork - Artwork data fields
 * @returns {string} - Returns confirmation string
 * @throws {error} - Throws error if it fails to update with Firestore
 */
exports.updateArtwork = async artwork => {
	const UUID = artwork.uuid;
	const DOCUMENT = {
		...artwork
	};

	return await firestore
		.collection(COLLECTION_NAME)
		.doc(UUID)
		.update(DOCUMENT)
		.then(success => {
			console.log('updateArtwork ||| Success!', success);
			return {
				artwork
			};
		})
		.catch(error => {
			console.error('updateArtwork ||| Error updating!');
			return error;
		});
};
