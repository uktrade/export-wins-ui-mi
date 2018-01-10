const transform = require( '../../../../../../app/lib/transformers/export/win-list' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );


describe( 'Win List transformer', function(){

	describe( 'HVC Wins', function(){

		let output;
		let wins;

		beforeEach( function(){

			const data = getBackendStub( '/hvc/win_table' );
			output = transform( data.results );
			wins = output.wins.hvc;
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

		describe( 'Company id', function(){

			it( 'Should create a truncated ref property', function(){

				for( let win of wins ){

					expect( win.company.truncated_id ).toBeDefined();
				}
			} );

			describe( 'When the reference is not too long', function(){

				it( 'Should have the full reference', function(){

					expect( wins[ 0 ].company.truncated_id ).toEqual( '40479' );
				} );
			} );

			describe( 'When the reference is too long', function(){

				it( 'Should truncate the reference', function(){

					let truncated = wins[ 1 ].company.truncated_id.substr( 0, 24 );
					truncated += '...';

					expect( wins[ 1 ].company.truncated_id ).toEqual( truncated );
				} );
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
