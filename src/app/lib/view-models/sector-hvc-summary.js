const targetProgressDataSet = require( '../data-sets/target-progress' );

module.exports = {

	create: function( winsData ){

		return {
			target: winsData.hvcs.target,
			totalConfirmed: winsData.wins.export.hvc.value.confirmed,
			total: winsData.wins.export.hvc.value.total,
			progress: targetProgressDataSet.create( winsData )
		};
	}
};
