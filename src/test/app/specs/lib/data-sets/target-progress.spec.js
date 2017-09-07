const dataset = require( '../../../../../app/lib/data-sets/target-progress' );

describe( 'Target progress data set', function(){

	describe( 'When the number is below the target', function(){

		it( 'Should return the progress as a number', function(){

			const output = dataset.create( 150000000, 100000000, 45000000 );

			expect( output.confirmed ).toEqual( { capped: 67, percent: 67, over: false } );
			expect( output.unconfirmed ).toEqual( { capped: 97, percent:97, over: false } );
			expect( output.over ).toEqual( false );
			expect( output.overModifyer ).toEqual( null );

			const output2 = dataset.create( 100, 50, 20 );

			expect( output2.confirmed ).toEqual( { capped: 50, percent: 50, over: false } );
			expect( output2.unconfirmed ).toEqual( { capped: 70, percent:70, over: false } );
			expect( output2.over ).toEqual( false );
			expect( output2.overModifyer ).toEqual( null );

			const output3 = dataset.create( 1000, 250, 100 );

			expect( output3.confirmed ).toEqual( { capped: 25, percent: 25, over: false } );
			expect( output3.unconfirmed ).toEqual( { capped: 35, percent:35, over: false } );
			expect( output3.over ).toEqual( false );
			expect( output3.overModifyer ).toEqual( null );
		} );
	} );

	describe( 'When the number is above the target', function(){

		it( 'Should return 100 percent for capped', function(){

			const output4 = dataset.create( 60, 21, 40 );

			expect( output4.confirmed ).toEqual( { capped: 35, percent: 35, over: false } );
			expect( output4.unconfirmed ).toEqual( { capped: 100, percent:102, over: true } );
			expect( output4.over ).toEqual( true );
			expect( output4.overModifyer ).toEqual( 'unconfirmed' );

			const output5 = dataset.create( 600, 800, 100 );

			expect( output5.confirmed ).toEqual( { capped: 100, percent: 133, over: true }  );
			expect( output5.unconfirmed ).toEqual( { capped: 100, percent: 150, over: true } );
			expect( output5.over ).toEqual( true );
			expect( output5.overModifyer ).toEqual( 'confirmed' );
		} );
	} );

	describe( 'When the target is zero', function(){

		describe( 'When the number is over target', function(){

			it( 'Should return all zeros', function(){

				const output6 = dataset.create( 0, 100, 20 );

				expect( output6.confirmed ).toEqual( { capped: 0, percent: 0, over: false } );
				expect( output6.unconfirmed ).toEqual( { capped: 0, percent: 0, over: false } );
				expect( output6.over ).toEqual( false );
				expect( output6.overModifyer ).toEqual( null );
			} );
		} );
	} );
} );
