const performanceHeadlines = require( '../../../../../../app/sub-apps/investment/view-models/fdi-performance-headlines' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );


describe( 'FDI Performance Headlines View Model', function(){

	describe( 'With a full response', function(){

		let input;
		let output;

		beforeEach( function(){

			//get stub each time
			input = getBackendStub( '/investment/fdi/performance' ).results;
			output = performanceHeadlines.create( input );
		} );

		describe( 'Headlines', function(){

			it( 'Should convert the response to the correct format', function(){

				const headlines = output;

				expect( headlines ).toBeDefined();
				expect( headlines.wins.total ).toEqual( input.wins.count );
				expect( headlines.wins.percentage.high ).toEqual( Math.round( input.wins.performance.high.percent ) );
				expect( headlines.wins.percentage.good ).toEqual( Math.round( input.wins.performance.good.percent ) );
				expect( headlines.wins.percentage.standard ).toEqual( Math.round( input.wins.performance.standard.percent ) );

				expect( headlines.breakdown.type.hvc ).toEqual( input.wins.campaign.hvc );
				expect( headlines.breakdown.type.nonHvc ).toEqual( input.wins.campaign.non_hvc );

				expect( headlines.breakdown.stage.verify ).toEqual( input.wins.stages.verify_win );
				expect( headlines.breakdown.stage.won ).toEqual( input.wins.stages.won );

				expect( headlines.jobs ).toEqual( input.wins.jobs );
				expect( headlines.pipeline.total ).toEqual( input.pipeline.active.count );
				expect( headlines.pipeline.percentage.high ).toEqual( Math.round( input.pipeline.active.performance.high.percent ) );
				expect( headlines.pipeline.percentage.good ).toEqual( Math.round( input.pipeline.active.performance.good.percent ) );
				expect( headlines.pipeline.percentage.standard ).toEqual( Math.round( input.pipeline.active.performance.standard.percent ) );
			} );
		} );
	} );

	describe( 'With no results', function(){

		it( 'Should return the input', function(){

			expect( performanceHeadlines.create( null ) ).toEqual( null );
		} );
	} );
} );
