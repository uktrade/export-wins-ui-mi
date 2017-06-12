const mockdate = require( 'mockdate' );
const middleware = require( '../../../../../app/lib/middleware/year' );

describe( 'Year middleware', function(){

	let req;
	let res;
	let next;

	beforeEach( function(){

		req = {};
		res = { locals: {} };
		next = jasmine.createSpy( 'next' );
	} );

	describe( 'When there is a year in the URL', function(){

		describe( 'When the year is 2016', function(){

			beforeEach( function(){

				req.url = '/2016/';

				middleware( req, res, next );
			} );

			it( 'Should put 2016 as the year in the req object', function(){

				expect( req.year ).toEqual( '2016' );
			} );

			it( 'Should set isDefaultYear to false', function(){

				expect( req.isDefaultYear ).toEqual( false );
			} );

			it( 'Should remove the year from the URL', function(){

				expect( req.url ).toEqual( '/' );
			} );

			it( 'Shoud call the next function', function(){

				expect( next ).toHaveBeenCalled();
			} );

			it( 'Should add the year as a local and it should be a number', function(){

				expect( res.locals.selectedYear ).toEqual( Number( req.year ) );
				expect( typeof res.locals.selectedYear ).toEqual( 'number' );
			} );
		} );
	} );

	describe( 'When a year is not present in the URL', function(){

		describe( 'For all dates', function(){

			beforeEach( function(){

				middleware( req, res, next );
			} );

			it( 'Should call next', function(){

				expect( next ).toHaveBeenCalled();
			} );

			it( 'Should set isDefaultYear to true', function(){

				expect( req.isDefaultYear ).toEqual( true );
			} );

			it( 'Should add the year as a local', function(){

				expect( res.locals.selectedYear ).toEqual( Number( req.year ) );
			} );
		} );

		describe( 'For date specific stuff', function(){

			afterEach( function(){

				mockdate.reset();
			} );

			describe( 'When the month is january', function(){

				it( 'Should default to the current year', function(){

					mockdate.set( '2017-01-01' );
					middleware( req, res, next );

					expect( req.year ).toEqual( '2016' );
				} );
			} );

			describe( 'When the month is february', function(){

				it( 'Should default to the current year', function(){

					mockdate.set( '2017-02-01' );
					middleware( req, res, next );

					expect( req.year ).toEqual( '2016' );
				} );
			} );

			describe( 'When the month is march', function(){

				it( 'Should default to the current year', function(){

					mockdate.set( '2017-03-01' );
					middleware( req, res, next );

					expect( req.year ).toEqual( '2016' );
				} );
			} );

			describe( 'When the month is february', function(){

				it( 'Should default to the current year', function(){

					mockdate.set( '2017-04-01' );
					middleware( req, res, next );

					expect( req.year ).toEqual( '2017' );
				} );
			} );

			describe( 'When the month is after march', function(){

				it( 'Should default to the current year', function(){

					mockdate.set( '2017-06-01' );
					middleware( req, res, next );

					expect( req.year ).toEqual( '2017' );
				} );
			} );
		} );

	} );
} );
