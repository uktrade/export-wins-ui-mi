const dataset = require( '../../../../../app/lib/data-sets/target-progress' );

describe( 'Target progress data set', function(){

	describe( 'When the number is below the target', function(){

		it( 'Should return the progress as a number', function(){

			const output = dataset.create( 150000000, 100000000, 45000000 );

			expect( output ).toEqual( { confirmed: 66.67, unconfirmed: 96.67, over: false, overModifyer: null } );

			const output2 = dataset.create( 100, 50, 20 );

			expect( output2 ).toEqual( { confirmed: 50, unconfirmed: 70, over: false, overModifyer: null } );

			const output3 = dataset.create( 1000, 250, 100 );

			expect( output3 ).toEqual( { confirmed: 25, unconfirmed: 35, over: false, overModifyer: null } );
		} );
	} );

	describe( 'When the number is above the target', function(){

		it( 'Should return 100 percent', function(){

			const output4 = dataset.create( 60, 21, 40 );

			expect( output4 ).toEqual( { confirmed: 35, unconfirmed: 100, over: true, overModifyer: 'unconfirmed' } );

			const output5 = dataset.create( 600, 800, 100 );

			expect( output5 ).toEqual( { confirmed: 100, unconfirmed: 100, over: true, overModifyer: 'confirmed' } );
		} );
	} );

	describe( 'When the target is zero', function(){

		describe( 'When the number is over target', function(){

			it( 'Should return all zeros', function(){

				const output6 = dataset.create( 0, 100, 20 );

				expect( output6 ).toEqual( { confirmed: 0, unconfirmed: 0, over: false, overModifyer: null } );
			} );
		} );
	} );
} );
