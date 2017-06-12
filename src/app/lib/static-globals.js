const config = require( '../config' );

module.exports = function( env ){

	const startYear = config.financialYearStart;
	const currentYear = ( new Date() ).getFullYear();
	const years = [];

	let year = startYear;

	while( year <= currentYear ){
		years.push( year++ );
	}

	env.addGlobal( 'feedbackEmail', config.feedbackEmail );
	env.addGlobal( 'feedbackSurvey', config.feedbackSurvey );
	env.addGlobal( 'asset_path', '/public/uktrade/' );
	env.addGlobal( 'analyticsId', config.analyticsId );
	env.addGlobal( 'faqLink', config.faqLink );
	env.addGlobal( 'yearList', years );
	env.addGlobal( 'currentYear', currentYear );
};
