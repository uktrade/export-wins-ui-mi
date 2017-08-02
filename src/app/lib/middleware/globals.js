const url = require( 'url' );

function getParams( obj ){

	const r = [];

	for( let key in obj ){

		r.push( key + '=' + obj[ key ] );
	}

	return r;
}

function singleArray( params, theseParams ){

	return [ ...params, ...theseParams ];
}

module.exports = function( env ){

	//this must be called after the year middleware as we don't want the year in the URL
	return function( req, res, next ){

		const basePrefix = '';
		let prefix = basePrefix;

		if( !req.isDefaultYear ){

			prefix += `/${ req.year }`;
		}

		env.addGlobal( 'urlPrefix', prefix );
		env.addGlobal( 'baseUrlPrefix', basePrefix );
		env.addGlobal( 'currentUrl', url.parse( req.url ).pathname );
		env.addGlobal( 'addParams', function( path, ...additionalParams ){

			const params = [
				...getParams( req.filters ),
				...additionalParams.map( getParams ).reduce( singleArray, [] )
			].join( '&' );

			return ( path + ( params.length ? ( '?' + params ) : '' ) );
		} );

		next();
	};
};
