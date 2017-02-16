const calculateTotal = require( '../../../../../../../data/faker/backend/scripts/lib/calculate-target' );

describe( 'calculateTotal', function(){

	it( 'Should calculate the total from an amount and percentage of the total', function(){

		let values = {
			current: 25,
			target_percentage: 25,
			target: 300
		};

		let values2 = {
			current: 100,
			target_percentage: 50,
			target: 1000
		};

		let values3 = {
			current: 62132,
			target_percentage: 52,
			target: 1
		};

		calculateTotal( values );
		calculateTotal( values2 );
		calculateTotal( values3 );

		expect( values.target ).toEqual( 100 );
		expect( values2.target ).toEqual( 200 );
		expect( values3.target ).toEqual( 119485 );
	} );
} );
