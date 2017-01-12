
var mock = require( '../../../mocks/sector-teams-overview' );

function checkSector( sector ){

	expect( sector.name ).toBeDefined();
	expect( sector.hvcColours.red ).toBeDefined();
	expect( sector.hvcColours.amber ).toBeDefined();
	expect( sector.hvcColours.green ).toBeDefined();
	expect( sector.value.current ).toBeDefined();
	expect( sector.value.target ).toBeDefined();
	expect( sector.value.percentage ).toBeDefined();
	expect( sector.hvcVsNonhvcPercentage ).toBeDefined();
}


describe( 'Sector teams overview mock', function(){

	it( 'Should have the right data structure', function(){

		for( let sectorTeam of mock ){

			expect( sectorTeam.id ).toBeDefined();
			expect( sectorTeam.parentSectors ).toBeDefined();
			expect( sectorTeam.image.name ).toBeDefined();
			expect( sectorTeam.image.width ).toBeDefined();
			expect( sectorTeam.image.height ).toBeDefined();
			
			checkSector( sectorTeam );

			for( let parent of sectorTeam.parentSectors ){

				checkSector( parent );
			}
		}
	} );
} );
