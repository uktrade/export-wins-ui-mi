const proxyquire = require( 'proxyquire' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );

const modulePath = '../../../../../../app/sub-apps/investment/view-models/fdi-performance-region-progress';

let performanceRegionProgress;

describe( 'FDI Performance Region Progress View Model', function(){

	beforeEach( function(){

		performanceRegionProgress = proxyquire( modulePath, {} );
	} );

	describe( 'With a full response', function(){

		let input;
		let output;

		describe( 'With all zeros', function(){

			beforeEach( function(){

				//get stub each time
				input = getBackendStub( '/investment/fdi/performance/sectors.zero' ).results;
				output = performanceRegionProgress.create( input.slice( 0 ) );
			} );

			it( 'Should convert the response to the correct format', function(){

				output.forEach( ( item, index ) => {

					const inputItem = input[ index ];

					expect( item.id ).toEqual( inputItem.id );
					expect( item.name ).toEqual( inputItem.name );
					expect( item.wins.won ).toEqual( inputItem.wins.won.count );
					expect( item.wins.verified ).toEqual( inputItem.wins.verify_win.count );
					expect( item.jobs ).toEqual( inputItem.jobs );
				} );
			} );
		} );

		describe( 'With properties on the array', function(){

			it( 'Should pass back the original array', function(){

				input = getBackendStub( '/investment/fdi/performance/sectors.zero' ).results;

				input.someProperty = 'test';
				input.someObject = { myTest: true };

				output = performanceRegionProgress.create( input );

				expect( output.someProperty ).toEqual( input.someProperty );
				expect( output.someObject ).toEqual( input.someObject );
			} );
		} );

		describe( 'With numbers', function(){

			beforeEach( function(){

				//get stub each time
				input = getBackendStub( '/investment/fdi/performance/uk_regions' ).results;
				output = performanceRegionProgress.create( input.slice( 0 ) );
			} );

			it( 'Should convert the response to the correct format', function(){

				output.forEach( ( item, index ) => {

					const inputItem = input[ index ];

					expect( item.id ).toEqual( inputItem.id );
					expect( item.name ).toEqual( inputItem.name );
					expect( item.wins.won ).toEqual( inputItem.wins.won.count );
					expect( item.wins.verified ).toEqual( inputItem.wins.verify_win.count );
					expect( item.jobs ).toEqual( inputItem.jobs );
				} );
			} );
		} );
	} );

	describe( 'With no results', function(){

		it( 'Should return the input', function(){

			expect( performanceRegionProgress.create( null ) ).toEqual( null );
		} );
	} );
} );
