const dataset = require( '../../../../../app/lib/data-sets/hvc-target-performance' );

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
	}
	,
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
	}
];

describe( 'HVC target performance data set', function(){

	const output = dataset.create( input );
	const item1 = output[ 0 ];
	const item2 = output[ 1 ];
	const item3 = output[ 2 ];
	const item4 = output[ 3 ];
	const item5 = output[ 4 ];
	const item6 = output[ 5 ];
	const item7 = output[ 6 ];

	describe( 'When the numbers are under the threshold', function(){
	
		it( 'Should return the numbers as a percentage of 125', function(){

			expect( item1.progress.confirmed ).toEqual( 100 );
			expect( item1.progress.unconfirmed ).toEqual( 0 );
			expect( item1.progress.overThreshold ).toEqual( false );

			expect( item2.progress.confirmed ).toEqual( 64 );
			expect( item2.progress.unconfirmed ).toEqual( 16 );
			expect( item2.progress.overThreshold ).toEqual( false );

			expect( item3.progress.confirmed ).toEqual( 64 );
			expect( item3.progress.unconfirmed ).toEqual( 28 );
			expect( item3.progress.overThreshold ).toEqual( false );
		} );
	} );

	describe( 'When the confirmed percentage is over the threshold', function(){
	
		it( 'Should return 100 for confirmed and 0 for unconfirmed', function(){
	
			expect( item4.progress.confirmed ).toEqual( 100 );
			expect( item4.progress.unconfirmed ).toEqual( 0 );
			expect( item4.progress.overThreshold ).toEqual( true );
		} );
	} );

	describe( 'When the unconfirmed percentage is over the threshold', function(){
	
		it( 'Should return 0 for confirmed and 100 for unconfirmed', function(){
		
			expect( item5.progress.confirmed ).toEqual( 0 );
			expect( item5.progress.unconfirmed ).toEqual( 100 );
			expect( item5.progress.overThreshold ).toEqual( true );
		} );
	} );

	describe( 'When the combined percentage is over the threshold', function(){

		describe( 'When the confirmed is higher than the unconfirmed', function(){
		
			it( 'Should return the confirmed percent and cap the unconfirmed percent', function(){
		
				expect( item6.progress.confirmed ).toEqual( 76 );
				expect( item6.progress.unconfirmed ).toEqual( 24 );
				expect( item6.progress.overThreshold ).toEqual( true );
			} );
		} );		

		describe( 'When the unconfirmed is higher than the confirmed', function(){
		
			it( 'Should return the confirmed percent and cap the unconfirmed percent', function(){
		
				expect( item7.progress.confirmed ).toEqual( 68 );
				expect( item7.progress.unconfirmed ).toEqual( 32 );
				expect( item7.progress.overThreshold ).toEqual( true );
			} );
		} );
	} );
} );
