function createPromise( mockPath ){

	return function(){

		return new Promise( ( resolve/*, reject */ ) => {

			resolve( require( mockPath ) );
		} );
	};
}

module.exports = {
	win: createPromise( './win' ),
	hvc: createPromise( './hvc' ),
	winList: createPromise( '../fake-stubs/mocks/hvc-table' )
};
