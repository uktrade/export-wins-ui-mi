const proxyquire = require( 'proxyquire' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );
const spy = require( '../../../helpers/spy' );

const viewModelPath = '../../../../../app/lib/view-models/uk-regions-overview-regions';

let viewModel;

describe( 'UK Regions Overview Regions view model', function(){

	let ukRegionPerformanceResponse;
	let ukRegionPerformanceSpy;

	beforeEach( function(){

		ukRegionPerformanceResponse = { ukRegionPerformanceResponse: true };
		ukRegionPerformanceSpy = spy( 'uk-region-performance', ukRegionPerformanceResponse );

		viewModel = proxyquire( viewModelPath, {
			'./uk-region-performance': { create: ukRegionPerformanceSpy }
		} );
	} );

	describe( 'With normal response', function(){

		it( 'Should return the correct data', function(){

			const input = getBackendStub( '/uk_regions/overview' );
			const output = viewModel.create( input.date_range, input.results.region_groups );
			const regions = input.results.region_groups.reduce( ( total, group ) => total += group.regions.length, 0 );

			expect( output ).toBeDefined();
			expect( Array.isArray( output ) ).toEqual( true );
			expect( ukRegionPerformanceSpy ).toHaveBeenCalled();
			expect( ukRegionPerformanceSpy.calls.count() ).toEqual( regions );

			for( let group of output ){

				expect( group.name ).toBeDefined();
				expect( Array.isArray( group.regions ) ).toEqual( true );

				for( let region of group.regions ){

					expect( region.id ).toBeDefined();
					expect( region.name ).toBeDefined();
					expect( region.exports ).toEqual( ukRegionPerformanceResponse );
				}
			}
		} );
	} );
} );
