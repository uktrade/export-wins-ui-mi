
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

module.exports = {

	list: function( req, res ){

		backendService.getHvcGroups( req.alice ).then( ( hvcGroups ) => {

			res.render( 'hvc-groups/list.html', { hvcGroups: hvcGroups.results } );

		} ).catch( renderError.createHandler( res ) );
	},

	group: function( req, res ){

		const groupId = req.params.id;

		backendService.getHvcGroupInfo( req.alice, groupId ).then( ( data ) => {

			res.render( 'hvc-groups/detail.html', {
				sectorName: data.wins.results.name,
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				monthlyPerformance: monthlyPerformance.create( data.months ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns )
			} );

		} ).catch( renderError.createHandler( res ) );
	}
};
