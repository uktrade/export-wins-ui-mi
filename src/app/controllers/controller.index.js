
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = function( req, res ){

		backendService.getSectorTeamsAndOverseasRegions( req ).then( ( data ) => {

			const sectorTeams = data.sectorTeams.results;
			const overseasRegionGroups = data.overseasRegionGroups.results;

			res.render( 'index.html', { sectorTeams, overseasRegionGroups } );

		} ).catch( renderError.createHandler( res ) );
};
