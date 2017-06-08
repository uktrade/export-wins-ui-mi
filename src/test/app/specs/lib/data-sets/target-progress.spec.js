const dataset = require( '../../../../../app/lib/data-sets/target-progress' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = {
	"hvcs": { "target": 150000000 },
	"wins": {
		"export": {
			"hvc": {
				"number": {
					"confirmed": 100000000,
					"unconfirmed": 50000000,
					"total": 70
				},
				"value": {
					"confirmed": 100000000,
					"unconfirmed": 45000000,
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
					"confirmed": 50,
					"unconfirmed": 20
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
					"confirmed": 250,
					"unconfirmed": 100
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
					"confirmed": 21,
					"unconfirmed": 40
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
					"confirmed": 800,
					"unconfirmed": 100
				}
			}
		}
	}
};

describe( 'Target progress data set', function(){

	describe( 'When the number is below the target', function(){

		it( 'Should return the progress as a number', function(){

			const output = dataset.create( input );

			expect( output ).toEqual( { confirmed: 66.67, unconfirmed: 96.67, over: false, overModifyer: null } );

			const output2 = dataset.create( input2 );

			expect( output2 ).toEqual( { confirmed: 50, unconfirmed: 70, over: false, overModifyer: null } );

			const output3 = dataset.create( input3 );

			expect( output3 ).toEqual( { confirmed: 25, unconfirmed: 35, over: false, overModifyer: null } );
		} );
	} );

	describe( 'When the number is above the target', function(){

		it( 'Should return 100 percent', function(){

			const output4 = dataset.create( input4 );

			expect( output4 ).toEqual( { confirmed: 35, unconfirmed: 100, over: true, overModifyer: 'unconfirmed' } );

			const output5 = dataset.create( input5 );

			expect( output5 ).toEqual( { confirmed: 100, unconfirmed: 100, over: true, overModifyer: 'confirmed' } );
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
