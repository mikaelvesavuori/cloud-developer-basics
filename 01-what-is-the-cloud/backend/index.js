'use strict';

const fetch = require('node-fetch');

/*********************************************/
/** 			Get content from DatoCMS					**/
/*********************************************/
exports.getContent = async (request, response) => {
	// Need to set up some CORS stuff, read more at: https://cloud.google.com/functions/docs/writing/http#http_frameworks
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Methods', 'POST');
	response.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	// Make sure to parse stringified content, else leave it be
	console.log('Request.body primitive type', typeof request.body);
	const BODY = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;

	if (BODY.name) {
		const NAME = BODY.name;

		const ENDPOINT_DATO = 'https://graphql.datocms.com/';
		const DATO_TOKEN = '138ff7136e082a49cab0e19c4cd2e6';

		const CONTENT = await fetch(ENDPOINT_DATO, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${DATO_TOKEN}`
			},
			body: JSON.stringify({
				query: '{ article { peptext } }'
			})
		})
			.then(res => res.json())
			.then(res => res.data.article.peptext)
			.then(res => cleanOutput(res))
			.catch(error => {
				console.log(error);
			});

		function cleanOutput(string) {
			const CLEANED_OUTPUT = string.replace('{{NAME}}', NAME);
			return CLEANED_OUTPUT;
		}

		console.log('Returning content:', CONTENT);

		response.status(200).send(JSON.stringify(CONTENT));
	} else response.status(400).send('You need to provide a name in body.name!');
};
