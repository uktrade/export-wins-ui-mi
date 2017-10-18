const transform = require( '../../../../../../app/lib/transformers/fdi/overview' );
const getBackendStub = require( '../../../../helpers/get-backend-stub' );

const input = getBackendStub( '/investment/fdi/overview' );
const inputNoPerformance = getBackendStub( '/investment/fdi/overview_no-performance' );

describe( 'FDI Overview Transformer', function(){

	let output;


	describe( 'With a full response', function(){

		beforeEach( function(){

			output = transform( input.results );
		} );

		it( 'Should transform the response to the correct format', function(){

			const results = input.results;

			expect( output.target ).toEqual( results.target );

			expect( output.totals.verified ).toEqual( results.total.verified.count );
			expect( output.totals.pending ).toEqual( results.total.pending.count );
			expect( output.totals.metPercent ).toEqual( results.verified_met_percent );

			expect( output.jobs.new.verified ).toEqual( results.total.verified.number_new_jobs__sum );
			expect( output.jobs.new.pending ).toEqual( results.total.pending.number_new_jobs__sum );

			expect( output.jobs.safe.verified ).toEqual( results.total.verified.number_safeguarded_jobs__sum );
			expect( output.jobs.safe.pending ).toEqual( results.total.pending.number_safeguarded_jobs__sum );

			expect( output.value.verified ).toEqual( results.total.verified.investment_value__sum );
			expect( output.value.pending ).toEqual( results.total.pending.investment_value__sum );

			expect( output.verified.high.number ).toEqual( results.performance.verified.high.count );
			expect( output.verified.high.percent ).toEqual( results.performance.verified.high.value__percent );
			expect( output.verified.good.number ).toEqual( results.performance.verified.good.count );
			expect( output.verified.good.percent ).toEqual( results.performance.verified.good.value__percent );
			expect( output.verified.standard.number ).toEqual( results.performance.verified.standard.count );
			expect( output.verified.standard.percent ).toEqual( results.performance.verified.standard.value__percent );
		} );
	} );

	describe( 'Missing performance data', function(){

		beforeEach( function(){

			output = transform( inputNoPerformance.results );
		} );

		it( 'Should transform the response to the correct format with 0s', function(){

			const results = inputNoPerformance.results;

			expect( output.target ).toEqual( results.target );

			expect( output.totals.verified ).toEqual( results.total.verified.count );
			expect( output.totals.pending ).toEqual( results.total.pending.count );
			expect( output.totals.metPercent ).toEqual( results.verified_met_percent );

			expect( output.jobs.new.verified ).toEqual( results.total.verified.number_new_jobs__sum );
			expect( output.jobs.new.pending ).toEqual( results.total.pending.number_new_jobs__sum );

			expect( output.jobs.safe.verified ).toEqual( results.total.verified.number_safeguarded_jobs__sum );
			expect( output.jobs.safe.pending ).toEqual( results.total.pending.number_safeguarded_jobs__sum );

			expect( output.value.verified ).toEqual( results.total.verified.investment_value__sum );
			expect( output.value.pending ).toEqual( results.total.pending.investment_value__sum );

			expect( output.verified.high.number ).toEqual( 0 );
			expect( output.verified.high.percent ).toEqual( 0 );
			expect( output.verified.good.number ).toEqual( 0 );
			expect( output.verified.good.percent ).toEqual( 0 );
			expect( output.verified.standard.number ).toEqual( 0 );
			expect( output.verified.standard.percent ).toEqual( 0 );
		} );
	} );
} );
