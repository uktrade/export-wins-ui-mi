const proxyquire = require( 'proxyquire' );

const filePath = '../../../../../../../app/lib/service/service.backend/investment/';

describe( 'Investment backend service', function(){

	let investmentService;
	let fdiMock;

	beforeEach( function(){

		fdiMock = { fdiMock: true };

		investmentService = proxyquire( filePath, {
			'./fdi': fdiMock
		} );
	} );

	it( 'Should expose all investment services', function(){

		expect( investmentService.fdi ).toEqual( fdiMock );
	} );
} );
