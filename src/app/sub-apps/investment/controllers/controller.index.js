const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );
const overviewViewModel = require( '../view-models/fdi-overview' );

module.exports = function( req, res ){

	fdiService.getHomepageData( req ).then( ( data ) => {

		res.render( 'investment/views/index', {

			dateRange: data.overview.date_range,
			overview: overviewViewModel.create( data.overview.results ),
			overviewYoy: data.overviewYoy,
			sectorTeams: data.sectorTeams,
			overseasRegions: data.overseasRegions,
			ukRegions: data.ukRegions,
			showSectorTeams: !!req.user.experiments,
			showOverseasRegions: !!req.user.experiments,
			showUkRegions: !!req.user.experiments
		} );

	} ).catch( renderError.createHandler( req, res ) );
};
