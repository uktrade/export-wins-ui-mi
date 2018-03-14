const proxyquire = require( 'proxyquire' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );

const modulePath = '../../../../../../app/sub-apps/investment/view-models/fdi-performance-win-progress';

let createScale;
let createScaleResponse;
let performanceWinProgress;

function item( count, start, percent ){

	return { count, start, percent };
}

describe( 'FDI Performance Win Progress View Model', function(){

	beforeEach( function(){

		createScaleResponse = [ 0, 500 ];
		createScale = jasmine.createSpy( 'create-scale' ).and.callFake( () => createScaleResponse );

		performanceWinProgress = proxyquire( modulePath, {
			'../../../lib/graphs/create-scale': createScale
		} );
	} );

	describe( 'With a full response', function(){

		let input;
		let output;

		beforeEach( function(){

			//get stub each time
			input = getBackendStub( '/investment/fdi/performance/sectors' ).results;
			output = performanceWinProgress.create( input );
		} );

		describe( 'Headlines', function(){

			it( 'Should convert the response to the correct format', function(){

				const values = [
					{
						won: item( 20, 0, 4 ),
						verifyWin: item( 20, 4, 4 ),
						pipeline: item( 200, 8, 40 ),
						target: item( 100, 0, 20 )
					},{
						won: item( 50, 0, 10 ),
						verifyWin: item( 50, 10, 10 ),
						pipeline: item( 300, 20, 60 ),
						target: item( 200, 0, 40 )
					},{
						won: item( 25, 0, 5 ),
						verifyWin: item( 25, 5, 5 ),
						pipeline: item( 200, 10, 40 ),
						target: item( 100, 0, 20 )
					},{
						won: item( 62, 0, 12.4 ),
						verifyWin: item( 61, 12.4, 12.2 ),
						pipeline: item( 100, 24.6, 20 ),
						target: item( 500, 0, 100 )
					},{
						won: item( 10, 0, 2 ),
						verifyWin: item( 10, 2, 2 ),
						pipeline: item( 50, 4, 10 ),
						target: item( 100, 0, 20 )
					}
				];

				output.forEach( ( item, index ) => {

					const inputItem = input[ index ];

					expect( item.id ).toEqual( inputItem.id );
					expect( item.name ).toEqual( inputItem.name );
					expect( item.wins.total ).toEqual( inputItem.wins.total );
					expect( item.wins.hvc ).toEqual( inputItem.wins.hvc.count );
					expect( item.segments ).toEqual( values[ index ] );
				} );

				expect( createScale ).toHaveBeenCalledWith( 500, 4, [ 0, 0.2 ] );
				expect( output.scale ).toEqual( createScaleResponse );
			} );
		} );
	} );

	describe( 'With no results', function(){

		it( 'Should return the input', function(){

			expect( performanceWinProgress.create( null ) ).toEqual( null );
			expect( createScale ).not.toHaveBeenCalled();
		} );
	} );
} );
