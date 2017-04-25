
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = function( req, res ){

	const showOsRegions = req.query.osRegions;

	if( showOsRegions ){

		backendService.getSectorTeamsAndOverseasRegions( req.alice, req.year ).then( ( data ) => {

			const sectorTeams = data.sectorTeams.results;
			const overseasRegionGroups = data.overseasRegionGroups;

			res.render( 'index.html', { sectorTeams, overseasRegionGroups } );

		} ).catch( renderError.createHandler( res ) );

	} else {

		backendService.getSectorTeams( req.alice, req.year ).then( ( sectorTeams ) => {

			res.render( 'index.html', { sectorTeams: sectorTeams.results } );

		} ).catch( renderError.createHandler( res ) );
	}
};
