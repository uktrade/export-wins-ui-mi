const config = require( '../config' );
const backendService = require( '../lib/service/service.backend' );
const analyticsService = require( '../lib/service/analytics' );
const renderError = require( '../lib/render-error' );

module.exports = {

	list: function( req, res ){

		const showFdi = req.user.fdi;

		backendService.getCsvFileList( req ).then( ( filesInfo ) => {

			res.render( 'downloads/list', {
				files: filesInfo.data,
				showFdi,
				usingMiUrl: config.urls.usingMi,
				kimPrinciplesUrl: config.urls.kimPrinciples,
				workspaceUrls: config.urls.dataWorkspace
			} );

		} ).catch( renderError.createHandler( req, res ) );
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
