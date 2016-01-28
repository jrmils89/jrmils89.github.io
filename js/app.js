// $(function() {

// Create some HTML el's / grab needed el's
var $body = $('body');
var $gameBoardContainer = $('<div>').attr('id','game-board-container').addClass('board');
var $playRowButtons = $('.play-row .column');

// Append HTML el's to the body
$gameBoardContainer.appendTo($body);

var playerTurn = true;

// Function to make the board HTML el's
var makeBoard = function() {

	// Loop through and make 7 rows. 
	for (var i = 0;  i < 7; i++) {	
		// Create a row for players to click and drop their pieces
		if (i === 0) {
			var $row = $('<div>').attr('id','play-row').addClass('play-row');	
		} else {
			// Create the normal game play rows
			var $row = $('<div>').attr({
				id:'row'+i,
				row: i
			}).addClass('row');	
		}
		// Loop through and make 7 columns
		for (var j = 0; j < 7; j++) {
			// Create the columns for the game rows
			var $column = $('<div>').attr({
				id: 'row'+i+'col'+j,
				col: j,
				row: i	
				}).addClass('column');
			// Append the columns to the rows
			$column.appendTo($row);
		}; // End column looping

		$row.appendTo($gameBoardContainer);

	}; // End row looping

}; // End makeBoard function


var setStyles = function() {
	// Get the columns, rows, and play row
	var $columns = $('.column');
	var $rows = $('.row');
	var $playRow = $('.play-row');

	// Dynamically calculate the width and length based on the number of rows and columns existing

	var width = 100 / ($columns.length / ($rows.length + $playRow.length));
	var height = 100 / ($rows.length + $playRow.length);

	// Set the height and width for the appropriate rows and columns via a html css.
	// Doing this here so it can calcualte them dynamically based on how many rows/columns exist
	$columns.css('width', width+'%');	 
	$rows.css('height', height+'%');
	$playRow.css('height', height+'%')
}


var setDropSquaresText = function() {
	// Set the text of the drop piece button to an icon
	$('.play-row .column').html('&#xe806')
};

var setDropSquaresClick = function() {
	// Create variable in function to make sure HTML el's are created before trying to grab
	var $playRowButtons = $('.play-row .column');

	// Set a click function on each play button
	$playRowButtons.each(function() {
		$(this).click( function() {
			
			// Get the column number clicked
			var $col = $(this).attr('col');
			
			// Get the all the column numbers with that column number
			var $cols = $("[col="+$col+"]");
			
			for (var i = $cols.length; i > 0; i--) {
				if ($cols.eq(i).html() === '') {
					
					if (playerTurn) {
						$cols.eq(i).html('&#xE803');
						$cols.eq(i).addClass('red');
						playerTurn = !playerTurn;
						break;
					} else {
						$cols.eq(i).html('&#xE802');
						$cols.eq(i).addClass('black');
						playerTurn = !playerTurn;
						break;
					}

				}; // end of if statement

			} // end of for loop

		}) // end click parens
	}) // end each parens
};

// Check Four Pieces To The Right
var checkRight = function(row, col, color) {
	var fourRight = col+3;	
	var $piecePlayed = $("[row="+row+"] [col="+col+"]");
	var $pieceFourRight = $("[row="+row+"] [col="+fourRight+"]");
	var count = 1;


	// check red
	if ($piecePlayed.hasClass(color) && $pieceFourRight.hasClass(color)) {
		// Go Right To Left checking 4 pieces
		for (var i = fourRight; i > col; i--) {
			// Get the piece
			var $pieceRight = $("[row="+row+"] [col="+i+"]");
				// If the piece has the right class
				if ($pieceRight.hasClass(color)) {
					// Increment the count of the number of played pieces by 1
					count+=1;
				}; // End inner if loop
		}; // End For Loop
	}; // end if loop
	if (count === 4) {
		// If there are 4 in a row, return true
		return true;
	};
	// Else return false because they did not win going left
	return false;
}// end check across

// Check Four Pieces To The Left
var checkLeft = function(row, col, color) {
	var fourLeft = col-3;	
	var $piecePlayed = $("[row="+row+"] [col="+col+"]");
	var $pieceFourLeft = $("[row="+row+"] [col="+fourLeft+"]");
	var count = 1;

	// check if first and last position needed have the color class needed
	if ($piecePlayed.hasClass(color) && $pieceFourLeft.hasClass(color)) {
		// Go Left To Right checking 4 pieces
		for (var i = fourLeft; i < col; i++) {
			// Get the piece
			var $pieceLeft = $("[row="+row+"] [col="+i+"]");
				// If the piece has the right class
				if ($pieceLeft.hasClass(color)) {
					// Increment the count of the number of played pieces by 1
					count+=1;
				}; // End inner if loop
		}; // End For Loop
	}; // end if loop
	if (count === 4) {
		// If there are 4 in a row, return true
		return true;
	};
	// Else return false because they did not win going left
	return false;
}// end check across


// Function for returning if someone one
var checkIfWinner = function(row,col,color,callbackOne,callbackTwo) {
	var left = callbackOne(row,col,color);
	var right = callbackTwo(row,col,color);

	// Return true if one of the callbacks returns true
	if (left || right) {
		return true;
	};

	// Call like this: checkIfWinner(6,3,'red',checkLeft,checkRight)
};


makeBoard();
setStyles();
setDropSquaresText();
setDropSquaresClick();









// })