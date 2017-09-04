const proxyquire = require( 'proxyquire' );

const getBackendStub = require( '../../../helpers/get-backend-stub' );

let input;

describe( 'Sector summary view model', function(){

	let viewModel;
	let targetProgressSpy;

	beforeEach( function(){

		input = getBackendStub( '/sector_teams/sector_team' );

		targetProgressSpy = {
			create: jasmine.createSpy( 'targetProgress.create' ).and.callFake( () => ({ a: 1, b: 2 }) )
		};

		viewModel = proxyquire( '../../../../../app/lib/view-models/sector-hvc-summary', {
			'../data-sets/target-progress': targetProgressSpy
		} );
	} );

	describe( 'With hvcs', function(){

		it( 'Should return the correct data', function(){

			const output = viewModel.create( input );

			expect( output.dateRange ).toEqual( input.date_range );
			expect( output.target ).toEqual( 20178 );
			expect( output.confirmedValue ).toEqual( 34275 );
			expect( output.unconfirmedValue ).toEqual( 23341 );
			expect( targetProgressSpy.create ).toHaveBeenCalledWith( input.results.hvcs.target, input.results.wins.export.hvc.value.confirmed, input.results.wins.export.hvc.value.unconfirmed );
			expect( output.progress ).toEqual( { a: 1, b: 2 } );
		} );
	} );

	describe( 'Without hvcs', function(){

		it( 'Should return the correct data', function(){

			delete input.results.hvcs;

			const output = viewModel.create( input );

			expect( output.dateRange ).toEqual( input.date_range );
			expect( output.target ).toEqual( 0 );
			expect( output.confirmedValue ).toEqual( 34275 );
			expect( output.unconfirmedValue ).toEqual( 23341 );
			expect( targetProgressSpy.create ).toHaveBeenCalledWith( 0, input.results.wins.export.hvc.value.confirmed, input.results.wins.export.hvc.value.unconfirmed );
			expect( output.progress ).toEqual( { a: 1, b: 2 } );
		} );
	} );
} );
