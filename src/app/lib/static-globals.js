const config = require( '../config' );

module.exports = function( env ){

	env.addGlobal( 'feedbackEmail', config.feedbackEmail );
	env.addGlobal( 'feedbackSurvey', config.feedbackSurvey );
	env.addGlobal( 'asset_path', '/public/uktrade/' );
	env.addGlobal( 'analyticsId', config.analyticsId );
};
