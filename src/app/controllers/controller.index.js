
const backendService = require( '../lib/service/service.backend' );

module.exports = function( req, res ){

	backendService.getSectors().then( function( sectors ){

		res.render( 'sector-list.html', { sectors } );

	} ).catch( function( err ){

		res.render( 'error', { error: err } );
	} );
};
