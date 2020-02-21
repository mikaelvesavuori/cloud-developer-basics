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
 * @param {string} imageUrl - The URL for the original image
 * @param {string} imageName - The unique UUID image name
 * @param {string} bucketName - The name of the bucket
 * @returns {WritableStream} - Returns stream
 */
exports.uploadImage = async (imageUrl, imageName, bucketName) => {
	const bucket = storage.bucket(bucketName);
	const file = bucket.file(imageName);

	const writeStream = file.createWriteStream();

	return await fetch(imageUrl).then(res => {
		res.body.pipe(writeStream);
	});
};
