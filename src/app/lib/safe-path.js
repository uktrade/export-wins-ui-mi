module.exports = function( path ){

	const hasCharAt = ( path && typeof path.charAt === 'function' );

	if( hasCharAt && path.charAt( 0 ) === '/' && path.charAt( 1 ) !== '/' ){

		return path;

	} else {

		return '/';
	}
};
