const url = require('url');
const config = require('../config');

module.exports = function(req){
	const protocol = config.isDev ? req.protocol : 'https';
	
	const callbackUrl = url.format({
		protocol: protocol,
		host: req.get('host'),
		pathname: '/login/callback/'
	});

	
	return callbackUrl;
};
