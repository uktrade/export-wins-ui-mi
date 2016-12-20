
var mock = require( '../../../mocks/sector-performance' );

describe( 'Sector performance mock', function(){

	it( 'Should have 12 months', function(){
	
		expect( mock.months.length ).toEqual( 12 );
	} );

	it( 'Should have an hvc, nonHvc and nonExport value for each month', function(){
	
		mock.months.forEach( ( month ) => {
			expect( month.totals.hvc ).toBeDefined();
			expect( month.totals.nonHvc ).toBeDefined();
			expect( month.totals.nonExport ).toBeDefined();
		} );

		//console.log( JSON.stringify( mock, null, 4 ) );
	} );
} );
