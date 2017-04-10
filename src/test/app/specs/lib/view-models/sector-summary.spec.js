const proxyquire = require( 'proxyquire' );

const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = getBackendStub( '/sector_teams/sector_team' );

describe( 'Sector summary view model', function(){

	let viewModel;
	let pieSpy;

	beforeEach( function(){

		pieSpy = {
			create: jasmine.createSpy( 'pieData.create' ).and.callFake( () => ({ a: 1, b: 2 }) )
		};
	
		viewModel = proxyquire( '../../../../../app/lib/view-models/sector-summary', {
			'../data-sets/sector-pie-charts': pieSpy
		} );
	} );


	it( 'Should return the correct data', function(){
	
		const output = viewModel.create( input );
		
		expect( output.confirmedExportValue ).toEqual( 130082 );
		expect( output.unconfirmedExportValue ).toEqual( 67093 );
		expect( output.averageTimeToConfirm ).toEqual( 27 );
		expect( pieSpy.create ).toHaveBeenCalledWith( input );
		expect( output.pieData ).toEqual( { a: 1, b: 2 } );
	} );
} );
