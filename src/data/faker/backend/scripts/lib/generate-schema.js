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

		endDate = [ year, month, day ].join( '-' );

	}

	return endDate + 'T23:59:59Z';
}

function createWrapper( results, year, includeStartDate, hasCount ){

	const nextYear = ( year + 1 );
	const startDate = `${ year }-04-01`;
	const endDate = getEndDate( `${ nextYear }-03-31` );

	const wrapper = {
		timestamp: Date.now(),
		financial_year: {
			id: year,
			description: `${ year }-${ nextYear }`
		},
		results,
		date_range: {
			start: ( includeStartDate ? getTime( startDate ) : null ),
			end: getTime( endDate )
		}
	};

	if( hasCount ){
		wrapper.count = Math.floor( Math.random() * 50 );
	}

	return wrapper;
}

module.exports = function( path, year = 2016 ){

	let includeStartDate = true;
	let hasWrapper = true;
	let hasCount = false;

	switch( path ){
		case '/user/me.schema':
		case '/csv/list.schema':
			hasWrapper = false;
		break;

		case '/shared/top_non_hvcs.schema':
			hasCount = true;
		break;
	}

	const result = require( SCHEMA_PATH + path );
	const promise = jsf.resolve( result, REF_PATH );

	if( hasWrapper ){

		return promise.then( ( json ) => createWrapper( json, year, includeStartDate, hasCount ) );

	} else {

		return promise;
	}
};
