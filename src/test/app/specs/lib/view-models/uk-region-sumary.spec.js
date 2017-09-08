const proxyquire = require( 'proxyquire' );

const getBackendStub = require( '../../../helpers/get-backend-stub' );
const spy = require( '../../../helpers/spy' );

describe( 'UK Region summary view model', function(){

	let viewModel;
	let targetProgressSpy;
	let targetProgressSpyResponse;

	beforeEach( function(){

		targetProgressSpyResponse = { c: 3, d: 4 };
		targetProgressSpy = {
			create: spy( 'targetProgress.create', targetProgressSpyResponse )
		};

		viewModel = proxyquire( '../../../../../app/lib/view-models/uk-region-summary', {
			'../data-sets/target-progress': targetProgressSpy
		} );
	} );

	describe( 'With normal response', function(){

		it( 'Should return the correct data', function(){

			const input = getBackendStub( '/uk_regions/region' );
			const output = viewModel.create( input );

			expect( output.dateRange ).toEqual( input.date_range );
			expect( output.target ).toEqual( 47030 );
			expect( output.number.confirmed ).toEqual( 746 );
			expect( output.number.unconfirmed ).toEqual( 1708 );
			expect( output.number.hvc ).toEqual( 473 );
			expect( output.number.nonHvc ).toEqual( 273 );
			expect( output.value.confirmed ).toEqual( 181587 );
			expect( output.value.unconfirmed ).toEqual( 69714 );
			expect( output.progress ).toEqual( targetProgressSpyResponse );
			expect( output.averageTimeToConfirm ).toEqual( 68.89 );
		} );
	} );

	describe( 'With null target response', function(){

		it( 'Should return the correct data', function(){

			const input = getBackendStub( '/uk_regions/region.null-target' );
			const output = viewModel.create( input );

			expect( output.dateRange ).toEqual( input.date_range );
			expect( output.target ).toEqual( 0 );
			expect( output.number.confirmed ).toEqual( 746 );
			expect( output.number.unconfirmed ).toEqual( 1708 );
			expect( output.number.hvc ).toEqual( 473 );
			expect( output.number.nonHvc ).toEqual( 273 );
			expect( output.value.confirmed ).toEqual( 181587 );
			expect( output.value.unconfirmed ).toEqual( 69714 );
			expect( output.progress ).toEqual( targetProgressSpyResponse );
			expect( output.averageTimeToConfirm ).toEqual( 68.89 );
		} );
	} );
} );
