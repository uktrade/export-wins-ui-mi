const backendService = require( '../lib/service/service.backend' );
const errorHandler = require( '../lib/render-error' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const topMarkets = require( '../lib/view-models/top-markets' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

function getWins( view ){

	return function( req, res ){

		const postId = req.params.id;

		backendService.getPostWinTable( req, postId ).then( ( data ) => {

			res.render( view, {
				dateRange: data.date_range,
				post: data.results.post,
				wins: data.results.wins
			} );

		} ).catch( errorHandler.createHandler( res ) );
	};
}

module.exports = {

	list: function( req, res ){

		backendService.getPosts( req ).then( ( posts ) => {

			res.render( 'posts/list.html', { posts: posts.results } );

		} ).catch( errorHandler.createHandler( res ) );
	},

	post: function( req, res ){

		const postId = req.params.id;

		backendService.getPostInfo( req, postId ).then( ( data ) => {

			res.render( 'posts/detail.html', {
				postId,
				postName: data.wins.results.name,
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns ),
				monthlyPerformance: monthlyPerformance.create( data.months ),
				topMarkets: topMarkets.create( data.topNonHvc ),
			} );

		} ).catch( errorHandler.createHandler( res ) );
	},

	wins: getWins( 'posts/wins.html' ),
	nonHvcWins: getWins( 'posts/non-hvc-wins.html' )
};
