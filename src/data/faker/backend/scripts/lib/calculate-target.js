module.exports = function( values ){

	const total = ( ( values.current / values.target_percentage ) * 100 );

	values.target = Math.round( total );
};
