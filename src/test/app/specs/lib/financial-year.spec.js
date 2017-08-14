const mockdate = require( 'mockdate' );
const financialYear = require( '../../../../app/lib/financial-year' );

describe( 'financialYear', function(){

	afterEach( function(){

		mockdate.reset();
	} );

	describe( 'getCurrent', function(){

		describe( 'Before April', function(){

			it( 'Should return the previous year', function(){

				mockdate.set( '2016-11-01' );
				expect( financialYear.getCurrent() ).toEqual( 2016 );

				mockdate.set( '2016-12-01' );
				expect( financialYear.getCurrent() ).toEqual( 2016 );

				mockdate.set( '2017-01-01' );
				expect( financialYear.getCurrent() ).toEqual( 2016 );

				mockdate.set( '2017-02-01' );
				expect( financialYear.getCurrent() ).toEqual( 2016 );

				mockdate.set( '2017-03-01' );
				expect( financialYear.getCurrent() ).toEqual( 2016 );
			} );
		} );

		describe( 'After April', function(){

			it( 'Should return the current year', function(){

				mockdate.set( '2017-04-01' );
				expect( financialYear.getCurrent() ).toEqual( 2017 );

				mockdate.set( '2017-05-01' );
				expect( financialYear.getCurrent() ).toEqual( 2017 );

				mockdate.set( '2017-06-01' );
				expect( financialYear.getCurrent() ).toEqual( 2017 );
			} );
		} );
	} );

	describe( 'getMonths', function(){

		describe( 'For the previous financial year', function(){

			const monthList = [
					{ year: 2016, name: 'April', number: 4 },
					{ year: 2016, name: 'May', number: 5 },
					{ year: 2016, name: 'June', number: 6 },
					{ year: 2016, name: 'July', number: 7 },
					{ year: 2016, name: 'August', number: 8 },
					{ year: 2016, name: 'September', number: 9 },
					{ year: 2016, name: 'October', number: 10 },
					{ year: 2016, name: 'November', number: 11 },
					{ year: 2016, name: 'December', number: 12 },
					{ year: 2017, name: 'January', number: 1 },
					{ year: 2017, name: 'February', number: 2 },
					{ year: 2017, name: 'March', number: 3 }
				];

			describe( 'With a number for year', function(){

				it( 'Should return a full list of months and years for the financial year', function(){

					expect( financialYear.getMonths( 2016 ) ).toEqual( monthList );
				} );
			} );

			describe( 'With a string for year', function(){

				it( 'Should return a full list of months and years for the financial year', function(){

					expect( financialYear.getMonths( '2016' ) ).toEqual( monthList );
				} );
			} );
		} );

		describe( 'For the current financial year', function(){

			describe( 'December', function(){

				it( 'Should return a list of months and years for the current financial year up to December', function(){

					const monthList = [
						{ year: 2017, name: 'April', number: 4 },
						{ year: 2017, name: 'May', number: 5 },
						{ year: 2017, name: 'June', number: 6 },
						{ year: 2017, name: 'July', number: 7 },
						{ year: 2017, name: 'August', number: 8 },
						{ year: 2017, name: 'September', number: 9 },
						{ year: 2017, name: 'October', number: 10 },
						{ year: 2017, name: 'November', number: 11 },
						{ year: 2017, name: 'December', number: 12 }
					];

					mockdate.set( '2017-12-05' );

					expect( financialYear.getMonths( 2017 ) ).toEqual( monthList );
				} );
			} );

			describe( 'February', function(){

				it( 'Should return a list of months and years for the current financial year up to February', function(){

					const monthList = [
						{ year: 2017, name: 'April', number: 4 },
						{ year: 2017, name: 'May', number: 5 },
						{ year: 2017, name: 'June', number: 6 },
						{ year: 2017, name: 'July', number: 7 },
						{ year: 2017, name: 'August', number: 8 },
						{ year: 2017, name: 'September', number: 9 },
						{ year: 2017, name: 'October', number: 10 },
						{ year: 2017, name: 'November', number: 11 },
						{ year: 2017, name: 'December', number: 12 },
						{ year: 2018, name: 'January', number: 1 },
						{ year: 2018, name: 'February', number: 2 }
					];

					mockdate.set( '2018-02-02' );

					expect( financialYear.getMonths( 2017 ) ).toEqual( monthList );
				} );
			} );
		} );
	} );
} );

