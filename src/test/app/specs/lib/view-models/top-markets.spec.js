const viewModel = require( '../../../../../app/lib/view-models/top-markets' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = getBackendStub( '/sector_teams/top_non_hvcs' );
const high = 1020000000;

describe( 'Top non HVC view model', function(){

	it( 'Should calculate the maximum value', function(){

		const output = viewModel.create( input );

		expect( output.dateRange ).toEqual( input.date_range );
		expect( output.items ).toBeDefined();

		expect( output.scale.high ).toEqual( high );
		expect( output.scale.mid ).toEqual( high / 2 );
		expect( output.scale.low ).toEqual( high / 4 );
	} );
} );
