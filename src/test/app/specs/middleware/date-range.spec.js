
const middleware = require( '../../../../app/middleware/date-range' );

describe( 'dateRange middleware', function(){

	let req;
	let res;
	let next;

	beforeEach( function(){

		req = {
			query: {}
		};
		res = {
			locals: {}
		};
		next = jasmine.createSpy( 'next' );
	} );

	describe( 'When there is a date in the query params', function(){

		describe( 'When there is a start date query param', function(){

			it( 'Should create a dateRange object on the req with a start property and a filters object', function(){

				const date = { start: 1234 };
				req.query = { date };

				middleware( req, res, next );

				expect( req.dateRange.start ).toEqual( date.start );
				expect( req.filters[ 'date[start]' ] ).toEqual( date.start );
				expect( next ).toHaveBeenCalled();
			} );
		} );

		describe( 'When there is an end date query param', function(){

			it( 'Should create a dateRange object on the req with an end property and a filters object', function(){

				const date = { end: 1234 };
				req.query = { date };

				middleware( req, res, next );

				expect( req.dateRange.end ).toEqual( date.end );
				expect( req.filters[ 'date[end]' ] ).toEqual( date.end );
				expect( next ).toHaveBeenCalled();
			} );
		} );
	} );

	describe( 'When there is not a start or end query param', function(){

		it( 'Should not create an object on the req', function(){

			middleware( req, res, next );

			expect( res.dateRange ).not.toBeDefined();
			expect( next ).toHaveBeenCalled();
		} );
	} );
} );
