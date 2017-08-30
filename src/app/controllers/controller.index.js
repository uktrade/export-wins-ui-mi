
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );
const globalSummary = require( '../lib/view-models/global-summary' );

module.exports = function( req, res ){

	backendService.getHomepageData( req ).then( ( data ) => {

		const showUkRegions = !!req.query.ukRegions;

		const sectorTeams = data.sectorTeams.results;
		const overseasRegionGroups = data.overseasRegionGroups.results;
		const ukRegions = ( showUkRegions ? data.ukRegions.results : [] );
		const globalHvcs = data.globalHvcs.results;
		const summary = globalSummary.create( data.globalWins );

		res.render( 'index.html', { sectorTeams, overseasRegionGroups, ukRegions, globalHvcs, summary } );

	} ).catch( renderError.createHandler( res ) );
};
