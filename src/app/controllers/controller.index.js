
const backendService = require( '../lib/service/service.backend' );

module.exports = function( req, res ){

	backendService.getSectorTeamsAndRegions( req.alice ).then( function( data ){

			const sectorTeams = data[ 0 ];
			const regions = data[ 1 ];

			res.render( 'index.html', { sectorTeams, regions } );

		} ).catch( function( err ){

			res.render( 'error', { error: err } );
		} );
};
