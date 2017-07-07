
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const hvcDetail = require( '../lib/view-models/hvc-detail' );
const topMarkets = require( '../lib/view-models/top-markets' );

module.exports = {

	hvc: function( req, res ){

		const hvcId = req.params.id;

		backendService.getHvcInfo( req, hvcId ).then( ( info ) => {

			const viewModel = hvcDetail.create( info.hvc );

			viewModel.topMarkets = topMarkets.create( info.markets );

			res.render( 'hvc/detail.html', viewModel );

		} ).catch( renderError.createHandler( res ) );
	}
};
