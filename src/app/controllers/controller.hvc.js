
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const hvcDetail = require( '../lib/view-models/hvc-detail' );
const topMarkets = require( '../lib/view-models/top-markets' );
const hvcWins = require( '../lib/view-models/hvc-wins' );

module.exports = {

	hvc: function( req, res ){

		const hvcId = req.params.id;

		backendService.getHvcInfo( req, hvcId ).then( ( info ) => {

			const viewModel = hvcDetail.create( info.hvc );

			viewModel.topMarkets = topMarkets.create( info.markets );

			res.render( 'hvc/detail.html', viewModel );

		} ).catch( renderError.createHandler( res ) );
	},

	winList: function( req, res ){

		const hvcId = req.params.id;

		backendService.getHvcWinList( req, hvcId ).then( ( winList ) => {

			res.render( 'hvc/wins.html', hvcWins.create( winList ) );

		} ).catch( renderError.createHandler( res ) );
	}
};
