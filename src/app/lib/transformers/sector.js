module.exports = function( input ){

	const wins = input.wins;

	input.exportValue = wins.export.totals.value.confirmed;
	input.exportValueTotal = wins.export.totals.value.grand_total;

	return input;
};
