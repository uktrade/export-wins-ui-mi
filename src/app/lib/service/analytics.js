const ua = require( 'universal-analytics' );
const config = require( '../../config' );
const reporter = require( '../reporter' );

const analyticsId = config.analyticsId;
const GID_PATTERN = /^[a-z]+[0-9]+\.[0-9+]\.([0-9]+\.[0-9]+)$/i;

function getId( gid ){

	const matches = GID_PATTERN.exec( gid );
	const id = ( matches && matches[ 1 ] );

	return ( id || gid );
}

function Tracker( analyticsId, uid ){

	this.tracker = ua( analyticsId, uid, { strictCidFormat: false, https: true } );
}

Tracker.prototype.downloadCsvFile = function( path, action, fileName ){

	this.tracker.event( {

		eventCategory: 'Downloads',
		eventAction: action,
		eventLabel: fileName,
		documentPath: path,
		dataSource: 'web',
		documentTitle: 'CSV download'

	}, ( err ) => {

		if( err ){

			reporter.message( 'info', 'Unable to send download event to Google Analytics', {
				eventAction: action,
				eventLabel: fileName,
			} );
		}
	} );
};

module.exports = {

	createTracker: function( req ){

		const uid = getId( req.cookies[ '_ga' ] );

		if( analyticsId && uid ){

			return new Tracker( analyticsId, uid );

		} else {

			//send to sentry?
		}
	}
};
