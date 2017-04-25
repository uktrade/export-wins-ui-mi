const config = require( '../config' );
const backendService = require( '../lib/service/service.backend' );

module.exports = {

	win: function( req, res ){

		const winId = req.param.id;

		backendService.getWin( req, winId ).then( ( win ) => {

			res.render( 'win/detail.html', {
				win,
				exportWinsUrl: config.exportWinsUrl
			} );
		} );
	}
};
