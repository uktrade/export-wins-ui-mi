module.exports = function( activeItem = {} ){

	const nav = {
		isExport: ( !!activeItem.isExport || false ),
		isInvestment: ( !!activeItem.isInvestment || false ),
		isDownload: ( !!activeItem.isDownload || false )
	};

	return function( req, res, next ){

		res.locals.nav = nav;
		next();
	};
};
