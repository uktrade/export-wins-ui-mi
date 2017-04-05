
const backendService = require( '../lib/service/service.backend' );
const renderError = require( '../lib/render-error' );

module.exports = {

	list: function( req, res ){

		backendService.getWinList( req.alice ).then( ( wins ) => {

			res.render( 'wins/list.html', { wins } );

		} ).catch( renderError.createHandler( res ) );
	}
};
