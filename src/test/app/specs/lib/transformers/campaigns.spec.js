const transform = require( '../../../../../app/lib/transformers/campaigns' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const sectorTeamCampaigns = getBackendStub( '/sector_teams/campaigns' );
const hvcGroupCampaigns = getBackendStub( '/hvc_groups/campaigns' );
const osRegionCampaigns = getBackendStub( '/os_regions/campaigns' );

describe( 'Sector campaigns transformer', function(){

	function check( input ){

		const output = transform( input.results );

		expect( Array.isArray( output ) ).toEqual( true );
		expect( output.length ).toBeGreaterThan( 0 );

		output.forEach( ( item ) => {

			expect( item.id ).toBeDefined();
			expect( item.name ).toBeDefined();
			expect( item.change ).toBeDefined();
			expect( item.progress ).toBeDefined();
			expect( item.progress.confirmed ).toBeDefined();
			expect( item.progress.unconfirmed ).toBeDefined();
			expect( item.value ).toBeDefined();
			expect( item.value.confirmed ).toBeDefined();
			expect( item.value.unconfirmed ).toBeDefined();
			expect( item.value.total ).toBeDefined();
			expect( item.target ).toBeDefined();
			expect( item.status ).toBeDefined();
			expect( item.number.total ).toBeDefined();
		} );
	}

	describe( 'Sector team', function(){

		it( 'Should return the correct format', function(){

			check( sectorTeamCampaigns );
		} );
	} );

	describe( 'Overseas region', function(){

		it( 'Should return the correct format', function(){

			check( osRegionCampaigns );
		} );
	} );

	describe( 'HVC Group Sector', function(){

		it( 'Should return the correct format', function(){

			check( hvcGroupCampaigns );
		} );
	} );

} );
