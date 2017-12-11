const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );

module.exports = {

	regions: function( req, res ){

		fdiService.getOverseasRegions( req ).then( ( data ) => {

			res.render( 'investment/views/overseas-regions/overview', { regions: data } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		fdiService.getOverseasRegion( req, regionId ).then( ( data ) => {

			res.render( 'investment/views/overseas-regions/detail', { dateRange: data.date_range, region: data.results } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	hvcPerformance: function( req, res ){

		const regionId = req.params.id;

		fdiService.getOverseasRegion( req, regionId ).then( ( data ) => {

			res.render( 'investment/views/overseas-regions/hvc-performance', { dateRange: data.date_range, region: data.results } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	nonHvcPerformance: function( req, res ){

		const regionId = req.params.id;

		fdiService.getOverseasRegion( req, regionId ).then( ( data ) => {

			res.render( 'investment/views/overseas-regions/non-hvc-performance', { dateRange: data.date_range, region: data.results } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	hvcProjects: function( req, res ){

		const regionId = req.params.id;

		fdiService.getOverseasRegion( req, regionId ).then( ( data ) => {

			res.render( 'investment/views/overseas-regions/hvc-projects', { dateRange: data.date_range, region: data.results } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	nonHvcProjects: function( req, res ){

		const regionId = req.params.id;

		fdiService.getOverseasRegion( req, regionId ).then( ( data ) => {

			res.render( 'investment/views/overseas-regions/non-hvc-projects', { dateRange: data.date_range, region: data.results } );

		} ).catch( renderError.createHandler( req, res ) );
	},
};
