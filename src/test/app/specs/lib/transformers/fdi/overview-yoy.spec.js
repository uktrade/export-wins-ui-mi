const transform = require( '../../../../../../app/lib/transformers/fdi/overview-yoy' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );

const input = getBackendStub( '/investment/fdi/overview-yoy' );

describe( 'FDI Overview YOY Transformer', function(){

	let output;

	describe( 'With a full response', function(){

		beforeEach( function(){

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
	} );
} );
