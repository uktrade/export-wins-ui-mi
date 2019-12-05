const config = require( '../config' );
const backendService = require( '../lib/service/service.backend' );
const analyticsService = require( '../lib/service/analytics' );
const renderError = require( '../lib/render-error' );

module.exports = {

	list: function( req, res ){

		res.render( 'downloads/list', {
			usingMiUrl: config.urls.usingMi,
			kimPrinciplesUrl: config.urls.kimPrinciples,
			workspaceUrls: config.urls.dataWorkspace,
			helpDownloadsUrl: config.urls.helpDownloads,
		} );
	},

	file: function( req, res ){

		const fileId = req.params.id;
		const name = ( req.query.name || 'unknown' );
		const type = ( req.query.type || 'CSV' );
		const path = req.url;

		backendService.getCsvFileUrl( req, fileId ).then( ( urlInfo ) => {

			res.redirect( urlInfo.data.one_time_url );

			const tracker = analyticsService.createTracker( req );

			if( tracker ){

				tracker.downloadCsvFile( path, type, name );
			}

		} ).catch( renderError.createHandler( req, res ) );
	}
};
