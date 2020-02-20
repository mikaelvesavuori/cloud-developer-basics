'use strict';

const functions = require('firebase-functions');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

// Set these values in serverless.yml
const DOCUMENT_PATH = process.env.DOCUMENT_PATH;
const BUCKET_NAME = process.env.BUCKET_NAME;

/**
 * Firestore trigger to delete an image, when its corresponding Firestore document gets deleted
 *
 * Reference: https://firebase.google.com/docs/functions/firestore-events
 *
 * @function
 * @throws {error} - Throws error if it fails to delete from Firestore
 */
exports.deleteImage = functions.firestore
	.document(DOCUMENT_PATH)
	.onDelete(async (change, context) => {
		const OLD_DATA = change.data();
		const IMAGE_URL = OLD_DATA.imageUrl;
		const FILE_FORMAT_SPLIT_POINT = IMAGE_URL.lastIndexOf('.');
		const FILE_FORMAT = IMAGE_URL.slice(FILE_FORMAT_SPLIT_POINT, IMAGE_URL.length);
		const ARTWORK_UUID = context.params.artworkUuid;
		console.log(`Removing ${ARTWORK_UUID}${FILE_FORMAT}`);

		return await storage
			.bucket(BUCKET_NAME)
			.file(`${ARTWORK_UUID}${FILE_FORMAT}`)
			.delete();
	});
