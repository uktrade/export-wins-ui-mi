
const dataset = require( '../../../../../app/lib/data-sets/sector-pie-charts' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = {
	"hvcs": { "target": 165000000 },
	"wins": {
		"export": {
			"hvc": {
				"number": {
					"unconfirmed": 49,
					"confirmed": 21,
					"total": 70
				},
				"value": {
					"unconfirmed": 4900000,
					"confirmed": 2100000,
					"total": 7000000
				}
			},
			"non_hvc": {
				"number": {
					"unconfirmed": 59,
					"confirmed": 41,
					"total": 100
				},
				"value": {
					"unconfirmed": 5900000,
					"confirmed": 4100000,
					"total": 10000000
				}
			}
		}
	},
	"name": "Technology"
};

const inputHvcGroup = {
	"hvcs": { "target": 165000000 },
	"wins": {
		"export": {
			"hvc": {
				"number": {
					"unconfirmed": 49,
					"confirmed": 21,
					"total": 70
				},
				"value": {
					"unconfirmed": 4900000,
					"confirmed": 2100000,
					"total": 7000000
				}
			}
		}
	},
	"name": "Technology"
};


describe( 'Sector wins data data set', function(){

	describe( 'Sector team input', function(){

		it( 'Should return the correct structure', function(){

			const output = dataset.create( input );

			expect( output.hvcNonHvcValue.hvc ).toEqual( 34 );
			expect( output.hvcNonHvcValue.nonHvc ).toEqual( 66 );

			expect( output.confirmedUnconfirmedValue.confirmed ).toEqual( 36 );
			expect( output.confirmedUnconfirmedValue.unconfirmed ).toEqual( 64 );

		} );
	} );

	describe( 'Hvc Group input', function(){

		it( 'Should return the correct structure', function(){

			const output = dataset.create( inputHvcGroup );

			expect( output.hvcNonHvcValue ).not.toBeDefined();

			expect( output.confirmedUnconfirmedValue.confirmed ).toEqual( 30 );
			expect( output.confirmedUnconfirmedValue.unconfirmed ).toEqual( 70 );

		} );
	} );

	describe( 'Zero values', function(){

		it( 'Should return values', function(){

			const zeroHvcGroup = getBackendStub( '/hvc_groups/group_zero-values' );
			const output = dataset.create( zeroHvcGroup.results );

			expect( output.confirmedUnconfirmedValue.confirmed ).toEqual( 0 );
			expect( output.confirmedUnconfirmedValue.unconfirmed ).toEqual( 0 );
		} );
	} );

	describe( 'Using a stub', function(){

		it( 'Shoud not throw an error', function(){

			function createDatSet(){

				const stub = getBackendStub( '/sector_teams/sector_team' );
				dataset.create( stub.results );
			}

			expect( createDatSet ).not.toThrow();
		} );
	} );
} );
