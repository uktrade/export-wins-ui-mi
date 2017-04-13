const jsf = require( 'json-schema-faker' );

const schemaPath = '../../../../schema/backend';

function getTime( dateStr ){

	const date = new Date( dateStr );

	return ( date.getTime() / 1000 );
}

function createWrapper( results, hasDateRange ){

	const wrapper = {
		timestamp: Date.now(),
		financial_year: {
			id: 2016,
			description: '2016-17'
		},
		results
	};

	if( hasDateRange ){

		wrapper.date_range = {
			start: getTime( '2016-04-01' ),
			end: getTime( '2017-01-01' )
		};
	}

	return wrapper;
}

module.exports = function( path ){

	let hasDateRange = true;

	switch( path ){
		case '/os_regions/index.schema':
		case '/shared/index.schema':
		case '/sector_teams/index.schema':
			hasDateRange = false;
		break;
	}

	const result = require( schemaPath + path );
	const wrapper = createWrapper( jsf( result ), hasDateRange );

	return wrapper;
};
