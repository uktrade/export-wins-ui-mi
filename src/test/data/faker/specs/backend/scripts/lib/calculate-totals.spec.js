const calculateTotals = require( '../../../../../../../data/faker/backend/scripts/lib/calculate-totals' );

describe( 'calculateTotals', function(){

	it( 'Should calculate the total values', function(){
	
		let totals = {

			test1: {
				number: {
					confirmed: 100,
					unconfirmed: 100,
					total: 1000
				},
				value: {
					confirmed: 200,
					unconfirmed: 200,
					total: 1000
				}
			},

			test2: {
				number: {
					confirmed: 250,
					unconfirmed: 250,
					total: 1000
				},
				value: {
					confirmed: 1000,
					unconfirmed: 1000,
					total: 1000
				}
			}
		};

		calculateTotals( totals, [ 'test1', 'test2' ] );

		expect( totals.test1.number.total ).toEqual( 200 );
		expect( totals.test1.value.total ).toEqual( 400 );

		expect( totals.test2.number.total ).toEqual( 500 );
		expect( totals.test2.value.total ).toEqual( 2000 );
	} );
} );
