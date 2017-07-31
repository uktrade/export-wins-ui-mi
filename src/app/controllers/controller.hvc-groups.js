
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

module.exports = {

	list: function( req, res ){

		backendService.getHvcGroups( req ).then( ( hvcGroups ) => {

			res.render( 'hvc-groups/list.html', { hvcGroups: hvcGroups.results } );

		} ).catch( renderError.createHandler( res ) );
	},

	group: function( req, res ){

		const groupId = req.params.id;

		backendService.getHvcGroupInfo( req, groupId ).then( ( data ) => {

			res.render( 'hvc-groups/detail.html', {
				groupId,
				sectorName: data.wins.results.name,
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				monthlyPerformance: monthlyPerformance.create( data.months ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns )
			} );

		} ).catch( renderError.createHandler( res ) );
	},

	wins: function( req, res ){

		const groupId = req.params.id;

		backendService.getHvcGroupWinTable( req, groupId ).then( ( data ) => {

			res.render( 'hvc-groups/wins.html', {
				dateRange: data.date_range,
				hvcGroup: data.results.hvc_group,
				wins: data.results.wins
			} );

		} ).catch( renderError.createHandler( res ) );
	}
};
