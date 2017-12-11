const fdiService = require( '../../../lib/service/service.backend/investment/fdi' );
const renderError = require( '../../../lib/render-error' );

module.exports = {

	regions: function( req, res ){

		fdiService.getUkRegions( req ).then( ( data ) => {

			data.results = data.results.region_groups.reduce( ( list, group ) => {

				group.regions.forEach( ( region ) => list.push( region ) );

				return list;

			}, [] );

			res.render( 'investment/views/uk-regions/overview', { regions: data } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	region: function( req, res ){

		const regionId = req.params.id;

		fdiService.getUkRegion( req, regionId ).then( ( data ) => {

			res.render( 'investment/views/uk-regions/detail', { dateRange: data.date_range, region: data.results } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	hvcPerformance: function( req, res ){

		const regionId = req.params.id;

		fdiService.getUkRegion( req, regionId ).then( ( data ) => {

			res.render( 'investment/views/uk-regions/hvc-performance', { dateRange: data.date_range, region: data.results } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	nonHvcPerformance: function( req, res ){

		const regionId = req.params.id;

		fdiService.getUkRegion( req, regionId ).then( ( data ) => {

			res.render( 'investment/views/uk-regions/non-hvc-performance', { dateRange: data.date_range, region: data.results } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	hvcProjects: function( req, res ){

		const regionId = req.params.id;

		fdiService.getUkRegion( req, regionId ).then( ( data ) => {

			res.render( 'investment/views/uk-regions/hvc-projects', { dateRange: data.date_range, region: data.results } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	nonHvcProjects: function( req, res ){

		const regionId = req.params.id;

		fdiService.getUkRegion( req, regionId ).then( ( data ) => {

			res.render( 'investment/views/uk-regions/non-hvc-projects', { dateRange: data.date_range, region: data.results } );

		} ).catch( renderError.createHandler( req, res ) );
	},
};
