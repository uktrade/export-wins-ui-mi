const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = {

	csv: function( req, res ){

		const errorHandler = renderError.createHandler( req, res );

		backendService.getCsvFileList( req ).then( ( fileInfo ) => {

			backendService.getCsvFileUrl( req, fileInfo.data.id ).then( ( urlInfo ) => {

				res.redirect( urlInfo.data.one_time_url );

			} ).catch( errorHandler );

		} ).catch( errorHandler );
	}
};
