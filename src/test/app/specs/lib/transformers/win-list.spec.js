const transform = require( '../../../../../app/lib/transformers/win-list' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );


describe( 'Win List transformer', function(){

	describe( 'HVC Wins', function(){

		let output;
		let wins;

		beforeEach( function(){

			const data = getBackendStub( '/hvc/win_table' );
			output = transform( data.results );
			wins = output.wins.hvc;
		} );

		describe( 'Credit', function(){

			it( 'Should convert the boolean', function(){

				expect( wins[ 0 ].credit.name ).toEqual( 'No' );
				expect( wins[ 0 ].credit.modifyer ).toEqual( 'no' );

				expect( wins[ 1 ].credit.name ).toEqual( 'Yes' );
				expect( wins[ 1 ].credit.modifyer ).toEqual( 'yes' );
			} );
		} );

		describe( 'Status', function(){

			it( 'Should convert the status', function(){

				expect( wins[ 0 ].status.name ).toEqual( 'Not yet sent' );
				expect( wins[ 0 ].status.modifyer ).toEqual( 'not-sent' );

				expect( wins[ 1 ].status.name ).toEqual( 'Rejected' );
				expect( wins[ 1 ].status.modifyer ).toEqual( 'rejected' );

				expect( wins[ 2 ].status.name ).toEqual( 'Confirmed' );
				expect( wins[ 2 ].status.modifyer ).toEqual( 'confirmed' );

				expect( wins[ 3 ].status.name ).toEqual( 'Sent but not confirmed' );
				expect( wins[ 3 ].status.modifyer ).toEqual( 'sent' );
			} );
		} );
	} );

	describe( 'Sector Team HVC and non HVC wins', function(){

		describe( 'HVC wins', function(){

			let output;
			let wins;

			beforeEach( function(){

				const data = getBackendStub( '/sector_teams/win_table' );
				output = transform( data.results );
				wins = output.wins.hvc;
			} );

			describe( 'When the HVC name contains the code at the end', function(){

				it( 'Should remove the code from the name', function(){

					expect( wins[ 0 ].hvc.name ).toEqual( 'est illo vitae' );
					expect( wins[ 1 ].hvc.name ).toEqual( 'pariatur iusto quam' );
				} );
			} );

			describe( 'When the HVC name does not contain the code at the end', function(){

				it( 'Should leave the name as it was', function(){

					expect( wins[ 2 ].hvc.name ).toEqual( 'tempora consequatur asperiores' );
				} );
			} );
		} );

		describe( 'non HVC Wins', function(){

			let output;
			let wins;

			beforeEach( function(){

				const data = getBackendStub( '/sector_teams/win_table' );
				output = transform( data.results );
				wins = output.wins.non_hvc;
			} );

			describe( 'Credit', function(){

				it( 'Should convert the boolean', function(){

					expect( wins[ 0 ].credit.name ).toEqual( 'Yes' );
					expect( wins[ 0 ].credit.modifyer ).toEqual( 'yes' );

					expect( wins[ 1 ].credit.name ).toEqual( 'No' );
					expect( wins[ 1 ].credit.modifyer ).toEqual( 'no' );
				} );
			} );

			describe( 'Status', function(){

				it( 'Should convert the status', function(){

					expect( wins[ 0 ].status.name ).toEqual( 'Not yet sent' );
					expect( wins[ 0 ].status.modifyer ).toEqual( 'not-sent' );

					expect( wins[ 1 ].status.name ).toEqual( 'Sent but not confirmed' );
					expect( wins[ 1 ].status.modifyer ).toEqual( 'sent' );

					expect( wins[ 2 ].status.name ).toEqual( 'Confirmed' );
					expect( wins[ 2 ].status.modifyer ).toEqual( 'confirmed' );

					expect( wins[ 3 ].status.name ).toEqual( 'Rejected' );
					expect( wins[ 3 ].status.modifyer ).toEqual( 'rejected' );

				} );
			} );
		} );
	} );
} );
