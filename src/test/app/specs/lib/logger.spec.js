const proxyquire = require( 'proxyquire' );

const originalEnv = process.env.NODE_ENV;
let consoleStub;
let loggerStub;
let logLevel;

function createLogger(){

	logLevel = 'debug';
	loggerStub = jasmine.createSpy( 'winston.Logger' ).and.callFake( () => function(){} );
	consoleStub = jasmine.createSpy( 'winston.transports.Console' ).and.callFake( () => function(){} );

	const stubs = {
		'winston': {
			Logger: loggerStub,
			transports: {
				Console: consoleStub
			}
		},
		'../config': {
			logLevel
		}
	};

	return proxyquire( '../../../../app/lib/logger', stubs );
}

describe( 'logger', function(){

	beforeEach( function(){

		process.env.NODE_ENV = '';
	} );

	afterEach( function(){

		process.env.NODE_ENV = originalEnv;
	} );

	it( 'Creates a logger with the correct log level', function(){

		createLogger();

		expect( loggerStub ).toHaveBeenCalled();
		expect( loggerStub.calls.argsFor( 0 )[ 0 ].level ).toEqual( logLevel );
	} );

	describe( 'In production', function(){

		it( 'Should set colorize to false', function(){

			process.env.NODE_ENV = 'production';
			createLogger();

			expect( consoleStub ).toHaveBeenCalledWith( { colorize: false } );
		} );
	} );

	describe( 'In development', function(){

		it( 'Should set colorize to true', function(){

			process.env.NODE_ENV = 'development';
			createLogger();

			expect( consoleStub ).toHaveBeenCalledWith( { colorize: true } );
		} );
	} );

	describe( 'When the NODE_ENV is not set', function(){

		it( 'Should set colorize to true', function(){

			createLogger();

			expect( consoleStub ).toHaveBeenCalledWith( { colorize: true } );
		} );
	} );
} );
