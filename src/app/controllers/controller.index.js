
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = function( req, res ){

	const showOsRegions = req.query.osRegions;

	if( showOsRegions ){

		backendService.getSectorTeamsAndOverseasRegions( req.alice ).then( ( data ) => {

			const sectorTeams = data.sectorTeams;
			const overseasRegions = data.overseasRegions;

			res.render( 'index.html', { sectorTeams, overseasRegions } );

		} ).catch( renderError.createHandler( res ) );

	} else {
	
		backendService.getSectorTeams( req.alice ).then( ( sectorTeams ) => {

			res.render( 'index.html', { sectorTeams } );

		} ).catch( renderError.createHandler( res ) );
	}
};
