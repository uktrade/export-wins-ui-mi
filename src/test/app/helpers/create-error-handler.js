module.exports = function createFail( done ){

	return function(){

		return function( e ){

			console.log( e );
			done.fail( 'Should not error' );
		};
	};
};
