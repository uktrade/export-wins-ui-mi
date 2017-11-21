module.exports = function( path ){

	if( path.charAt( 0 ) === '/' && path.charAt( 1 ) !== '/' ){

		return path;

	} else {

		return '/';
	}
};
