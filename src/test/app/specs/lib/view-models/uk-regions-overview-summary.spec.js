const proxyquire = require( 'proxyquire' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );
const spy = require( '../../../helpers/spy' );

const viewModelPath = '../../../../../app/lib/view-models/uk-regions-overview-summary';

let viewModel;

describe( 'UK Regions Overview Summary view model', function(){

	let targetProgressResponse;
	let targetProgressSpy;

	beforeEach( function(){

		targetProgressResponse = { targetProgressResponse: true };
		targetProgressSpy = spy( 'target-progress', targetProgressResponse );

		viewModel = proxyquire( viewModelPath, {
			'../data-sets/target-progress': { create: targetProgressSpy }
		} );
	} );

	describe( 'With normal response', function(){

		it( 'Should return the correct data', function(){

			const input = getBackendStub( '/uk_regions/overview' );
			const output = viewModel.create( input.date_range, input.results.summary );
			const inputData = input.results.summary.non_hvc;

			expect( targetProgressSpy ).toHaveBeenCalled();

			expect( output.dateRange ).toEqual( input.date_range );
			expect( output.target ).toEqual( inputData.performance.target );
			expect( output.number.confirmed ).toEqual( inputData.number.confirmed );
			expect( output.number.unconfirmed ).toEqual( inputData.number.unconfirmed );
			expect( output.value.confirmed ).toEqual( inputData.value.confirmed );
			expect( output.progress ).toEqual( targetProgressResponse );
			expect( targetProgressSpy ).toHaveBeenCalledWith( inputData.performance.target, inputData.number.confirmed, inputData.number.unconfirmed );
		} );
	} );
} );
