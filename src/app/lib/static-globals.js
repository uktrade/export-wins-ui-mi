const config = require( '../config' );

module.exports = function( env ){

	env.addGlobal( 'feedbackEmail', config.feedbackEmail );
	env.addGlobal( 'asset_path', '/public/uktrade/' );
};
