const transform = require( '../../../../../../app/lib/transformers/fdi/overview-yoy' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );


describe( 'FDI Overview YOY Transformer', function(){

	let output;

	describe( 'With a full response', function(){

		beforeEach( function(){

			//get stub each time as it's reversed in place
			const input = getBackendStub( '/investment/fdi/overview-yoy' );
			output = transform( input.results );
		} );

		function checkItems( list ){

			expect( Array.isArray( list ) ).toEqual( true );

			for( let item of list ){

				expect( item.year ).toBeDefined();
				expect( item.projects ).toBeDefined();
				expect( item.jobs.new ).toBeDefined();
				expect( item.jobs.safe ).toBeDefined();
				expect( item.capex ).toBeDefined();
			}
		}

		it( 'Should transform the response to the correct format', function(){

			checkItems( output.high );
			checkItems( output.good );
			checkItems( output.standard );
		} );

		it( 'Should reverse the order', function(){

			expect( output.high[ 0 ].year ).toEqual( '2016-17' );
			expect( output.high[ 1 ].year ).toEqual( '2015-16' );
			expect( output.high[ 2 ].year ).toEqual( '2014-15' );
			expect( output.high[ 3 ].year ).toEqual( '2013-14' );
		} );
	} );
} );
