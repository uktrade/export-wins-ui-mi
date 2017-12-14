
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
			},
			"totals": {
				"value": {
					"unconfirmed": 10800000,
					"confirmed": 6200000,
					"grand_total": 17000000
				},
				"number": {
					"unconfirmed": 108,
					"confirmed": 62,
					"grand_total": 170
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

const inputZeros = {
	"hvcs": { "target": 0 },
	"wins": {
		"export": {
			"hvc": {
				"number": {
					"unconfirmed": 0,
					"confirmed": 0,
					"total": 0
				},
				"value": {
					"unconfirmed": 0,
					"confirmed": 0,
					"total": 0
				}
			},
			"non_hvc": {
				"number": {
					"unconfirmed": 0,
					"confirmed": 0,
					"total": 0
				},
				"value": {
					"unconfirmed": 0,
					"confirmed": 0,
					"total": 0
				}
			},
			"totals": {
				"value": {
					"unconfirmed": 0,
					"confirmed": 0,
					"grand_total": 0
				},
				"number": {
					"unconfirmed": 0,
					"confirmed": 0,
					"grand_total": 0
				}
			}
		}
	},
	"name": "Technology"
};


describe( 'Sector Pie Charts data set', function(){

	describe( 'createConfirmedUnconfirmedPercentages', function(){

		describe( 'When the unconfirmed is tiny compared to the confirmed', function(){

			it( 'Should return more than zero for the unconfirmed', function(){

				const output = dataset.createConfirmedUnconfirmedPercentages( 36245000, 36200000, 45000 );

				expect( output.confirmed ).toEqual( 99.9 );
				expect( output.unconfirmed ).toEqual( 0.1 );
			} );
		} );
	} );

	describe( 'Create (for value)', function(){

		describe( 'Sector team input', function(){

			it( 'Should return the correct structure', function(){

				const output = dataset.create( input );

				expect( output.hvcNonHvcValue.hvc ).toEqual( 33.9 );
				expect( output.hvcNonHvcValue.nonHvc ).toEqual( 66.1 );

				expect( output.confirmedUnconfirmedValue.confirmed ).toEqual( 36.5 );
				expect( output.confirmedUnconfirmedValue.unconfirmed ).toEqual( 63.5 );
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

		describe( 'All zeros data', function(){

			it( 'Should return all zeros', function(){

				const data = dataset.create( inputZeros );

				expect( data.hvcNonHvcValue.hvc ).toEqual( 0 );
				expect( data.hvcNonHvcValue.nonHvc ).toEqual( 0 );
				expect( data.confirmedUnconfirmedValue.confirmed ).toEqual( 0 );
				expect( data.confirmedUnconfirmedValue.unconfirmed ).toEqual( 0 );
			} );
		} );
	} );

	describe( 'createForNumber (volume)', function(){

		describe( 'Sector team input', function(){

			it( 'Should return the correct structure', function(){

				const output = dataset.createForNumber( input );

				expect( output.hvcNonHvcValue.hvc ).toEqual( 33.9 );
				expect( output.hvcNonHvcValue.nonHvc ).toEqual( 66.1 );

				expect( output.confirmedUnconfirmedValue.confirmed ).toEqual( 36.5 );
				expect( output.confirmedUnconfirmedValue.unconfirmed ).toEqual( 63.5 );
			} );
		} );

		describe( 'Hvc Group input', function(){

			it( 'Should return the correct structure', function(){

				const output = dataset.createForNumber( inputHvcGroup );

				expect( output.hvcNonHvcValue ).not.toBeDefined();

				expect( output.confirmedUnconfirmedValue.confirmed ).toEqual( 30 );
				expect( output.confirmedUnconfirmedValue.unconfirmed ).toEqual( 70 );
			} );
		} );

		describe( 'Zero values', function(){

			it( 'Should return values', function(){

				const zeroHvcGroup = getBackendStub( '/hvc_groups/group_zero-values' );
				const output = dataset.createForNumber( zeroHvcGroup.results );

				expect( output.confirmedUnconfirmedValue.confirmed ).toEqual( 0 );
				expect( output.confirmedUnconfirmedValue.unconfirmed ).toEqual( 0 );
			} );
		} );

		describe( 'Using a stub', function(){

			it( 'Shoud not throw an error', function(){

				function createDatSet(){

					const stub = getBackendStub( '/sector_teams/sector_team' );
					dataset.createForNumber( stub.results );
				}

				expect( createDatSet ).not.toThrow();
			} );
		} );

		describe( 'All zeros data', function(){

			it( 'Should return all zeros', function(){

				const data = dataset.createForNumber( inputZeros );

				expect( data.hvcNonHvcValue.hvc ).toEqual( 0 );
				expect( data.hvcNonHvcValue.nonHvc ).toEqual( 0 );
				expect( data.confirmedUnconfirmedValue.confirmed ).toEqual( 0 );
				expect( data.confirmedUnconfirmedValue.unconfirmed ).toEqual( 0 );
			} );
		} );
	} );
} );

