'use strict';

exports.hello = (request, response) => {
	response.status(200).send('Hello World!');
};