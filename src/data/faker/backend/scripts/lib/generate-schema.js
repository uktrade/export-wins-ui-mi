const path = require( 'path' );
const jsf = require( 'json-schema-faker' );
const faker = require( 'faker/locale/en' );

const SCHEMA_PATH = '../../../../schema/backend';
const REF_PATH = path.resolve( __dirname, SCHEMA_PATH );

jsf.extend( 'faker', () => faker );

function getTime( dateStr ){

	const date = new Date( dateStr );

	return date.toGMTString();
}

function getEndDate( endDate ){

	const [ endYear, endMonth, endDay ] = endDate.split( '-' );
	const now = new Date();
	const year = now.getFullYear();
	const month = ( now.getMonth() + 1 );
	const day = now.getDate();

	if( endYear > year || ( endYear >= year && month < endMonth || ( Number( month ) === endMonth && day < endDay ) ) ){

		return [ year, month, day ].join( '-' );

	} else {

		return endDate;
	}
}

function createWrapper( results, year, hasDateRange ){

	const nextYear = ( year + 1 );

	const wrapper = {
		timestamp: Date.now(),
		financial_year: {
			id: year,
			description: `${ year }-${ nextYear }`
		},
		results
	};

	if( hasDateRange ){

		const startDate = `${ year }-04-01`;
		const endDate = getEndDate( `${ nextYear }-03-31` );

		wrapper.date_range = {
			start: getTime( startDate ),
			end: getTime( endDate )
		};
	}

	return wrapper;
}

module.exports = function( path, year = 2016 ){

	let hasDateRange = true;
	let hasWrapper = true;

	switch( path ){
		case '/user/me.schema':
			hasWrapper = false;
		break;
	}

	const result = require( SCHEMA_PATH + path );
	const promise = jsf.resolve( result, REF_PATH );

	if( hasWrapper ){

		switch( path ){
			case '/os_regions/index.schema':
			case '/shared/index.schema':
			case '/sector_teams/index.schema':
			case '/os_region_groups/index.schema':
				hasDateRange = false;
			break;
		}

		return promise.then( ( json ) => createWrapper( json, year, hasDateRange ) );

	} else {

		return promise;
	}
};
