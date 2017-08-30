const backendService = require( '../lib/service/service.backend' );
const errorHandler = require( '../lib/render-error' );

const regionSummary = require( '../lib/view-models/uk-region-summary' );
const topMarkets = require( '../lib/view-models/top-markets' );

function getWins( view ){

	return function( req, res ){

		const regionId = req.params.id;

		backendService.getUkRegionWinTable( req, regionId ).then( ( data ) => {

			res.render( view, {
				dateRange: data.date_range,
				region: data.results.uk_region,
				wins: data.results.wins
			} );

		} ).catch( errorHandler.createHandler( res ) );
	};
}

module.exports = {

	list: function( req, res ){

		backendService.getUkRegions( req ).then( ( regions ) => {

			res.render( 'uk-regions/list.html', { regions: regions.results } );

		} ).catch( errorHandler.createHandler( res ) );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		backendService.getUkRegionInfo( req, regionId ).then( ( data ) => {

			res.render( 'uk-regions/detail.html', {
				regionId,
				regionName: data.wins.results.name,
				dateRange: data.wins.date_range,
				summary: regionSummary.create( data.wins ),
				topMarkets: topMarkets.create( data.topNonHvc )
			} );

		} ).catch( errorHandler.createHandler( res ) );
	},

	wins: getWins( 'uk-regions/wins.html' ),
	nonHvcWins: getWins( 'uk-regions/non-hvc-wins.html' )
};
