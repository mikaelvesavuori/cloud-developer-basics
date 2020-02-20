'use strict';

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();

const { COLLECTION_NAME } = require('../../configuration');

/**
 * Deletes artwork from Firestore
 *
 * @async
 * @function
 * @param {string} uuid - The unique UUID of the artwork
 * @returns {string} - Returns UUID of deleted artwork
 * @throws {error} - Throws error if it fails to delete from Firestore
 */
exports.deleteArtwork = async uuid => {
	return await firestore
		.collection(COLLECTION_NAME)
		.doc(uuid)
		.delete()
		.then(() => {
			console.log('deleteArtwork ||| Success!');
			return {
				uuid
			};
		})
		.catch(error => {
			console.error('deleteArtwork ||| Error deleting!');
			return error;
		});
};
