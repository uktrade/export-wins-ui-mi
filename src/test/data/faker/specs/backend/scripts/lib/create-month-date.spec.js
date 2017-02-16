const createMonthDate = require( '../../../../../../../data/faker/backend/scripts/lib/create-month-date' );

describe( 'createMonthDate', function(){

	it( 'Should create the year and month from a date', function(){

		let date = new Date();
		let month = {
			date: date.toGMTString()
		};
		let month2 = {
			date: 'Wed May 25 2016 12:35:08 GMT+0100 (BST)'
		};

		createMonthDate( month );
		createMonthDate( month2 );

		expect( month.date ).toEqual( date.getFullYear() + '-' + ( date.getMonth() + 1 ) );
		expect( month2.date ).toEqual( '2016-5' );
	} );
} );
