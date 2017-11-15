const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = {

	list: function( req, res ){

		const showFdi = req.user.fdi;

		backendService.getCsvFileList( req ).then( ( filesInfo ) => {

			res.render( 'downloads/list', { files: filesInfo.data, showFdi } );

		} ).catch( renderError.createHandler( req, res ) );
	},

	file: function( req, res ){

		const fileId = req.params.id;

		backendService.getCsvFileUrl( req, fileId ).then( ( urlInfo ) => {

			res.redirect( urlInfo.data.one_time_url );

		} ).catch( renderError.createHandler( req, res ) );
	}
};
