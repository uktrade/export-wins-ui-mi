
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = function( req, res ){

	const showOsRegions = req.query.osRegions;

	if( showOsRegions ){

		backendService.getSectorTeamsAndOverseasRegions( req ).then( ( data ) => {

			const sectorTeams = data.sectorTeams.results;
			const overseasRegionGroups = data.overseasRegionGroups.results;

			res.render( 'index.html', { sectorTeams, overseasRegionGroups } );

		} ).catch( renderError.createHandler( res ) );

	} else {

		backendService.getSectorTeams( req ).then( ( sectorTeams ) => {

			res.render( 'index.html', { sectorTeams: sectorTeams.results } );

		} ).catch( renderError.createHandler( res ) );
	}
};
