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
			const results = input.results;
			const exportWins = results.wins.export;

			expect( output.dateRange ).toEqual( input.date_range );
			expect( output.target ).toEqual( 47030 );
			expect( output.number.hvc.confirmed ).toEqual( exportWins.hvc.number.confirmed );
			expect( output.number.hvc.unconfirmed ).toEqual( exportWins.hvc.number.unconfirmed );
			expect( output.number.nonHvc.confirmed ).toEqual( exportWins.non_hvc.number.confirmed );
			expect( output.number.nonHvc.unconfirmed ).toEqual( exportWins.non_hvc.number.unconfirmed );
			expect( output.number.totals.confirmed ).toEqual( exportWins.totals.number.confirmed );
			expect( output.number.totals.unconfirmed ).toEqual( exportWins.totals.number.unconfirmed );
			expect( output.value.confirmed ).toEqual( 181587 );
			expect( output.value.unconfirmed ).toEqual( 69714 );
			expect( output.progress ).toEqual( targetProgressSpyResponse );
			expect( output.averageTimeToConfirm ).toEqual( 68.89 );

			expect( targetProgressSpy.create ).toHaveBeenCalledWith( results.target.total, exportWins.totals.number.confirmed, exportWins.totals.number.unconfirmed );
		} );
	} );

	describe( 'With null target response', function(){

		it( 'Should return the correct data', function(){

			const input = getBackendStub( '/uk_regions/region.null-target' );
			const output = viewModel.create( input );
			const exportWins = input.results.wins.export;

			expect( output.dateRange ).toEqual( input.date_range );
			expect( output.target ).toEqual( 0 );
			expect( output.number.hvc.confirmed ).toEqual( exportWins.hvc.number.confirmed );
			expect( output.number.hvc.unconfirmed ).toEqual( exportWins.hvc.number.unconfirmed );
			expect( output.number.nonHvc.confirmed ).toEqual( exportWins.non_hvc.number.confirmed );
			expect( output.number.nonHvc.unconfirmed ).toEqual( exportWins.non_hvc.number.unconfirmed );
			expect( output.number.totals.confirmed ).toEqual( exportWins.totals.number.confirmed );
			expect( output.number.totals.unconfirmed ).toEqual( exportWins.totals.number.unconfirmed );
			expect( output.value.confirmed ).toEqual( 181587 );
			expect( output.value.unconfirmed ).toEqual( 69714 );
			expect( output.progress ).toEqual( targetProgressSpyResponse );
			expect( output.averageTimeToConfirm ).toEqual( 68.89 );

			expect( targetProgressSpy.create ).toHaveBeenCalledWith( 0, exportWins.totals.number.confirmed, exportWins.totals.number.unconfirmed );
		} );
	} );
} );
