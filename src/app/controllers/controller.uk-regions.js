const exportBackendService = require( '../lib/service/service.backend' ).export;
const errorHandler = require( '../lib/render-error' );
const sortWins = require( '../lib/sort-wins' );

const regionSummary = require( '../lib/view-models/uk-region-summary' );
const regionPerformance = require( '../lib/view-models/uk-region-performance' );
const topMarkets = require( '../lib/view-models/top-markets' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

function getWins( view, type ){

	return function( req, res ){

		const regionId = req.params.id;

		exportBackendService.getUkRegionWinTable( req, regionId ).then( ( data ) => {

			res.render( view, {
				dateRange: data.date_range,
				region: data.results.uk_region,
				wins: sortWins( data.results.wins[ type ], req.query.sort )
			} );

		} ).catch( errorHandler.createHandler( res ) );
	};
}

module.exports = {

	list: function( req, res ){

		exportBackendService.getUkRegions( req ).then( ( regions ) => {

			res.render( 'uk-regions/list.html', { regions: regions.results } );

		} ).catch( errorHandler.createHandler( res ) );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		exportBackendService.getUkRegionInfo( req, regionId ).then( ( data ) => {

			res.render( 'uk-regions/detail.html', {
				regionId,
				regionName: data.wins.results.name,
				dateRange: data.wins.date_range,
				summary: regionSummary.create( data.wins ),
				performance: regionPerformance.create( data.wins ),
				topMarkets: topMarkets.create( data.topNonHvc ),
				monthlyPerformance: monthlyPerformance.create( data.months )
			} );

		} ).catch( errorHandler.createHandler( res ) );
	},

	wins: getWins( 'uk-regions/wins.html', 'hvc' ),
	nonHvcWins: getWins( 'uk-regions/non-hvc-wins.html', 'non_hvc' )
};
