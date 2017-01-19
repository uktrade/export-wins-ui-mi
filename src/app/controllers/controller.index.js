
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = function( req, res ){

	backendService.getSectorTeamsAndOverseasRegions( req.alice ).then( ( data ) => {

			const sectorTeams = data[ 0 ];
			const overseasRegions = data[ 1 ];

			//console.log( JSON.stringify( data, null, 2 ) );

			res.render( 'index.html', { sectorTeams, overseasRegions } );

		} ).catch( renderError.handler( res ) );
};
