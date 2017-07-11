module.exports = function spy( name, response ){

	const spy = jasmine.createSpy( name );

	if( response ){
		spy.and.callFake( () => response );
	}

	return spy;
};
