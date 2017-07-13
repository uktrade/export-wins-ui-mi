const transform = require( '../../../../../app/lib/transformers/win-list' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const data = getBackendStub( '/hvc/win_table' );

describe( 'Win List transformer', function(){

	let output;
	let wins;

	beforeEach( function(){

		output = transform( data.results );
		wins = output.wins;
	} );

	describe( 'Credit', function(){

		it( 'Should conver the boolean', function(){

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
