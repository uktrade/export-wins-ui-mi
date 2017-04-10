const targetProgressDataSet = require( '../data-sets/target-progress' );

module.exports = {

	create: function( winsData ){

		return {
			target: winsData.hvcs.target,
			confirmedValue: winsData.wins.export.hvc.value.confirmed,
			unconfirmedValue: winsData.wins.export.hvc.value.unconfirmed,
			progress: targetProgressDataSet.create( winsData )
		};
	}
};
