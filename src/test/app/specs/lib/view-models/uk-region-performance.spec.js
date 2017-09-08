const proxyquire = require( 'proxyquire' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );
const spy = require( '../../../helpers/spy' );

const input = getBackendStub( '/uk_regions/region' );

describe( 'UK Region performance view model', function(){

	let viewModel;
	let output;
	let targetProgressSpy;
	let targetProgressSpyResponse;

	function checkType( index, key, name ){

		const item = output.items[ index ];
		const target = input.results.target[ key ];
		const wins = input.results.export_experience[ key ];

		expect( item.name ).toEqual( name );
		expect( item.target ).toEqual( target );
		expect( item.value ).toEqual( wins.value.total );
		expect( item.wins.total ).toEqual( wins.number.total );
		expect( item.wins.confirmed ).toEqual( wins.number.confirmed );
		expect( item.progress ).toEqual( targetProgressSpyResponse );
		expect( targetProgressSpy.calls.argsFor( index ) ).toEqual( [ target, wins.number.confirmed, wins.number.unconfirmed ] );
	}

	beforeEach( function(){

		targetProgressSpyResponse = { targetProgress: true };
		targetProgressSpy = spy( 'targetProgress', targetProgressSpyResponse );

		viewModel = proxyquire( '../../../../../app/lib/view-models/uk-region-performance' , {
			'../data-sets/target-progress': { create: targetProgressSpy }
		} );
	} );

	describe( 'With default input', function(){

		beforeEach( function(){

			output = viewModel.create( input );
		} );

		describe( 'The output', function(){

			it( 'Should have a data and an array of items', function(){

				expect( output.dateRange ).toEqual( input.date_range );
				expect( Array.isArray( output.items ) ).toEqual( true );
			} );
		} );

		describe( 'Checking the types of exporter', function(){

			describe( 'With a target', function(){

				it( 'Should return the correct data', function(){

					checkType( 0, 'new_exporters', 'New' );
					checkType( 1, 'sustainable', 'Sustainable' );
					checkType( 2, 'growth', 'Growth' );
				} );
			} );

			describe( 'Without a target', function(){

				it( 'Should return 0 for the target', function(){

					const item = output.items[ 3 ];
					const wins = input.results.export_experience.unknown;

					expect( item.name ).toEqual( 'Unknown' );
					expect( item.target ).toEqual( 0 );
					expect( item.value ).toEqual( wins.value.total );
					expect( item.wins.total ).toEqual( wins.number.total );
					expect( item.wins.confirmed ).toEqual( wins.number.confirmed );
					expect( item.progress ).toEqual( targetProgressSpyResponse );
				} );
			} );
		} );
	} );

	describe( 'Missing exporter input', function(){

		describe( 'When the exporter does not exist', function(){

			it( 'Should skip the exporter and not throw an error', function(){

				const input = getBackendStub( '/uk_regions/region.missing-exporter' );
				output = viewModel.create( input );

				expect( output ).toBeDefined();
			} );
		} );
	} );

	describe( 'Missing target input', function(){

		describe( 'When the exporter does not exist', function(){

			it( 'Should not throw an error', function(){

				const input = getBackendStub( '/uk_regions/region.null-target' );
				output = viewModel.create( input );

				expect( output ).toBeDefined();
			} );
		} );
	} );
} );
