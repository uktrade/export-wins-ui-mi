
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = function( req, res ){

	backendService.getHomepageData( req ).then( ( data ) => {

		const sectorTeams = data.sectorTeams.results;
		const overseasRegionGroups = data.overseasRegionGroups.results;
		const globalHvcs = data.globalHvcs.results;

		res.render( 'index.html', { sectorTeams, overseasRegionGroups, globalHvcs } );

	} ).catch( renderError.createHandler( res ) );
};
