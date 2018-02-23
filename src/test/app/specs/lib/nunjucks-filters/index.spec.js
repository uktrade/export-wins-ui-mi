const proxyquire = require( 'proxyquire' );

describe( 'Nunjucks filters', function(){

	let nunjucksFilters;
	let largeNumber;
	let pluralise;
	let piePercentage;
	let tablePercentage;
	let dateOnly;
	let dateWithTime;
	let dateStamp;
	let timeOnly;
	let preciseNumber;

	beforeEach( function(){

		largeNumber = jasmine.createSpy( 'largeNumber' );
		pluralise = jasmine.createSpy( 'pluralise' );
		piePercentage = jasmine.createSpy( 'piePercentage' );
		tablePercentage = jasmine.createSpy( 'tablePercentage' );
		dateOnly = jasmine.createSpy( 'dateOnly' );
		dateWithTime = jasmine.createSpy( 'dateWithTime' );
		dateStamp = jasmine.createSpy( 'dateStamp' );
		timeOnly = jasmine.createSpy( 'timeOnly' );
		preciseNumber = jasmine.createSpy( 'preciseNumber' );

		nunjucksFilters = proxyquire( '../../../../../app/lib/nunjucks-filters', {
			'./large-number': largeNumber,
			'./pluralise': pluralise,
			'./pie-percentage': piePercentage,
			'./table-percentage': tablePercentage,
			'./date-only': dateOnly,
			'./date-with-time': dateWithTime,
			'./date-stamp': dateStamp,
			'./time-only': timeOnly,
			'./precise-number': preciseNumber
		} );
	} );

	it( 'Should add all the filters', function(){

		const addFilter = jasmine.createSpy( 'addFilter' );

		nunjucksFilters( { addFilter } );

		let args = addFilter.calls.argsFor( 0 );

		expect( args[ 0 ] ).toEqual( 'largeNumber' );
		expect( args[ 1 ] ).toEqual( largeNumber );

		args = addFilter.calls.argsFor( 1 );

		expect( args[ 0 ] ).toEqual( 'pluralise' );
		expect( args[ 1 ] ).toEqual( pluralise );

		args = addFilter.calls.argsFor( 2 );

		expect( args[ 0 ] ).toEqual( 'piePercentage' );
		expect( args[ 1 ] ).toEqual( piePercentage );

		args = addFilter.calls.argsFor( 3 );

		expect( args[ 0 ] ).toEqual( 'tablePercentage' );
		expect( args[ 1 ] ).toEqual( tablePercentage );

		args = addFilter.calls.argsFor( 4 );

		expect( args[ 0 ] ).toEqual( 'dateOnly' );
		expect( args[ 1 ] ).toEqual( dateOnly );

		args = addFilter.calls.argsFor( 5 );

		expect( args[ 0 ] ).toEqual( 'dateWithTime' );
		expect( args[ 1 ] ).toEqual( dateWithTime );

		args = addFilter.calls.argsFor( 6 );

		expect( args[ 0 ] ).toEqual( 'dateStamp' );
		expect( args[ 1 ] ).toEqual( dateStamp );

		args = addFilter.calls.argsFor( 7 );

		expect( args[ 0 ] ).toEqual( 'timeOnly' );
		expect( args[ 1 ] ).toEqual( timeOnly );

		args = addFilter.calls.argsFor( 8 );

		expect( args[ 0 ] ).toEqual( 'preciseNumber' );
		expect( args[ 1 ] ).toEqual( preciseNumber );
	} );
} );
