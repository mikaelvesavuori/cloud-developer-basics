const fetch = require('node-fetch');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

/**
 * Make file in Cloud Storage publicly accessible
 *
 * Reference: https://github.com/googleapis/nodejs-storage/blob/master/samples/makePublic.js
 *
 * @async
 * @function
 * @param {string} bucketName - The name of the bucket
 * @param {string} imageName - The unique UUID image name
 * @returns {boolean} - Returns true if operation succeeeds
 * @throws {error} - Throws error if it fails to make file public
 */
exports.makePublic = async (bucketName, imageName) => {
	try {
		await storage
			.bucket(bucketName)
			.file(imageName)
			.makePublic();

		return true;
	} catch (error) {
		console.error('makePublic ||| Failed to make file public!', error);
		return false;
	}
};
