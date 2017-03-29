
const middleware = require( '../../../../../app/lib/middleware/link-hvc' );

describe( 'linkHvc middleware', function(){

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
	

	describe( 'When there is a query param', function(){

		let linkHvc;

		beforeEach( function(){
		
			linkHvc = 'true';
			req.query = {
				linkHvc
			};
		} );
	
		it( 'Should set the local to the value of the param', function(){

			middleware( req, res, next );
	
			expect( res.locals.linkHvc ).toEqual( linkHvc );
			expect( next ).toHaveBeenCalled();
		} );
	} );

	describe( 'When there is not a query param', function(){
	
		it( 'Should not set the local', function(){

			middleware( req, res, next );
	
			expect( res.locals ).toEqual( {} );
			expect( next ).toHaveBeenCalled();
		} );
	} );
} );
