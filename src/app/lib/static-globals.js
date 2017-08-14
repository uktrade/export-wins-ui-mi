const config = require( '../config' );

module.exports = function( env ){

	const startYear = Number( config.financialYearStart );
	const currentYear = ( new Date() ).getFullYear();
	const years = [];

	let year = startYear;

	while( year <= currentYear ){
		years.push( { year, label: `${ year }/${ ( year + 1 ).toString().substr( 2, 4 ) }` } );
		year++;
	}

	env.addGlobal( 'asset_path', '/public/uktrade/' );
	env.addGlobal( 'analyticsId', config.analyticsId );
	env.addGlobal( 'faqLink', config.faqLink );
	env.addGlobal( 'yearList', years );
};
