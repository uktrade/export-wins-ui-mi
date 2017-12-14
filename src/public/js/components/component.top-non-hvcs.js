mi.components.TopNonHvcs = (function( document, jessie ){

	var TIME_BETWEEN_ROWS = 60;
	var MAX_ROW_TIMEOUT = 1000;

	function TopNonHvcsComponent( opts ){

		opts = ( opts || {} );

		if( !opts.url ){ throw new Error( 'opts.url is required' ); }
		if( typeof opts.count === 'undefined' ){ throw new Error( 'opts.count is required' ); }

		//if we don't have more than 5 items there are no more to show, so exit
		if( opts.count <= 5 ){ return; }

		this.url = opts.url;
		this.count = opts.count;
		this.tableId = opts.tableId || 'top-markets_table';
		this.rowClass = ( opts.rowClass || 'top-markets_table_row' );

		this.table = jessie.getElement( this.tableId );

		if( this.table ){

			this.addLink();
			jessie.attachListener( this.link, 'click', jessie.bind( this.handleLinkClick, this ) );
		}
	}

	TopNonHvcsComponent.prototype.addLink = function(){

		this.link = document.createElement( 'a' );
		this.link.href = '#';
		this.setLinkDefaultText();

		this.table.parentNode.appendChild( this.link );
	};

	TopNonHvcsComponent.prototype.setLinkDefaultText = function(){

		this.link.innerHTML = 'Load all ' + this.count + ' top performing markets';
	};

	TopNonHvcsComponent.prototype.createRows = function( rowsHtml ){

		var body = document.createElement( 'tbody' );
		body.innerHTML = rowsHtml;

		return body.children;
	};

	TopNonHvcsComponent.prototype.removeRows = function( rows ){

		var i = 0;
		var l = rows.length;
		var parent = rows[ i ].parentNode;

		for( ; i < l; i++ ){

			parent.removeChild( rows[ i ] );
		}
	};

	TopNonHvcsComponent.prototype.addRowsToTable = function( rowsHtml ){

		var newRows = this.createRows( rowsHtml );
		var tableRows = jessie.getDescendantsByClassName( this.table, this.rowClass );
		var scaleRow = tableRows[ tableRows.length - 1 ].nextSibling;
		var parent = scaleRow.parentNode;
		var rowClass = this.rowClass + '--new';
		var i = 25;
		var j = 0;
		var l;
		var otherRows = [];

		this.removeRows( tableRows );

		//add class to hide each row then add to the DOM
		//set a timeout to remove the class to animate it back in
		while( newRows.length ){

			(function( row ){

				jessie.addClass( row, rowClass );
				parent.insertBefore( row, scaleRow );

				//if we have too many rows it will take ages to show them all
				//so only animate the first x rows and then batch show the rest
				if( i <= MAX_ROW_TIMEOUT ){

					setTimeout( function(){ jessie.removeClass( row, rowClass ); }, i );
					i += TIME_BETWEEN_ROWS;

				} else {

					otherRows.push( row );
				}

			}( newRows[ 0 ] ));
		}

		//if we have other rows to show as batch loop through and remove the class to show them
		if( otherRows.length ){

			setTimeout( function(){

				for( l = otherRows.length; j < l; j++ ){

					jessie.removeClass( otherRows[ j ], rowClass );
				}

			}, MAX_ROW_TIMEOUT );
		}
	};

	TopNonHvcsComponent.prototype.removeLink = function(){

		this.link.parentNode.removeChild( this.link );
	};

	TopNonHvcsComponent.prototype.handleLinkClick = function( e ){

		var target = jessie.getEventTarget( e );

		jessie.cancelDefault( e );
		target.blur();

		this.link.innerHTML = 'Loading...';

		jessie.ajaxGet( this.url, {

			success: jessie.bind( function( html ){

				this.addRowsToTable( html );
				this.removeLink();

			}, this ),

			fail: jessie.bind( function(){

				this.setLinkDefaultText();

			}, this )
		} );
	};

	return TopNonHvcsComponent;

}( document, jessie ));
