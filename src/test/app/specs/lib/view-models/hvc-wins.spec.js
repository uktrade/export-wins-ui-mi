const hvcWins = require( '../../../../../app/lib/view-models/hvc-wins' );

const getBackendStub = require( '../../../helpers/get-backend-stub' );
const input = getBackendStub( '/hvc/win_table' );

describe( 'HVC wins view model', function(){

	let viewModel;

	beforeEach( function(){

		viewModel = hvcWins.create( input );
	} );

	it( 'Should return the correct data', function(){

		expect( viewModel ).toEqual( {
			dateRange: input.date_range,
			hvc: input.results.hvc,
			wins: input.results.wins
		} );
	} );
} );
