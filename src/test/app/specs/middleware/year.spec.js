const proxyquire = require( 'proxyquire' );
const spy = require( '../../helpers/spy' );

const currentFinancialYear = 2017;

describe( 'Year middleware', function(){

	let middleware;
	let req;
	let res;
	let next;

	beforeEach( function(){

		req = {};
		res = { locals: {} };
		next = jasmine.createSpy( 'next' );

		middleware = proxyquire( '../../../../app/middleware/year', {
			'../lib/financial-year': { getCurrent: spy( 'financialYear.getCurrent', currentFinancialYear ) }
		} );
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

		it( 'Should add the year to the req', function(){

			expect( req.year ).toEqual( String( currentFinancialYear ) );
		} );
	} );
} );
