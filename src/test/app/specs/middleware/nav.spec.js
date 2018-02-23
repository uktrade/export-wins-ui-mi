const navMiddleware = require( '../../../../app/middleware/nav' );

function check( resultsItem, activeItem ){

	const req = {};
	const res = { locals: {} };
	const next = jasmine.createSpy( 'next' );

	navMiddleware( activeItem )( req, res, next );

	expect( res.locals.nav ).toEqual( resultsItem );
	expect( next ).toHaveBeenCalled();
}

function checkTypes( name ){

	const activeItem = {};
	const resultsItem = {
		isExport: false,
		isInvestment: false,
		isDownload: false
	};

	resultsItem[ name ] = true;

	activeItem[ name ] = true;

	check( resultsItem, activeItem );

	activeItem[ name ] = 'blah';

	check( resultsItem, activeItem );
}

describe( 'Nav', function(){

	describe( 'Calling with no args', function(){

		it( 'Should return false for each item', function(){

			const req = {};
			const res = { locals: {} };
			const next = jasmine.createSpy( 'next' );

			navMiddleware()( req, res, next );

			expect( res.locals.nav ).toEqual( {
				isExport: false,
				isInvestment: false,
				isDownload: false
			} );
			expect( next ).toHaveBeenCalled();
		} );
	} );

	describe( 'isExport', function(){

		it( 'Should set export to true', function(){

			checkTypes( 'isExport' );
		} );
	} );

	describe( 'isInvestment', function(){

		it( 'Should set export to true', function(){

			checkTypes( 'isInvestment' );
		} );
	} );

	describe( 'isDownload', function(){

		it( 'Should set export to true', function(){

			checkTypes( 'isDownload' );
		} );
	} );
} );
