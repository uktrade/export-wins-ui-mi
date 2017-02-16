const calculateConfirmedPercentages = require( '../../../../../../../data/faker/backend/scripts/lib/calculate-confirmed-percentages' );

describe( 'calculateConfirmedPercentages', function(){

	it( 'Should calculate the non_hvc percentage', function(){

		let percentages = {
			hvc: 50,
			non_hvc: 70
		};

		calculateConfirmedPercentages( percentages );

		expect( percentages.non_hvc ).toEqual( 50 );
	} );
} );
