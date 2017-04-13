const transform = require( '../../../../../app/lib/transformers/months' );
const getBackendStub = require( '../../../helpers/get-backend-stub' );

const input = getBackendStub( '/sector_teams/months' );
const hvcGroupInput = getBackendStub( '/hvc_groups/months' );
const inputOverTarget = getBackendStub( '/sector_teams/months_over-target' );
const input20161212 = getBackendStub( '/sector_teams/months' );


describe( 'Sector months transformer', function(){

	function checkOutput( input, target = ( ( input.results.hvcs.target / 1e+6 ) + 'm' ) ){

		const output = transform( input.results );

		expect( output.target ).toEqual( input.results.hvcs.target );
		expect( output.targetName ).toEqual( '£' + target );

		input.results.months.forEach( ( month, i ) => {

			const outputMonth = output.months[ i ];

			expect( outputMonth.date ).toEqual( month.date );
			expect( outputMonth.totals.hvc.confirmed ).toEqual( month.totals.export.hvc.value.confirmed );
			expect( outputMonth.totals.hvc.unconfirmed ).toEqual( month.totals.export.hvc.value.unconfirmed );
			expect( outputMonth.totals.nonHvc.confirmed ).toEqual( month.totals.export.non_hvc.value.confirmed );
			expect( outputMonth.totals.nonHvc.unconfirmed ).toEqual( month.totals.export.non_hvc.value.unconfirmed );
			expect( outputMonth.totals.nonExport.confirmed ).toEqual( month.totals.non_export.value.confirmed );
			expect( outputMonth.totals.nonExport.unconfirmed ).toEqual( month.totals.non_export.value.unconfirmed );
		} );
	}

	function checkGroupOutput( input, target ){

		const output = transform( input.results );

		expect( output.target ).toEqual( input.results.hvcs.target );
		expect( output.targetName ).toEqual( '£' + target );

		input.results.months.forEach( ( month, i ) => {

			const outputMonth = output.months[ i ];

			expect( outputMonth.date ).toEqual( month.date );
			expect( outputMonth.totals.hvc.confirmed ).toEqual( month.totals.export.hvc.value.confirmed );
			expect( outputMonth.totals.hvc.unconfirmed ).toEqual( month.totals.export.hvc.value.unconfirmed );
			expect( outputMonth.totals.nonHvc ).not.toBeDefined();
			expect( outputMonth.totals.nonExport.confirmed ).toEqual( month.totals.non_export.value.confirmed );
			expect( outputMonth.totals.nonExport.unconfirmed ).toEqual( month.totals.non_export.value.unconfirmed );
		} );
	}

	describe( 'With a sector team', function(){

		it( 'Should return the correct format', function(){

			checkOutput( input );
		} );

		it( 'Should return the correct format when over target', function(){

			checkOutput( inputOverTarget );
		} );

		it( 'Should return the correct format for 2016-12-12', function(){

			checkOutput( input20161212 );
		} );
	} );

	describe( 'With a HVC Group', function(){

		it( 'Should return the correct format - without non-hvc', function(){

			checkGroupOutput( hvcGroupInput, '0.04m' );
		} );
	} );

} );
