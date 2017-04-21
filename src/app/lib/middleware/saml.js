const backendService = require( '../service/service.backend' );

module.exports = function( req, res, next ){

	if( req.url === '/saml2/metadata/' ){

		backendService.getSamlMetadata( req.alice ).then( ( xml ) => {

			res.set( 'Content-Type', 'text/xml' );
			res.send( xml );

		} ).catch( next );

	} else {

		next();
	}
};
