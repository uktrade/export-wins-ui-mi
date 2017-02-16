const calculateExportTotals = require( '../../../../../../../data/faker/backend/scripts/lib/calculate-export-totals' );

describe( 'calculateExportTotals', function(){

	it( 'Should calculat the confirmed, unconfirmed and grand_total', function(){

		let exportVal = {
			hvc: {
				number: {
					confirmed: 50,
					unconfirmed: 100,
					total: 150
				},
				value: {
					confirmed: 150,
					unconfirmed: 200,
					total: 350
				}
			},
			non_hvc: {
				number: {
					confirmed: 250,
					unconfirmed: 300,
					total: 550
				},
				value: {
					confirmed: 350,
					unconfirmed: 400,
					total: 750
				}
			},
			totals: {
				number: {
					confirmed: 0,
					unconfirmed: 0,
					grand_total: 0
				},
				value: {
					confirmed: 0,
					unconfirmed: 0,
					grand_total: 0
				}
			}
		};

		calculateExportTotals( exportVal );

		expect( exportVal.totals.number.confirmed ).toEqual( 300 );
		expect( exportVal.totals.number.unconfirmed ).toEqual( 400 );
		expect( exportVal.totals.number.grand_total ).toEqual( 700 );

		expect( exportVal.totals.value.confirmed ).toEqual( 500 );
		expect( exportVal.totals.value.unconfirmed ).toEqual( 600 );
		expect( exportVal.totals.value.grand_total ).toEqual( 1100 );
	} );
} );
