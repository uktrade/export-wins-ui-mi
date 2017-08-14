const url = require( 'url' );

const config = require( '../config' );
const financialYear = require( '../lib/financial-year' );
const isValidDate = require( '../lib/is-valid-date' );
const logger = require( '../lib/logger' );
const urls = require( '../lib/urls' );

function checkDateParams( values, errors, groupId, monthField, dayField ){

	const monthValue = values[ monthField ];
	const dayValue = values[ dayField ];

	if( !monthValue ){ errors.push( [ monthField, 'Please choose a month.' ] ); }
	if( !dayValue ){ errors.push( [ dayField, 'Please enter a day.' ] ); }

	if( monthValue && dayValue && !isValidDate( `${ monthValue }-${ dayValue }` ) ){
		errors.push( [ groupId, 'Invalid combination of month and day, please enter a valid date.' ] );
	}
}

function monthOptions( month ){

	return {
		value: `${ month.year }-${ month.number }`,
		label: `${ month.name } ${ month.year }`
	};
}

function getMonths( year ){

	return financialYear.getMonths( year ).map( monthOptions );
}

function validateFormValues( year, body ){

	const errors = [];
	const values = {
		start_month: body.start_month,
		start_day: body.start_day,
		end_month: body.end_month,
		end_day: body.end_day
	};

	checkDateParams( values, errors, 'start-date', 'start_month', 'start_day' );
	checkDateParams( values, errors, 'end-date', 'end_month', 'end_day' );

	if( !errors.length ){

		const startDate = new Date( `${ values.start_month }-${ values.start_day }` );
		const endDate = new Date( `${ values.end_month }-${ values.end_day }` );

		if( endDate.getTime() < startDate.getTime() ){

			errors.push( [ 'end-date', 'The end date cannot be before the start date, please enter another end date.' ] );
		}
	}

	return {
		values,
		errors
	};
}

function getCorrectPath( returnPath, newFy ){

	const currentFy = financialYear.getCurrent();
	const startsWithYear = /^\/[0-9]{4}\//;

	if( startsWithYear.test( returnPath ) ){

		returnPath = returnPath.substring( 5 );
	}

	if( newFy != currentFy ){

		returnPath = ( '/' + newFy + returnPath );
	}

	return returnPath;
}

function getRedirectPath( path, values ){

	const parsedUrl = url.parse( path, true );

	parsedUrl.search = null;//remove old values as search will overwrite query

	parsedUrl.query[ 'date[start]' ] = `${ values.start_month }-${ values.start_day }`;
	parsedUrl.query[ 'date[end]' ] = `${ values.end_month }-${ values.end_day }`;

	return decodeURIComponent( url.format( parsedUrl ) );
}

const SET_DATE_LABELS = {
	'start-month': 'Start month',
	'start-day': 'Start day',
	'end-month': 'End month',
	'end-day': 'End day'
};

module.exports = {

	selectYear: function( req, res ){

		res.render( 'select-year.html' );
	},

	selectDates: function( req, res ){

		const year = req.params.year;
		const currentFy = financialYear.getCurrent();

		if( year > currentFy || year < config.financialYearStart ){

			res.redirect( urls( req ).selectDate( req.returnPath ) );

		} else {

			res.render( 'select-dates.html', {
				year,
				months: getMonths( year )
			} );
		}
	},

	setDate: function( req, res ){

		const newFy = req.params.year;
		const { errors, values } = validateFormValues( newFy, req.body );

		if( errors.length ){

			const formErrors = errors.reduce( ( errObj, err ) => {

				errObj[ err[ 0 ].replace( '_', '-' ) ] = [ err[ 1 ] ];

				return errObj;

			}, {} );

			logger.debug( 'errors with form data: ', errors );

			res.render( 'select-dates.html', {
				year: newFy,
				months: getMonths( newFy ),
				errors: formErrors,
				labels: SET_DATE_LABELS,
				values
			} );

		} else {

			const returnPath = getCorrectPath( ( req.returnPath || '/' ), newFy );
			const redirectPath = getRedirectPath( returnPath, values );

			res.redirect( redirectPath );
		}
	}
};
