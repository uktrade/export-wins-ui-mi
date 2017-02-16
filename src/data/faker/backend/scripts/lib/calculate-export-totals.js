module.exports = function calculateExportTotals( exportVal ){

	exportVal.totals.number.confirmed = ( exportVal.hvc.number.confirmed + exportVal.non_hvc.number.confirmed );
	exportVal.totals.number.unconfirmed = ( exportVal.hvc.number.unconfirmed + exportVal.non_hvc.number.unconfirmed );
	exportVal.totals.number.grand_total = ( exportVal.hvc.number.total + exportVal.non_hvc.number.total );

	exportVal.totals.value.confirmed = ( exportVal.hvc.value.confirmed + exportVal.non_hvc.value.confirmed );
	exportVal.totals.value.unconfirmed = ( exportVal.hvc.value.unconfirmed + exportVal.non_hvc.value.unconfirmed );
	exportVal.totals.value.grand_total = ( exportVal.hvc.value.total + exportVal.non_hvc.value.total );
};
