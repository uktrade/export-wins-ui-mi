const proxyquire = require( 'proxyquire' );

const getBackendStub = require( '../../../helpers/get-backend-stub' );
const spy = require( '../../../helpers/spy' );

const input = getBackendStub( '/global_wins/' );

let viewModel;
let targetProgressDataSetOutput;
let targetProgressSpy;

describe( 'Global summary view model', function(){

	beforeEach( function(){

		targetProgressDataSetOutput = { targetProgressDataSetOutput: true };
		targetProgressSpy = spy( 'target-progress.create', targetProgressDataSetOutput );
		viewModel = proxyquire( '../../../../../app/lib/view-models/global-summary', {
			'../data-sets/target-progress': { create: targetProgressSpy }
		} );

	} );

	it( 'Should return the correct data', function(){

		const output = viewModel.create( input );

		expect( output ).toEqual( {
			dateRange: input.date_range,
			wins: input.results.wins,
			progress: targetProgressDataSetOutput,
			target: input.results.total_target
		} );

		expect( targetProgressSpy ).toHaveBeenCalledWith( input.results.total_target, input.results.wins.hvc.value.confirmed, input.results.wins.hvc.value.unconfirmed );
	} );
} );
