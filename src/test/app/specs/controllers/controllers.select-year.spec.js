const proxyquire = require( 'proxyquire' );

let controller;

describe( 'Select Year controller', function(){

	let year;

	beforeEach( function(){

		year = 2016;

		const stubs = {
			'../config': {
				financialYearStart: year
			}
		};

		controller = proxyquire( '../../../../app/controllers/controller.select-year', stubs );
	} );

	describe( 'Choose', function(){

		it( 'Should create a list of years and render the correct view', function( done ){

			const req = {
				alice: '87654',
				year
			};

			controller.choose( req, { locals: {}, render: function( view, data ){

				expect( view ).toEqual( 'select-year.html' );
				expect( data.years ).toBeDefined();
				expect( data.years.length ).toBeGreaterThan( 1 );
				expect( data.years[ 0 ] ).toEqual( year );
				done();
			} } );
		} );

		it( 'Should remove the current year from the locals and add it as a hidden local', function( done ){

			const req = {
				alice: '87654',
				year
			};

			const locals = {
				currentYear: 2017
			};

			controller.choose( req, { locals, render: function( /* view, data */ ){

				expect( locals.currentYear ).toEqual( null );
				expect( locals._currentYear ).toEqual( 2017 );
				done();
			} } );
		} );
	} );
} );
