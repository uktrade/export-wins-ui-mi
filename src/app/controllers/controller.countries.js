const backendService = require( '../lib/service/service.backend' );
const errorHandler = require( '../lib/render-error' );
const sortWins = require( '../lib/sort-wins' );

const hvcTargetPerformance = require( '../lib/view-models/hvc-target-performance' );
const sectorSummary = require( '../lib/view-models/sector-summary' );
const hvcSummary = require( '../lib/view-models/sector-hvc-summary' );
const topMarkets = require( '../lib/view-models/top-markets' );
const monthlyPerformance = require( '../lib/view-models/monthly-performance' );

function getWins( view, type ){

	return function( req, res ){

		const countryCode = req.params.code;

		backendService.getCountryWinTable( req, countryCode ).then( ( data ) => {

			res.render( view, {
				dateRange: data.date_range,
				country: data.results.country,
				wins: sortWins( data.results.wins[ type ], req.query.sort )
			} );

		} ).catch( errorHandler.createHandler( res ) );
	};
}

module.exports = {

	list: function( req, res ){

		backendService.getCountries( req ).then( ( countries ) => {

			res.render( 'countries/list.html', { countries: countries.results } );

		} ).catch( errorHandler.createHandler( res ) );
	},

	country: function( req, res ){

		const countryCode = req.params.code;

		backendService.getCountryInfo( req, countryCode ).then( ( data ) => {

			res.render( 'countries/detail.html', {
				countryCode,
				countryName: data.wins.results.name,
				summary: sectorSummary.create( data.wins ),
				hvcSummary: hvcSummary.create( data.wins ),
				hvcTargetPerformance: hvcTargetPerformance.create( data.campaigns ),
				monthlyPerformance: monthlyPerformance.create( data.months ),
				topMarkets: topMarkets.create( data.topNonHvc ),
			} );

		} ).catch( errorHandler.createHandler( res ) );
	},

	wins: getWins( 'countries/wins.html', 'hvc' ),
	nonHvcWins: getWins( 'countries/non-hvc-wins.html', 'non_hvc' )
};
