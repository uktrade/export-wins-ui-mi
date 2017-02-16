const transform = require( '../../../../../app/lib/transformers/hvc-group' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const hvcGroupInput = getBackendStub( '/hvc_groups/group' );

describe( 'HVC Group transformer', function(){

	let output;

	describe( 'With a hvc group', function(){
		
		beforeEach( function(){
		
			output = transform( hvcGroupInput );
		} );
	
		it( 'Should calculate the total confirmed', function(){
		
			expect( output.exportValue ).toEqual( 59481 );
		} );
	} );
} );
