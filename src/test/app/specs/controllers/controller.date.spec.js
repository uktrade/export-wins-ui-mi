const proxyquire = require( 'proxyquire' );

const errorHandler = {};
//const createErrorHandler = require( '../../helpers/create-error-handler' );
const spy = require( '../../helpers/spy' );

let controller;
let months;
let monthOptions;
let year;
let req;
let res;
let currentFy;
let urls;
let selectDate;
let selectDateUrl;
let financialYearStart;
let csrfTokenValue;
let csrfToken;

function getDateParams( values ){

	return `date[start]=${ values.start_month }-${ values.start_day }&date[end]=${ values.end_month }-${ values.end_day }`;
}

describe( 'Date controller', function(){

	beforeEach( function(){

		//errorHandler.createHandler = spy( 'createHandler' );

		financialYearStart = 2016;
		currentFy = 2016;
		selectDateUrl = '/select-date-spy/';
		selectDate = spy( 'urls.selectDate', selectDateUrl );
		csrfTokenValue = ( Math.random() * 100000 );
		csrfToken = spy( 'csrfToken', csrfTokenValue );
		year = '2016';
		months = [ { year: 1, number: 2, name: 'testing' }, { year: 2, number: 3, name: 'testing' } ];
		monthOptions = months.map( ( m ) => ( { value: `${ m.year }-${ m.number }`, label: `${ m.name } ${ m.year }` } ) );
		urls = spy( 'urls', { selectDate } );

		controller = proxyquire( '../../../../app/controllers/controller.date', {
			'../lib/render-error': errorHandler,
			'../lib/financial-year': {
				getMonths: spy( 'financialYear.getMonths', months ),
				getCurrent: jasmine.createSpy( 'financialYear.getCurrent' ).and.callFake( () => currentFy )
			},
			'../lib/urls': urls,
			'../config': { financialYearStart }
		} );

		req = {
			params: { year },
			year: '2016',
			isDefaultYear: false,
			csrfToken
		};
		res = {
			render: spy( 'res.render' )
		};
	} );

	describe( 'Select Year', function(){

		it( 'Should render the view with the corect data', function( done ){

			const req = {
				cookies: { sessionid: '456' },
				year: 2017
			};

			const res = {
				render: spy( 'res.render' )
			};

			//errorHandler.createHandler.and.callFake( createErrorHandler( done ) );

			controller.selectYear( req, res );

			expect( res.render ).toHaveBeenCalledWith( 'select-year.html' );
			//expect( errorHandler.createHandler ).toHaveBeenCalledWith( req, res );
			done();
		} );
	} );

	describe( 'Select Date', function(){

		describe( 'With a valid year', function(){

			it( 'Should render the correct view and data', function(){

				controller.selectDates( req, res );

				expect( res.render ).toHaveBeenCalledWith( 'select-dates.html', {
					year,
					months: monthOptions,
					csrfToken: csrfTokenValue
				} );
			} );
		} );

		describe( 'With an invalid year', function(){

			describe( 'When the date is in the future', function(){

				it( 'Should redirect to the year picker', function(){

					res.redirect = spy( 'res.redirect' );
					currentFy = 2017;
					req.params.year = 2020;
					req.returnPath = '/a/test/redirect/';

					controller.selectDates( req, res );

					expect( selectDate ).toHaveBeenCalledWith( req.returnPath );
					expect( res.redirect ).toHaveBeenCalledWith( selectDateUrl );
				} );
			} );

			describe( 'When the date is before the config.financialYearStart', function(){

				it( 'Should redirect to the year picker', function(){

					res.redirect = spy( 'res.redirect' );
					currentFy = 2017;
					req.params.year = 202;
					req.returnPath = '/a/test/redirect/';

					controller.selectDates( req, res );

					expect( selectDate ).toHaveBeenCalledWith( req.returnPath );
					expect( res.redirect ).toHaveBeenCalledWith( selectDateUrl );
				} );
			} );
		} );
	} );

	describe( 'Set date', function(){

		const labels = {
			'start-month': 'Start month',
			'start-day': 'Start day',
			'end-month': 'End month',
			'end-day': 'End day',
			'end-date': 'End date'
		};

		describe( 'Without any data', function(){

			it( 'Should render the select date view with an error message', function(){

				req.body = {};

				const errors = {
					'start-month': [ 'Please choose a month.' ],
					'start-day': [ 'Please enter a day.' ],
					'end-month': [ 'Please choose a month.' ],
					'end-day': [ 'Please enter a day.' ]
				};

				const values = {
					start_month: undefined,
					start_day: undefined,
					end_month: undefined,
					end_day: undefined
				};

				controller.setDate( req, res );

				expect( res.render ).toHaveBeenCalledWith( 'select-dates.html', {
					year,
					months: monthOptions,
					csrfToken: csrfTokenValue,
					errors,
					labels,
					values
				} );
			} );
		} );

		describe( 'With invalid dates', function(){

			describe( 'With a date that does not exist', function(){

				describe( 'When the start date is invalid', function(){

					it( 'Should render the select date view with an error message', function(){

						req.body = {
							start_month: '2016-02',
							start_day: 30,
							end_month: '2016-05',
							end_day: 1
						};

						const errors = { 'start-date': [ 'Invalid combination of month and day, please enter a valid date.' ] };

						const values = {
							start_month: req.body.start_month,
							start_day: req.body.start_day,
							end_month: req.body.end_month,
							end_day: req.body.end_day
						};

						controller.setDate( req, res );

						expect( res.render ).toHaveBeenCalledWith( 'select-dates.html', {
							year,
							months: monthOptions,
							csrfToken: csrfTokenValue,
							errors,
							labels,
							values
						} );
					} );
				} );

				describe( 'When the end date is invalid', function(){

					it( 'Should render the select date view with an error message', function(){

						req.body = {
							start_month: '2016-02',
							start_day: 2,
							end_month: '2016-08',
							end_day: 32
						};

						const errors = { 'end-date': [ 'Invalid combination of month and day, please enter a valid date.' ] };

						const values = {
							start_month: req.body.start_month,
							start_day: req.body.start_day,
							end_month: req.body.end_month,
							end_day: req.body.end_day
						};

						controller.setDate( req, res );

						expect( res.render ).toHaveBeenCalledWith( 'select-dates.html', {
							year,
							months: monthOptions,
							csrfToken: csrfTokenValue,
							errors,
							labels,
							values
						} );
					} );
				} );
			} );

			describe( 'When the end date is before the start date', function(){

				it( 'Should render the select date view with an error message', function(){

					req.body = {
						start_month: '2016-02',
						start_day: 1,
						end_month: '2016-01',
						end_day: 1
					};

					const errors = { 'end-date': [ 'The end date cannot be before the start date, please enter another end date.' ] };

					const values = {
						start_month: req.body.start_month,
						start_day: req.body.start_day,
						end_month: req.body.end_month,
						end_day: req.body.end_day
					};

					controller.setDate( req, res );

					expect( res.render ).toHaveBeenCalledWith( 'select-dates.html', {
						year,
						months: monthOptions,
						csrfToken: csrfTokenValue,
						errors,
						labels,
						values
					} );
				} );
			} );
		} );

		describe( 'With valid dates', function(){

			let redirectSpy;
			let dateParams;

			beforeEach( function(){

				req.body = {
					start_month: '2016-02',
					start_day: '01',
					end_month: '2016-05',
					end_day: '01'
				};

				dateParams = getDateParams( req.body );

				redirectSpy = spy( 'res.redirect' );

				res.redirect = redirectSpy;
			} );

			describe( 'With a return path', function(){

				describe( 'When the return path has query params', function(){

					describe( 'When the query params include date[start] and date[end]', function(){

						it( 'Should replace the values of date[start] and date[end]', function(){

							req.returnPath = '/my/redirect/path/?a=1&b=2&date[start]=2016-05-01&date[end]=2016-06-01';
							controller.setDate( req, res );
							expect( res.redirect ).toHaveBeenCalledWith( `/my/redirect/path/?a=1&b=2&date[start]=${ req.body.start_month }-${ req.body.start_day }&date[end]=${ req.body.end_month }-${ req.body.end_day }` );
						} );
					} );

					describe( 'When the query params do not include date[start] and date[end]', function(){

						it( 'Should redirect to the return path with the date range params added to the existing query params', function(){

							req.returnPath = '/my/redirect/path/?a=1&b=2';
							controller.setDate( req, res );
							expect( res.redirect ).toHaveBeenCalledWith( `${ req.returnPath }&${ dateParams }` );
						} );
					} );
				} );

				describe( 'When the return path does not have query params', function(){

					it( 'Should redirect to the return path with the date range params added', function(){

						req.returnPath = '/my/redirect/path/';
						controller.setDate( req, res );
						expect( res.redirect ).toHaveBeenCalledWith( `${ req.returnPath }?${ dateParams }` );
					} );
				} );

				describe( 'When the financial year is different to the current', function(){

					describe( 'When it is the default financial year and the year is not in the return path', function(){

						it( 'Should add the financial year to the return path', function(){

							currentFy = 2017;
							req.returnPath = '/my/redirect/path/';

							req.params.year = '2016';
							controller.setDate( req, res );

							expect( res.redirect ).toHaveBeenCalledWith( `/2016${ req.returnPath }?${ dateParams }` );
						} );
					} );

					describe( 'When it is not the default financial year and there is a year in the return path', function(){

						it( 'Should remove the year from the return path', function(){

							currentFy = 2017;
							req.returnPath = '/2016/my/redirect/path/';

							req.params.year = '2017';
							req.body = {
								start_month: '2017-05',
								start_day: '01',
								end_month: '2017-06',
								end_day: '01'
							};

							controller.setDate( req, res );

							expect( res.redirect ).toHaveBeenCalledWith( `/my/redirect/path/?${ getDateParams( req.body ) }` );
						} );
					} );
				} );
			} );

			describe( 'Without a return path', function(){

				it( 'Should redirect to the homepage with the date range params added', function(){

					controller.setDate( req, res );
					expect( res.redirect ).toHaveBeenCalledWith( `/?${ dateParams }` );
				} );
			} );
		} );
	} );
} );
