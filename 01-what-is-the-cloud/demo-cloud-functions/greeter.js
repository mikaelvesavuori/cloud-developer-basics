'use strict';

exports.greeter = (request, response) => {
	if (request.query.message || request.body.message) {
		const NAME = request.query.message || request.body.message;
		response.status(200).send(`Hi there ${NAME}!`);
	} else response.status(400).send('You need to provide a name in body.message!');
};
