function updateItem( item ){

	item.updated = ( item.report_date === item.created );
}

function checkItems( items ){

	if( items ){

		if( items.regions ){

			items.regions.forEach( updateItem );
		}

		if( items.sectors ){

			items.sectors.forEach( updateItem );
		}
	}
}

module.exports = function( info ){

	const input = info.data;

	checkItems( input.contacts );
	checkItems( input.companies );

	return info;
};
