const SESSION_COOKIE = 'sessionid=';

module.exports = function( cookies = [] ){

	return cookies.reduce( ( str, cookie ) => {

		if( cookie.startsWith( SESSION_COOKIE ) ){

			return cookie;
		}

		return str;

	}, '' );
};
