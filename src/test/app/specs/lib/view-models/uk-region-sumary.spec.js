const proxyquire = require( 'proxyquire' );

const getBackendStub = require( '../../../helpers/get-backend-stub' );
const spy = require( '../../../helpers/spy' );

const input = getBackendStub( '/uk_regions/region' );

describe( 'UK Region summary view model', function(){

	let viewModel;
	let pieSpy;
	let pieCreateResponse;
	let targetProgressSpy;
	let targetProgressSpyResponse;

	beforeEach( function(){

		pieCreateResponse = { a: 1, b: 2 };
		targetProgressSpyResponse = { c: 3, d: 4 };
		pieSpy = {
			createForNumber: spy( 'pieData.createForNumber', pieCreateResponse )
		};
		targetProgressSpy = {
			create: spy( 'targetProgress.create', targetProgressSpyResponse )
		};

		viewModel = proxyquire( '../../../../../app/lib/view-models/uk-region-summary', {
			'../data-sets/sector-pie-charts': pieSpy,
			'../data-sets/target-progress': targetProgressSpy
		} );
	} );


	it( 'Should return the correct data', function(){

		const output = viewModel.create( input );

		expect( output.dateRange ).toEqual( input.date_range );
		expect( output.target ).toEqual( 0 );
		expect( output.number.confirmed ).toEqual( 645 );
		expect( output.number.unconfirmed ).toEqual( 641 );
		expect( output.value.confirmed ).toEqual( 71118 );
		expect( output.value.unconfirmed ).toEqual( 41054 );
		expect( output.progress ).toEqual( targetProgressSpyResponse );
		expect( output.averageTimeToConfirm ).toEqual( 53.18 );

		expect( pieSpy.createForNumber ).toHaveBeenCalledWith( input.results );
		expect( output.pieData ).toEqual( pieCreateResponse );
	} );
} );
