const transform = require( '../../../../../app/lib/transformers/months-volume' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = getBackendStub( '/uk_regions/months' );
const inputZeroValues = getBackendStub( '/uk_regions/months.zero' );

describe( 'Months transformer for volume', function(){

	function checkOutput( input, target = input.results.export_experience.target.total ){

		const output = transform( input.results );

		expect( output.target ).toEqual( target );
		expect( output.targetName ).toEqual( target );

		input.results.months.forEach( ( month, i ) => {

			const outputMonth = output.months[ i ];

			expect( outputMonth.date ).toEqual( month.date );
			expect( outputMonth.totals.hvc.confirmed ).toEqual( month.totals.export.hvc.number.confirmed );
			expect( outputMonth.totals.hvc.unconfirmed ).toEqual( month.totals.export.hvc.number.unconfirmed );
			expect( outputMonth.totals.nonHvc.confirmed ).toEqual( month.totals.export.non_hvc.number.confirmed );
			expect( outputMonth.totals.nonHvc.unconfirmed ).toEqual( month.totals.export.non_hvc.number.unconfirmed );
			expect( outputMonth.totals.nonExport.confirmed ).toEqual( month.totals.non_export.number.confirmed );
			expect( outputMonth.totals.nonExport.unconfirmed ).toEqual( month.totals.non_export.number.unconfirmed );
		} );
	}

	describe( 'With a UK Region', function(){

		it( 'Should return the correct format', function(){

			checkOutput( input );
		} );

	} );

	describe( 'With zero values', function(){

		it( 'Should return all zeros', function(){

			checkOutput( inputZeroValues, 0 );
		} );
	} );
} );
