const dataset = require( '../../../../../app/lib/data-sets/top-non-hvc' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = getBackendStub( '/sector_teams/top_non_hvcs' );
const high = 1020000000;

describe( 'Top non HVC dataset', function(){

	it( 'Should calculate the maximum value', function(){
	
		const output = dataset.create( input );

		expect( output.high ).toEqual( high );
		expect( output.mid ).toEqual( high / 2 );
		expect( output.low ).toEqual( high / 4 );
	} );
} );
