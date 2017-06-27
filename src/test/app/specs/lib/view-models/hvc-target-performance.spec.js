const dataset = require( '../../../../../app/lib/view-models/hvc-target-performance' );

const date_range = {
	start: 5000,
	end: 10000
};

const input = [
	{
		campaign: 'test',
		target: 100,
		change: 'up',
		progress: {
			confirmed: 125,
			unconfirmed: 0
		},
		value: {
			confirmed: 100,
			total: 100
		}
	},
	{
		campaign: 'test',
		target: 100,
		change: 'up',
		progress: {
			confirmed: 80,
			unconfirmed: 20
		},
		value: {
			confirmed: 100,
			total: 100
		}
	},
	{
		campaign: 'test',
		target: 100,
		change: 'up',
		progress: {
			confirmed: 80,
			unconfirmed: 35
		},
		value: {
			confirmed: 100,
			total: 100
		}
	},
	{
		campaign: 'test',
		target: 100,
		change: 'up',
		progress: {
			confirmed: 145,
			unconfirmed: 20
		},
		value: {
			confirmed: 100,
			total: 100
		}
	},
	{
		campaign: 'test',
		target: 100,
		change: 'up',
		progress: {
			confirmed: 25,
			unconfirmed: 135
		},
		value: {
			confirmed: 100,
			total: 100
		}
	},
	{
		campaign: 'test',
		target: 100,
		change: 'up',
		progress: {
			confirmed: 95,
			unconfirmed: 85
		},
		value: {
			confirmed: 100,
			total: 100
		}
	},
	{
		campaign: 'test',
		target: 100,
		change: 'up',
		progress: {
			confirmed: 85,
			unconfirmed: 95
		},
		value: {
			confirmed: 100,
			total: 100
		}
	},
	{
		campaign: 'high unconfirmed',
		target: 87000000,
		change: 'up',
		progress: {
			confirmed: 37,
			unconfirmed: 2134
		},
		value: {
			confirmed: 100,
			total: 100
		}
	},
	{
		campaign: 'high unconfirmed zero confirmed',
		target: 87000000,
		change: 'up',
		progress: {
			confirmed: 0,
			unconfirmed: 2134
		},
		value: {
			confirmed: 100,
			total: 100
		}
	},
	{
		campaign: 'zero target',
		target: 0,
		change: 'up',
		progress: {
			confirmed: 0,
			unconfirmed: 150
		},
		value: {
			confirmed: 100,
			total: 100
		}
	}
];

describe( 'HVC target performance data set', function(){

	const output = dataset.create( { date_range, results: input } );

	function checkResult( index, targetConfirmed, targetUnconfirmed, targetOver ){

		const inputData = input[ index ];
		const item = output.withTarget[ index ];

		expect( item.progress.confirmed ).toEqual( inputData.progress.confirmed );
		expect( item.progress.unconfirmed ).toEqual( inputData.progress.unconfirmed );
		expect( item.progress.target.confirmed ).toEqual( targetConfirmed );
		expect( item.progress.target.unconfirmed ).toEqual( targetUnconfirmed );
		expect( item.progress.target.overThreshold ).toEqual( targetOver );
	}

	describe( 'Without any data', function(){

		it( 'Should return empty arrays', function(){

			const out = dataset.create();

			expect( out.dateRange ).toBeDefined();
			expect( out.withTarget.length ).toEqual( 0 );
			expect( out.zeroTarget.length ).toEqual( 0 );
		} );
	} );

	describe( 'With data but without out any results', function(){

		it( 'Should user the date_range and return empty arrays', function(){

			const out = dataset.create( { date_range: {} } );

			expect( out.dateRange ).toBeDefined();
			expect( out.withTarget.length ).toEqual( 0 );
			expect( out.zeroTarget.length ).toEqual( 0 );
		} );
	} );

	describe( 'With data', function(){

		it( 'Should output the date range', function(){

			expect( output.dateRange ).toEqual( date_range );
		} );

		it( 'Should separate the data into two lists', function(){

			expect( output.withTarget.length ).toEqual( 9 );
			expect( output.zeroTarget.length ).toEqual( 1 );
		} );

		describe( 'HVCs with zero target', function(){

			it( 'Should return the correct format', function(){

				const zeroTarget = output.zeroTarget;

				expect( zeroTarget ).toBeDefined;
			} );
		} );

		describe( 'HVCs with a target', function(){

			describe( 'When the combined percentage is under the threshold', function(){

				it( 'Should return the numbers as a percentage of 125', function(){

					checkResult( 0, 100, 0, false );
					checkResult( 1, 64, 16, false );
					checkResult( 2, 64, 28, false );
				} );
			} );

			describe( 'When the confirmed percentage is over the threshold', function(){

				it( 'Should return 100 for confirmed and 0 for unconfirmed', function(){

					checkResult( 3, 100, 0, true );
				} );
			} );

			describe( 'When the unconfirmed percentage is over the threshold', function(){

				describe( 'When there is a confirmed percentage', function(){

					it( 'Should return a percentage for both as a percent of 125', function(){

						checkResult( 4, 20, 80, true );
					} );

					it( 'Should round the values', function(){

						checkResult( 7, 30, 70, true );
					} );
				} );

				describe( 'When there is zero for the confirmed percentage', function(){

					it( 'Should return zero for the confirmed and 100 for unconfirmed', function(){

						checkResult( 8, 0, 100, true );
					} );
				} );
			} );

			describe( 'When the combined percentage is over the threshold', function(){

				describe( 'When the confirmed is higher than the unconfirmed', function(){

					it( 'Should return the confirmed percent and cap the unconfirmed percent', function(){

						checkResult( 5, 76, 24, true );
					} );
				} );

				describe( 'When the unconfirmed is higher than the confirmed', function(){

					it( 'Should return the confirmed percent and cap the unconfirmed percent', function(){

						checkResult( 6, 68, 32, true );
					} );
				} );
			} );
		} );
	} );
} );
