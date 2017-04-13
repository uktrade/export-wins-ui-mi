const dataset = require( '../../../../../app/lib/data-sets/target-progress' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = {
	"hvcs": { "target": 165000000 },
	"wins": {
		"export": {
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
			}
		}
	}
};

const input2 = {
	"hvcs": { "target": 100 },
	"wins": {
		"export": {
			"hvc": {
				"value": {
					"confirmed": 50
				}
			}
		}
	}
};

const input3 = {
	"hvcs": { "target": 1000 },
	"wins": {
		"export": {
			"hvc": {
				"value": {
					"confirmed": 250
				}
			}
		}
	}
};

const input4 = {
	"hvcs": { "target": 60 },
	"wins": {
		"export": {
			"hvc": {
				"value": {
					"confirmed": 21
				}
			}
		}
	}
};

const input5 = {
	"hvcs": { "target": 600 },
	"wins": {
		"export": {
			"hvc": {
				"value": {
					"confirmed": 800
				}
			}
		}
	}
};

describe( 'Target progress data set', function(){

	describe( 'When the number is below the target', function(){

		it( 'Should return the progress as a number', function(){

			const output = dataset.create( input );

			expect( output ).toEqual( { percent: 1.27, gauge: 0.01 } );

			const output2 = dataset.create( input2 );

			expect( output2 ).toEqual( { percent: 50, gauge: 0.25 } );

			const output3 = dataset.create( input3 );

			expect( output3 ).toEqual( { percent: 25, gauge: 0.13 } );

			const output4 = dataset.create( input4 );

			expect( output4 ).toEqual( { percent: 35, gauge: 0.17 } );
		} );
	} );

	describe( 'When the number is above the target', function(){

		it( 'Should return 100 percent', function(){

			const output5 = dataset.create( input5 );

			expect( output5 ).toEqual( { percent: 100, gauge: 0.5 } );
		} );
	} );

	describe( 'With a stub file', function(){

		it( 'Does not throw an error', function(){

			function createDataSet(){

				const stub = getBackendStub( '/sector_teams/sector_team' );

				dataset.create( stub.results );
			}

			expect( createDataSet ).not.toThrow();
		} );
	} );
} );
