
const exportBackendService = require( '../lib/service/service.backend' ).export;
const renderError = require( '../lib/render-error' );
const sortWins = require( '../lib/sort-wins' );

const hvcDetail = require( '../lib/view-models/hvc-detail' );
const topMarkets = require( '../lib/view-models/top-markets' );

module.exports = {

	hvc: function( req, res ){

		const hvcId = req.params.id;

		exportBackendService.getHvcInfo( req, hvcId ).then( ( info ) => {

			const viewModel = hvcDetail.create( info.hvc );

			viewModel.topMarkets = topMarkets.create( info.markets );

			res.render( 'hvc/detail.html', viewModel );

		} ).catch( renderError.createHandler( req, res ) );
	},

	winList: function( req, res ){

		const hvcId = req.params.id;

		exportBackendService.getHvcWinList( req, hvcId ).then( ( data ) => {

			res.render( 'hvc/wins.html', {
				dateRange: data.date_range,
				hvc: data.results.hvc,
				wins: sortWins( data.results.wins.hvc, req.query.sort )
			} );

		} ).catch( renderError.createHandler( req, res ) );
	}
};
