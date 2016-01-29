// $(function() {

// Create some HTML el's / grab needed el's
var $gameBoardContainer = $('<div>').attr('id','game-board-container').addClass('board');
var $playRowButtons = $('.play-row .column');
var $header = $('.game-header');
	
var $body = $('body');
// Append HTML el's to the body
$gameBoardContainer.appendTo($body);

// Setup scoring mechanism
var redWins = 0;
var blackWins = 0;
var ties = 0;

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

	var width = 'calc('+100 / ($columns.length / ($rows.length + $playRow.length))+'%)';
	var height = 100 / ($rows.length + $playRow.length);

	// Set the height and width for the appropriate rows and columns via a html css.
	// Doing this here so it can calcualte them dynamically based on how many rows/columns exist
	$columns.css('width', width);	 
	$rows.css('height', height+'%');
	$playRow.css('height', height+'%')
}


var setDropSquaresText = function() {
	// Set the text of the drop piece button to an icon
	$('.play-row .column').html(' ')
};

var setDropSquaresClick = function() {
	// Create variable in function to make sure HTML el's are created before trying to grab
	var $playRowButtons = $('.play-row .column');

	// Set a click function on each play button
	$playRowButtons.each(function() {
		$(this).click( function() {
			
			// Get the column and rown number clicked
			var $col = $(this).attr('col');
			var $row = $(this).attr('row');
			
			// Get the all the column numbers with that column number
			var $cols = $("[col="+$col+"]");
			
			// Loop through the columns to play the lowest (visually) column

			for (var i = $cols.length; i > 0; i--) {
				// If it's empty...
				if ($cols.eq(i).html() === '') {
					// If it's player = True's true ('Red'))
					if (playerTurn) {
						// Play Red
						$cols.eq(i).html(' ');
						$cols.eq(i).addClass('red');
						// Get the row and column numbers played
						var $colNum = parseInt($cols.eq(i).attr('col'));
						var $rowNum = parseInt($cols.eq(i).attr('row'));
						// Set the a color played var
						var colorPlayed = 'red';
						// Check the winner and set it to var (so we can use it later perhaps)
						var winner = checkIfWinner($rowNum,$colNum,colorPlayed,checkLeft,checkRight,checkUp,checkDown,checkDiagUpRight,checkDiagDownRight,checkDiagUpLeft,checkDiagDownLeft);
						// Check to see if there's a tie
						isTie(winner);
						// Change player's turn
						playerTurn = !playerTurn;
						// Break the loop since it doesn't need to keep playing up the empty spaces
						break;
					} else {
						// Doing the same thing for black
						$cols.eq(i).html(' ');
						$cols.eq(i).addClass('black');
						var $colNum = parseInt($cols.eq(i).attr('col'));
						var $rowNum = parseInt($cols.eq(i).attr('row'));
						var colorPlayed = 'black';
						var winner = checkIfWinner($rowNum,$colNum,colorPlayed,checkLeft,checkRight,checkUp,checkDown,checkDiagUpRight,checkDiagDownRight,checkDiagUpLeft,checkDiagDownLeft);
						isTie(winner);

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
	// Else return false because they did not win going right
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


var checkUp = function(row, col, color) {
	var fourUp = row-3;	
	var $piecePlayed = $("[row="+row+"] [col="+col+"]");
	var $pieceFourUp = $("[row="+fourUp+"] [col="+col+"]");
	var count = 1;

	// check if first and last position needed have the color class needed
	if ($piecePlayed.hasClass(color) && $pieceFourUp.hasClass(color)) {
		// Go Down To Up checking 4 pieces
		for (var i = fourUp; i < row; i++) {
			// Get the piece
			var $pieceUp = $("[row="+i+"] [col="+col+"]");
				// If the piece has the right class
				if ($pieceUp.hasClass(color)) {
					// Increment the count of the number of played pieces by 1
					count+=1;
				}; // End inner if loop
		}; // End For Loop
	}; // end if loop
	if (count === 4) {
		// If there are 4 in a row, return true
		return true;
	};
	// Else return false because they did not win going up
	return false;
}// end check up

var checkDown = function(row, col, color) {
	var fourDown = row+3;	
	var $piecePlayed = $("[row="+row+"] [col="+col+"]");
	var $pieceFourDown = $("[row="+fourDown+"] [col="+col+"]");
	var count = 1;

	// check if first and last position needed have the color class needed
	if ($piecePlayed.hasClass(color) && $pieceFourDown.hasClass(color)) {
		// Go Up To Down checking 4 pieces
		for (var i = fourDown; i > row; i--) {
			// Get the piece
			var $pieceDown = $("[row="+i+"] [col="+col+"]");
				// If the piece has the right class
				if ($pieceDown.hasClass(color)) {
					// Increment the count of the number of played pieces by 1
					count+=1;
				}; // End inner if loop
		}; // End For Loop
	}; // end if loop
	if (count === 4) {
		// If there are 4 in a row, return true
		return true;
	};
	// Else return false because they did not win going up
	return false;
}// end check down

var checkDiagUpRight = function(row, col, color) {
		var fourUp = row-3;	
		var fourRight = col+3;
		var $piecePlayed = $("[row="+row+"] [col="+col+"]");
		var $pieceDiagonal = $("[row="+fourUp+"] [col="+fourRight+"]");
		var count = 1;
		
		if ($piecePlayed.hasClass(color) && $pieceDiagonal.hasClass(color)) {
			while (fourUp < row && fourRight > col) {
				var $pieceCheck = $("[row="+fourUp+"] [col="+fourRight+"]");
				// If the piece has the right class
				if ($pieceCheck.hasClass(color)) {
					// Increment the count of the number of played pieces by 1
					count+=1;
				}; // End inner if loop
				fourUp++;
				fourRight--;
			}; // Close while loop
		};// Close if statement
		if (count === 4) {
				// If there are 4 in a row, return true
				return true;
			};
		// Else return false because they did not win going up
		return false;
}; // Close check diag up right func

var checkDiagUpLeft = function(row, col, color) {
		var fourUp = row-3;	
		var fourLeft = col-3;
		var $piecePlayed = $("[row="+row+"] [col="+col+"]");
		var $pieceDiagonal = $("[row="+fourUp+"] [col="+fourLeft+"]");
		var count = 1;
		
		if ($piecePlayed.hasClass(color) && $pieceDiagonal.hasClass(color)) {
			while (fourUp < row && fourLeft < col) {
				var $pieceCheck = $("[row="+fourUp+"] [col="+fourLeft+"]");
				// If the piece has the right class
				if ($pieceCheck.hasClass(color)) {
					// Increment the count of the number of played pieces by 1
					count+=1;
				}; // End inner if loop
				fourUp++;
				fourLeft++;
			}; // Close while loop
		};// Close if statement
		if (count === 4) {
				// If there are 4 in a row, return true
				return true;
			};
		// Else return false because they did not win going up
		return false;
}; // Close check diag up right func

var checkDiagDownLeft = function(row, col, color) {
		var fourDown = row+3;	
		var fourLeft = col-3;
		var $piecePlayed = $("[row="+row+"] [col="+col+"]");
		var $pieceDiagonal = $("[row="+fourDown+"] [col="+fourLeft+"]");
		var count = 1;
		
		if ($piecePlayed.hasClass(color) && $pieceDiagonal.hasClass(color)) {
			while (fourDown > row && fourLeft < col) {
				var $pieceCheck = $("[row="+fourDown+"] [col="+fourLeft+"]");
				// If the piece has the right class
				if ($pieceCheck.hasClass(color)) {
					// Increment the count of the number of played pieces by 1
					count+=1;
				}; // End inner if loop
				fourDown--;
				fourLeft++;
			}; // Close while loop
		};// Close if statement
		if (count === 4) {
				// If there are 4 in a row, return true
				return true;
			};
		// Else return false because they did not win going up
		return false;
}; // Close check diag up right func

var checkDiagDownRight = function(row, col, color) {
		var fourDown = row+3;	
		var fourRight = col+3;
		var $piecePlayed = $("[row="+row+"] [col="+col+"]");
		var $pieceDiagonal = $("[row="+fourDown+"] [col="+fourRight+"]");
		var count = 1;
		
		if ($piecePlayed.hasClass(color) && $pieceDiagonal.hasClass(color)) {
			while (fourDown > row && fourRight > col) {
				var $pieceCheck = $("[row="+fourDown+"] [col="+fourRight+"]");
				// If the piece has the right class
				if ($pieceCheck.hasClass(color)) {
					// Increment the count of the number of played pieces by 1
					count+=1;
				}; // End inner if loop
				fourDown--;
				fourRight--;
			}; // Close while loop
		};// Close if statement
		if (count === 4) {
				// If there are 4 in a row, return true
				return true;
			};
		// Else return false because they did not win going up
		return false;
}; // Close check diag up right func


// Function for returning if someone one
var checkIfWinner = function(row,col,color,callbackOne,callbackTwo,callbackThree,callbackFour,callbackFive,callbackSix,callbackSeven,callbackEight) {
	var left = callbackOne(row,col,color);
	var right = callbackTwo(row,col,color);
	var up = callbackThree(row,col,color);
	var down = callbackFour(row,col,color);
	var diagUpRight = callbackFive(row,col,color);
	var diagDownRight = callbackSix(row,col,color);
	var diagUpLeft = callbackSeven(row,col,color);
	var diagDownLeft = callbackEight(row,col,color);
	var $playRowButtons = $('.play-row .column');
	// Return true if one of the callbacks returns true
	if (left || right || up || down || diagUpRight || diagDownRight || diagUpLeft || diagDownLeft) {
		// Set the header to let the user know someone won!
		$header.html('Congrats! ' + color.toUpperCase() + ' won!');

		if (color === 'red') {
			// Add a win to red
			redWins += 1;
			$playRowButtons.off("click");
		} // end first if incrementing wins
		else {
			// Add a win to black
			blackWins += 1;
			$playRowButtons.off("click");
		} // end inner else incrementing wins
		// Overall function return true
		return true;
	} // End if statement checking if there's a winner
	else {
		// If no winner return false
		return false;
	} // End else statement
}; // End check if winner func


var isTie = function(isWinner) {
	var playerPlays = $('.red').length + $('.black').length;
	var columns = $('.column').length - $('.play-row .column').length;
	var $playRowButtons = $('.play-row .column');

	if (playerPlays === columns && isWinner === false) {
		$header.html('Womp Womp There Was A Tie...');
		ties += 1;
		$playRowButtons.off("click");
		return true;
	};
	return false;
};

var initialGameSetup = function() {
	makeBoard();
	setStyles();
	setDropSquaresText();
	setDropSquaresClick();
};

// Reset the board without resetting the score
var playAgain = function() {
	// Remove old info
	$gameBoardContainer.remove();

	// Set default els back to default
	$gameBoardContainer = $('<div>').attr('id','game-board-container').addClass('board');
	$playRowButtons = $('.play-row .column');
	$header = $('.game-header');
	// Append HTML el's to the body
	$gameBoardContainer.appendTo($body);

	// Set player turn back to true
	playerTurn = true;

	// Run initial game setup function again
	initialGameSetup();
};

// Reset the game, while also resetting the score
var resetGame = function() {
	redWins = 0;
	blackWins = 0;
	ties = 0;
	playAgain();
};


initialGameSetup();











// })