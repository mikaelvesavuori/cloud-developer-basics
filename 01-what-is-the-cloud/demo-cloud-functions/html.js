'use strict';

exports.html = (request, response) => {
	const HTML = `<html><head><title>HTML page rendered from a function</title></head><body><h1>HTML page rendered from a function</h1><p>Amazing, amirite? :)</p></body></html>`;
	response.status(200).send(HTML);
};
