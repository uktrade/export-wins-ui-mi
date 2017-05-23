module.exports = function( isDev ){

	const FORCE_HTTPS = ( isDev ? false : true );

	return function( req, res, next ){

		if( FORCE_HTTPS && req.headers[ 'x-forwarded-proto' ] !== 'https' ){

			res.redirect( [ 'https://', req.get( 'Host' ), req.url ].join( '' ) );

		} else {

			next();
		}
	};
};
