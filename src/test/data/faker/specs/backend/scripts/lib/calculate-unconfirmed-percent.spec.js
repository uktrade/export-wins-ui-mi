const calculateUnconfirmedPercent = require( '../../../../../../../data/faker/backend/scripts/lib/calculate-unconfirmed-percent' );

describe( 'calculateUnconfirmedPercent', function(){

	it( 'Should calculate the unconfirmed percentage', function(){

		let input = {
			test1: {
				confirmed_percent: 50,
				unconfirmed_percent: 100
			},
			test2: {
				confirmed_percent: 99,
				unconfirmed_percent: 99
			}
		};

		calculateUnconfirmedPercent( input, [ 'test1', 'test2' ] );

		expect( input.test1.unconfirmed_percent ).toEqual( 50 );
		expect( input.test2.unconfirmed_percent ).toEqual( 1 );
	} );
} );
