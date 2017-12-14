const exportBackendService = require( '../lib/service/service.backend' ).export;
const errorHandler = require( '../lib/render-error' );
const sortWins = require( '../lib/sort-wins' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const topMarkets = require( '../lib/view-models/top-markets' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

function getWins( view, type ){

	return function( req, res ){

		const postId = req.params.id;

		exportBackendService.getPostWinTable( req, postId ).then( ( data ) => {

			res.render( view, {
				dateRange: data.date_range,
				post: data.results.post,
				wins: sortWins( data.results.wins[ type ], req.query.sort )
			} );

		} ).catch( errorHandler.createHandler( req, res ) );
	};
}

module.exports = {

	list: function( req, res ){

		exportBackendService.getPosts( req ).then( ( posts ) => {

			res.render( 'posts/list.html', { posts: posts.results } );

		} ).catch( errorHandler.createHandler( req, res ) );
	},

	topNonHvcs: function( req, res ){

		const postId = req.params.id;

		exportBackendService.getPostTopNonHvc( req, postId, true ).then( ( topNonHvcs ) => {

			res.render( 'partials/top-non-hvcs.html', { topNonHvcs: topNonHvcs.results } );

		} ).catch( errorHandler.createHandler( req, res ) );
	},

	post: function( req, res ){

		const postId = req.params.id;

		exportBackendService.getPostInfo( req, postId ).then( ( data ) => {

			res.render( 'posts/detail.html', {
				postId,
				postName: data.wins.results.name,
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns ),
				monthlyPerformance: monthlyPerformance.create( data.months ),
				topMarkets: topMarkets.create( data.topNonHvc ),
			} );

		} ).catch( errorHandler.createHandler( req, res ) );
	},

	wins: getWins( 'posts/wins.html', 'hvc' ),
	nonHvcWins: getWins( 'posts/non-hvc-wins.html', 'non_hvc' )
};
