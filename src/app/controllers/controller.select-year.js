const config = require( '../config' );

module.exports = {

	choose: function( req, res ){

		const startYear = config.financialYearStart;
		const years = [];
		const currentYear = ( new Date() ).getFullYear();
		let year = startYear;

		while( year <= currentYear ){
			years.push( year++ );
		}

		res.locals._currentYear = res.locals.currentYear;
		res.locals.currentYear = null;

		res.render( 'select-year.html', {
			years
		} );
	}
};
