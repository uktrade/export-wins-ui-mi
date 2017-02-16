module.exports = function createMonthDate( month ){

	let date = new Date( month.date );
	month.date = ( date.getFullYear() + '-' + ( date.getMonth() + 1 ) );
};
