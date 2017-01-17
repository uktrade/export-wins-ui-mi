
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = function( req, res ){

	backendService.getSectorTeamsAndRegions( req.alice ).then( function( data ){

			const sectorTeams = data[ 0 ];
			const regions = data[ 1 ];

			res.render( 'index.html', { sectorTeams, regions } );

		} ).catch( renderError( res ) );
};
