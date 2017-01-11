
const dataset = require( '../../../../../app/lib/data-sets/sector-wins' );

const input = {
	"hvcs": { "target": 165000000 },
	"wins": {
		"hvc": {
			"number": {
				"non_confirmed": 49,
				"confirmed": 21,
				"total": 70
			},
			"value": {
				"non_confirmed": 4900000,
				"confirmed": 2100000,
				"total": 7000000
			}
		},
		"non_hvc": {
			"number": {
				"non_confirmed": 59,
				"confirmed": 41,
				"total": 100
			},
			"value": {
				"non_confirmed": 5900000,
				"confirmed": 4100000,
				"total": 10000000
			}
		}
	},
	"name": "Technology"
};


describe( 'Sector wins data data set', function(){

	it( 'Should return the correct structure', function(){

		const output = dataset.create( input );

		expect( output.hvc.confirmed ).toEqual( 30 );
		expect( output.hvc.unconfirmed ).toEqual( 70 );

		expect( output.combined.confirmed ).toEqual( 36 );
		expect( output.combined.unconfirmed ).toEqual( 64 );

	} );
} );
