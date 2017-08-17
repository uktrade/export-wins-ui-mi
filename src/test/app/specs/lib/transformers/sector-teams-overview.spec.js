const transform = require( '../../../../../app/lib/transformers/sector-teams-overview' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = getBackendStub( '/sector_teams/overview' );

describe( 'Sector teams overview transformer', function(){

	describe( 'Using stub data', function(){

		let output;

		beforeEach( function(){

			output = transform( input.results );
		} );

		it( 'Should not add the images', function(){

			for( let team of output ){

				expect( team.image ).not.toBeDefined();
			}
		} );

		it( 'Should give the sector teams the correct properties', function(){

			for( let team of output ){

				expect( team.id ).toBeDefined();
				expect( team.name ).toBeDefined();
				expect( team.name.substr( -11 ) ).toEqual( 'Sector Team' );
				expect( team.hvcPerformance ).toBeDefined();
				expect( team.hvcGroups ).toBeDefined();
				expect( team.values.hvc.targetPercent.confirmed.capped ).toBeDefined();
				expect( team.values.hvc.targetPercent.confirmed.isOver ).toBeDefined();
				expect( team.values.hvc.targetPercent.confirmed.value ).toBeDefined();
				expect( team.values.hvc.targetPercent.unconfirmed.capped ).toBeDefined();
				expect( team.values.hvc.targetPercent.unconfirmed.isOver ).toBeDefined();
				expect( team.values.hvc.targetPercent.unconfirmed.value ).toBeDefined();
				expect( team.values.hvc.current.confirmed ).toBeDefined();
				expect( team.values.hvc.current.unconfirmed ).toBeDefined();
				expect( team.values.nonHvc.current.confirmed ).toBeDefined();
				expect( team.values.nonHvc.current.unconfirmed ).toBeDefined();
				expect( team.values.hvc.target ).toBeDefined();
				expect( team.values.totals.confirmed ).toBeDefined();
				expect( team.values.totals.unconfirmed ).toBeDefined();
				expect( team.confirmedPercent.hvc ).toBeDefined();
				expect( team.confirmedPercent.nonHvc ).toBeDefined();
			}
		} );

		it( 'Should give the HVC Groups the correct properties', function(){

			for( let team of output ){

				for( let hvcGroup of team.hvcGroups ){

					expect( hvcGroup.id ).toBeDefined();
					expect( hvcGroup.name ).toBeDefined();
					expect( hvcGroup.name.substr( -4 ) ).toEqual( 'HVCs' );
					expect( hvcGroup.hvcPerformance ).toBeDefined();
					expect( hvcGroup.values.hvc.targetPercent.confirmed.capped ).toBeDefined();
					expect( hvcGroup.values.hvc.targetPercent.confirmed.isOver ).toBeDefined();
					expect( hvcGroup.values.hvc.targetPercent.confirmed.value ).toBeDefined();
					expect( hvcGroup.values.hvc.targetPercent.unconfirmed.capped ).toBeDefined();
					expect( hvcGroup.values.hvc.targetPercent.unconfirmed.isOver ).toBeDefined();
					expect( hvcGroup.values.hvc.targetPercent.unconfirmed.value ).toBeDefined();
					expect( hvcGroup.values.hvc.current.confirmed ).toBeDefined();
					expect( hvcGroup.values.hvc.current.unconfirmed ).toBeDefined();
					expect( hvcGroup.nonHvc ).not.toBeDefined();
					expect( hvcGroup.confirmedPercent ).not.toBeDefined();
				}
			}
		} );

		it( 'Should add a capped percentage of 100, along with a marker to say it is over', function(){

			expect( output[ 0 ].values.hvc.targetPercent.confirmed.capped ).toEqual( 100 );
			expect( output[ 0 ].values.hvc.targetPercent.confirmed.isOver ).toEqual( true );
			expect( output[ 0 ].values.hvc.targetPercent.confirmed.value ).toEqual( 125 );

			expect( output[ 0 ].values.hvc.targetPercent.unconfirmed.capped ).toEqual( 100 );
			expect( output[ 0 ].values.hvc.targetPercent.unconfirmed.isOver ).toEqual( true );
			expect( output[ 0 ].values.hvc.targetPercent.unconfirmed.value ).toEqual( 103 );
		} );

		it( 'Should define all HVC types and ensure they have a min of 0', function(){

			expect( output[ 0 ].hvcPerformance.red ).toEqual( 0 );
			expect( output[ 0 ].hvcPerformance.amber ).toEqual( 13 );
			expect( output[ 0 ].hvcPerformance.green ).toEqual( 0 );
			expect( output[ 0 ].hvcPerformance.zero ).toEqual( 9 );

			expect( output[ 0 ].hvcGroups[0].hvcPerformance.red ).toEqual( 19 );
			expect( output[ 0 ].hvcGroups[0].hvcPerformance.amber ).toEqual( 6 );
			expect( output[ 0 ].hvcGroups[0].hvcPerformance.green ).toEqual( 25 );
			expect( output[ 0 ].hvcGroups[0].hvcPerformance.zero ).toEqual( 14 );

			expect( output[ 3 ].hvcPerformance.red ).toEqual( 9 );
			expect( output[ 3 ].hvcPerformance.amber ).toEqual( 23 );
			expect( output[ 3 ].hvcPerformance.green ).toEqual( 22 );
			expect( output[ 3 ].hvcPerformance.zero ).toEqual( 0 );

			expect( output[ 4 ].hvcPerformance.red ).toEqual( 25 );
			expect( output[ 4 ].hvcPerformance.amber ).toEqual( 21 );
			expect( output[ 4 ].hvcPerformance.green ).toEqual( 1 );
			expect( output[ 4 ].hvcPerformance.zero ).toEqual( 7 );
		} );

		it( 'Should calculate the total amount of HVCs', function(){

			expect( output[ 0 ].totalHvcs ).toEqual( 22 );
			expect( output[ 3 ].totalHvcs ).toEqual( 54 );
			expect( output[ 4 ].totalHvcs ).toEqual( 54 );
		} );
	} );
} );
