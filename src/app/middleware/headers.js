const cspValues = [

	`default-src 'none'`,
	`base-uri 'self'`,
	`script-src 'self' 'unsafe-inline' www.google-analytics.com`,
	`style-src 'self' 'unsafe-inline'`,
	`font-src 'self'`,
	`img-src 'self' www.google-analytics.com`,
	`form-action 'self'`,
	`connect-src 'self'`

].join( ';' );

module.exports = function( isDev ){

	return function( req, res, next ){

		res.setHeader( 'X-Download-Options', 'noopen' );
		res.setHeader( 'X-XSS-Protection', '1; mode=block' );
		res.setHeader( 'X-Content-Type-Options', 'nosniff' );
		res.setHeader( 'X-Frame-Options', 'deny' );
		res.setHeader( 'Content-Security-Policy', cspValues );
		res.setHeader( 'Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate, private' );
		res.setHeader( 'Pragma', 'no-cache' );

		if( !isDev ){
			res.setHeader( 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload' );
		}

		next();
	};
};
