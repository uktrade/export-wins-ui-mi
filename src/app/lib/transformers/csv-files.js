const namePattern = /^(.+) [0-9\/-]+$/;

function updateItem( item ){

	const nameMatches = namePattern.exec( item.name );

	item.updated = ( item.report_end_date === item.created );

	if( nameMatches && nameMatches.length > 1 ){

		item.name = nameMatches[ 1 ];
	}
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

	if( input.fdi && input.fdi.latest ){

		input.fdi.latest.name = 'FDI Daily';
	}

	if( input.sdi && input.sdi.latest ){

		input.sdi.latest.name = 'Interactions Daily';
	}

	checkItems( input.contacts );
	checkItems( input.companies );

	return info;
};
