
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );
const topMarkets = require( '../lib/view-models/top-markets' );

module.exports = {

	hvc: function( req, res ){

		const hvcId = req.params.id;

		backendService.getHvc( req.alice, hvcId ).then( ( hvc ) => {

			res.render( 'hvc/detail.html', {

				id: hvc.id,
				name: `${ hvc.id } ${ hvc.name }`,
				summary: {
					pieData: {
						confirmedUnconfirmedValue: {
							confirmed: 80,
							unconfirmed: 20
						}
					}
				},
				hvcTargetPerformance: hvcTargetPerformance.create( hvc.campaigns ),
				monthlyPerformance: monthlyPerformance.create( hvc ),
				hvcSummary: {
					progress: {
						percent: 50,
						gauge: 0.25
					},
					confirmedValue: 50000000,
					unconfirmedValue: 5000000,
					target: 100000000
				},
				averageTimeToConfirm: 11,
				topMarkets: topMarkets.create( hvc.topMarketsAndSectors )
			} );

		} ).catch( renderError.createHandler( res ) );
	}
};
