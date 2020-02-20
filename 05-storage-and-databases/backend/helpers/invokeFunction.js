const fetch = require('node-fetch');

/**
 * Invokes another function through node-fetch; used for chaining functions
 *
 * @async
 * @function
 * @param {string} endpoint - Endpoint URL
 * @param {any} body - The body for the request
 * @returns {Promise} - Returns resolved promise
 */
exports.invokeFunction = async function(endpoint, body) {
	console.log('invokeFunction body', body);
	return new Promise(async (resolve, reject) => {
		await fetch(endpoint, {
			method: 'POST',
			body: JSON.stringify(body)
		})
			.then(async res => {
				const result = await res.json();
				resolve(result);
			})
			.catch(error => {
				console.log('Error', error);
				reject(error);
			});
	});
};
