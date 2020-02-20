'use strict';

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();
const uuidv4 = require('uuid/v4');

const { uploadImage } = require('../image/uploadImage');
const { invokeFunction } = require('../../helpers/invokeFunction');
const { REGION, PROJECT_ID, BUCKET_NAME, COLLECTION_NAME } = require('../../configuration');

/**
 * Creates artwork in Firestore
 *
 * @async
 * @function
 * @param {string} artist - The artist's name
 * @param {string} imageUrl - URL to the image
 * @param {string} title - Title of the artwork
 * @param {number} year - Year of the artwork's creation
 * @param {string} createdByUser - The name of the user who created this artwork listing
 * @returns {object} - Returns artwork object
 * @throws {error} - Throws error if it fails to create in Firestore
 */
exports.createArtwork = async ({ artist, imageUrl, title, year, createdByUser }) => {
	if (artist && imageUrl && title && year && createdByUser) {
		const UUID = uuidv4();

		const FILE_FORMAT_SPLIT_POINT = imageUrl.lastIndexOf('.');
		const FILE_FORMAT = imageUrl.slice(FILE_FORMAT_SPLIT_POINT, imageUrl.length);
		const IMAGE_NAME = `${UUID}${FILE_FORMAT}`;

		const DOCUMENT = {
			artist,
			originalImageUrl: imageUrl,
			imageUrl: `https://storage.cloud.google.com/${BUCKET_NAME}/${IMAGE_NAME}`,
			title,
			year,
			uuid: UUID,
			labels: [],
			createdByUser
		};

		const upload = await new Promise(async (resolve, reject) => {
			try {
				await uploadImage(imageUrl, IMAGE_NAME, BUCKET_NAME);
				resolve();
			} catch (error) {
				reject(error);
			}
		});

		const getLabels = await new Promise(async (resolve, reject) => {
			try {
				// Make sure that this exactly matches your own function name from the image labeling service that you should have deployed (https://github.com/mikaelvesavuori/gcp-ml-image-labeling-service)
				const ENDPOINT = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/getLabels`;
				const labels = await invokeFunction(ENDPOINT, { imageUrl: imageUrl })
					.then(labels => {
						DOCUMENT.labels = labels;
						console.log('createArtwork ||| Document that will be set in database:', DOCUMENT);
					})
					.then(res => resolve(res));
			} catch (error) {
				console.error('createArtwork ||| Failed to get labels from image!', error);
				reject(error);
			}
		});

		const addEntry = await new Promise(async (resolve, reject) => {
			try {
				await firestore
					.doc(`${COLLECTION_NAME}/${UUID}`)
					.set(DOCUMENT)
					.then(() => {
						resolve();
					})
					.catch(error => {
						console.error('createArtwork ||| Error creating entry in Firestore!');
						reject(error);
					});
			} catch (error) {
				console.error('createArtwork ||| Failed adding entry to Firestore!', error);
				reject(error);
			}
		});

		return await Promise.all([upload, getLabels, addEntry])
			.then(() => {
				return DOCUMENT;
			})
			.catch(error => {
				return error;
			});
	} else {
		const ERROR_MESSAGE =
			'Missing one or more required fields: "artist", "imageUrl", "title", "year", "createdByUser"!';
		throw new Error(ERROR_MESSAGE);
	}
};
