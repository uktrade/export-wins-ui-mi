const proxyquire = require( 'proxyquire' );

const getBackendStub = require( '../../../helpers/get-backend-stub' );
const input = getBackendStub( '/hvc/hvc' );

describe( 'HVC detil view model', function(){

	let viewModel;
	let targetProgressDataSet;

	beforeEach( function(){

		targetProgressDataSet = jasmine.createSpy( 'target-progress.create' ).and.callFake( function(){
			return {};
		} );
		viewModel = proxyquire( '../../../../../app/lib/view-models/hvc-detail', {

			'../data-sets/target-progress': {
				create: targetProgressDataSet
			}
		} );
	} );

	it( 'Should return the correct data', function(){

		const output = viewModel.create( input );

		expect( output ).toEqual( {
			id: 29792,
			name: 'rerum blanditiis rerum',
			averageTimeToConfirm: 17,
			summary: {
				dateRange: input.date_range,
				pieData: {
					confirmedUnconfirmedValue: {
						confirmed: 65,
						unconfirmed: 25
					}
				},
				progress: {
					status: 'amber',
					confirmed: 71
				}
			},
			hvcSummary: {
				dateRange: input.date_range,
				target: 10338247,
				confirmedValue: 650000,
				unconfirmedValue: 250000,
				progress: {}
			}
		} );

		expect( targetProgressDataSet ).toHaveBeenCalledWith( 10338247, 650000, 250000 );
	} );
} );
