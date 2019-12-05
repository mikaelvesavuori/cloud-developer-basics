'use strict';

const { PubSub } = require('@google-cloud/pubsub');

/**
 * Posts message to Cloud Pub/Sub
 *
 * @async
 * @function
 * @param {string} projectId - The project ID for your project
 * @param {string} topicName - The name of your topic
 * @returns {string} - Returns confirmation string
 */
exports.postMessageToPubSub = async function(projectId, topicName) {
	const pubsub = new PubSub({ projectId });
	const data = JSON.stringify({ foo: 'bar' });
	const dataBuffer = Buffer.from(data);
	const messageId = await pubsub.topic(topicName).publish(dataBuffer);

	console.log(`Message ${messageId} published.`);
	return `Message ${messageId} published.`;
};
