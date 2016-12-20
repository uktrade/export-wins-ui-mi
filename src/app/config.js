
function env( name, defaultValue ){

	var exists = ( typeof process.env[ name ] !== 'undefined' );

	return ( exists ? process.env[ name ] : defaultValue );
}

function bool( name, defaultValue ){

	return ( env( name, defaultValue ) + '' ) === 'true';
}

module.exports = {
    server: {
        protocol: env( 'SERVER_PROTOCOL', 'http' ),
        host: env( 'SERVER_HOST', 'localhost' ),
        port: env( 'SERVER_PORT', env( 'PORT', 8080 ) ),
        workers: env( 'SERVER_WORKERS', 1 ),
        uuid: env( 'SERVER_UUID', '05422c73-064a-4277-aca8-07774dd3e3a0' )
    },
    views: {
        cache: bool( 'CACHE_VIEWS', true )
    },
    backend: {
        secret: env( 'MI_SECRET' ),
        uiSecret: env( 'UI_SECRET' ),
        protocol: env( 'MI_PROTOCOL', 'http' ),
        host: env( 'MI_HOST', 'localhost' ),
        port: env( 'MI_PORT', 8000 )
    }
};
