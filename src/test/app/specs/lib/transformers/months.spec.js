const transform = require( '../../../../../app/lib/transformers/months' );
const input = require( '../../../../../stubs/backend/sector_teams/months' );
const parentSectorInput = require( '../../../../../stubs/backend/parent_sector_months' );
const inputOverTarget = require( '../../../../../stubs/backend/sector_teams/months-over-target' );
const input20161212 = require( '../../../../../stubs/backend/sector_teams/months_2016-12-12' );


describe( 'Sector months transformer', function(){

	function checkOutput( input, max, target = ( ( input.hvcs.target / 1e+6 ) + 'm' ) ){

		const output = transform( input );

		//expect( output.max ).toEqual( max );
		//expect( output.min ).toEqual( 0 );
		expect( output.target ).toEqual( input.hvcs.target );
		expect( output.targetName ).toEqual( '£' + target );

		input.months.forEach( ( month, i ) => {

			const outputMonth = output.months[ i ];

			expect( outputMonth.date ).toEqual( month.date );
			expect( outputMonth.totals.hvc.confirmed ).toEqual( month.totals.hvc.value.confirmed );
			expect( outputMonth.totals.hvc.unconfirmed ).toEqual( month.totals.hvc.value.total );
			expect( outputMonth.totals.nonHvc.confirmed ).toEqual( month.totals.non_hvc.value.confirmed );
			expect( outputMonth.totals.nonHvc.unconfirmed ).toEqual( month.totals.non_hvc.value.total );
			expect( outputMonth.totals.nonExport.confirmed ).toEqual( month.totals.non_export.value.confirmed );
			expect( outputMonth.totals.nonExport.unconfirmed ).toEqual( month.totals.non_export.value.total );
		} );
	}

	describe( 'With a sector team', function(){
	
		it( 'Should return the correct format', function(){

			checkOutput( input, 92882566 );
		} );

		it( 'Should return the correct format when over target', function(){

			checkOutput( inputOverTarget, 504321098 );
		} );

		it( 'Should return the correct format for 2016-12-12', function(){

			checkOutput( input20161212, 501286154 );
		} );
	} );

	describe( 'With a parent sector', function(){

		it( 'Should return the correct format', function(){
		
			checkOutput( parentSectorInput, 100, '2.66b' );
		} );
	} );
} );
