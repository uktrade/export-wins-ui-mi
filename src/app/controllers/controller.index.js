
const backendService = require( '../lib/service/service.backend' );

module.exports = function( req, res ){

	backendService.getSectorsAndRegions().then( function( data ){

			const sectors = data[ 0 ];
			const regions = data[ 1 ];

			res.render( 'index.html', { sectors, regions } );

		} ).catch( function( err ){

			res.render( 'error', { error: err } );
		} );
};
