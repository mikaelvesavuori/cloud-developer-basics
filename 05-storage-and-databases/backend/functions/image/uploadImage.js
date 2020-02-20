const fetch = require('node-fetch');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

/**
 * Upload image to Cloud Storage
 *
 * Reference: https://github.com/googleapis/nodejs-storage/issues/506#issuecomment-436403257
 *
 * @async
 * @function
 * @param {string} uuid - The unique UUID of the artwork
 * @returns {string} - Returns UUID of deleted artwork
 * @throws {error} - Throws error if it fails to delete from Firestore
 */
exports.uploadImage = async (image, imageName, bucketName) => {
	const bucket = storage.bucket(bucketName);
	const file = bucket.file(imageName);
	const writeStream = file.createWriteStream();

	return await fetch(image).then(res => {
		res.body.pipe(writeStream);
	});
};
