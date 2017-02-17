
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = function( req, res ){

	const showOsRegions = req.query.osRegions;

	if( showOsRegions ){

		backendService.getSectorTeamsAndOverseasRegions( req.alice ).then( ( data ) => {

			const sectorTeams = data[ 0 ];
			const overseasRegions = data[ 1 ];

			//console.log( JSON.stringify( data, null, 2 ) );

			res.render( 'index.html', { sectorTeams, overseasRegions } );

		} ).catch( renderError.handler( res ) );

	} else {
	
		backendService.getSectorTeams( req.alice ).then( ( sectorTeams ) => {

			//console.log( JSON.stringify( data, null, 2 ) );

			res.render( 'index.html', { sectorTeams } );

		} ).catch( renderError.handler( res ) );			
	}
};
