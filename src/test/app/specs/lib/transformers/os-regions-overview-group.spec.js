const getBackendStub = require( '../../../helpers/get-backend-stub' );

const transform = require( '../../../../../app/lib/transformers/os-regions-overview-groups' );
const transformOverview = require( '../../../../../app/lib/transformers/os-regions-overview' );

const groupInput2016 = getBackendStub( '/os_region_groups/index.2016' );
const regionsInput2016 = getBackendStub( '/os_regions/overview.2016' );

const groupInput2017 = getBackendStub( '/os_region_groups/index.2017' );
const regionsInput2017 = getBackendStub( '/os_regions/overview.2017' );

describe( 'Overseas Regions Overview Groups transformer', function(){

	function checkGroup( group ){

		expect( group.image.url ).toBeDefined();
		expect( group.image.width ).toBeDefined();
		expect( group.image.height ).toBeDefined();
	}

	describe( '2016', function(){

		let output;

		beforeAll( function(){

			regionsInput2016.results = transformOverview( regionsInput2016.results );
			output = transform( groupInput2016, regionsInput2016 );
		} );

		describe( 'The overview groups', function(){

			it( 'Should add the image to each group', function(){

				output.results.forEach( checkGroup );
			} );

			describe( 'The regions', function(){

				it( 'Should add the colour to each region', function(){

					output.results.forEach( ( group ) => {

						group.regions.forEach( ( region ) => {

							expect( region.colour ).toBeDefined();
						} );
					} );
				} );
			} );
		} );
	} );

	describe( '2017', function(){

		let output;

		beforeAll( function(){

			regionsInput2017.results = transformOverview( regionsInput2017.results );
			output = transform( groupInput2017, regionsInput2017 );
		} );

		describe( 'The overview groups', function(){

			it( 'Should add the image to each group', function(){

				output.results.forEach( checkGroup );
			} );

			describe( 'The regions', function(){

				it( 'Should add the colour to each region', function(){

					output.results.forEach( ( group ) => {

						group.regions.forEach( ( region ) => {

							expect( region.colour ).toBeDefined();
						} );
					} );
				} );
			} );
		} );
	} );
} );
