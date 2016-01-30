$(function() {

  // Create some HTML el's / grab needed el's
  var $gameBoardContainer = $('<div>').attr('id', 'game-board-container').addClass('board');
  var $playRowButtons = $('.play-row .column');
  var $header = $('.game-header');

  var $body = $('body');

  // Setup scoring mechanism
  var redWins = 0;
  var blackWins = 0;
  var ties = 0;

  var playerTurn = true;
  // holder vars for player names
  var playerOneName;
  var playerTwoName;

  var playAgainstComputer = true;

  // Get player names function
  var getPlayerNames = function() {
    playerOneName = $("#player-one").val()
    playerTwoName = $("#player-two").val()
  };

  // Function to make the board HTML el's
  var makeBoard = function() {

    // Setup the player names and scores
    var $scoreDiv = $("<div>").attr("id", "score");
    var $playerOneP = $("<p>").addClass("player-name").html("Red Player: ");
    var $playerTwoP = $("<p>").addClass("player-name").html("Black Player: ");
    var $pOneName = $("<span>").html(playerOneName);
    var $pTwoName = $("<span>").html(playerTwoName);

    var $playerOneScoreP = $("<p>").addClass("player-score").html("Red Wins: ");
    var $playerTwoScoreP = $("<p>").addClass("player-score").html("Black Wins: ");
    var $pOneScore = $("<span>").html(redWins);
    var $pTwoScore = $("<span>").html(blackWins);

    $pOneName.appendTo($playerOneP);
    $pTwoName.appendTo($playerTwoP);
    $pOneScore.appendTo($playerOneScoreP);
    $pTwoScore.appendTo($playerTwoScoreP);

    $scoreDiv.append($playerOneP, $playerTwoP, $playerOneScoreP, $playerTwoScoreP)

    $scoreDiv.appendTo($body);

    // Append HTML el's to the body
    $gameBoardContainer.appendTo($body);
    // Loop through and make 7 rows. 
    for (var i = 0; i < 7; i++) {
      // Create a row for players to click and drop their pieces
      if (i === 0) {
        var $row = $('<div>').attr('id', 'play-row').addClass('play-row');
      } else {
        // Create the normal game play rows
        var $row = $('<div>').attr({
          id: 'row' + i,
          row: i
        }).addClass('row');
      }
      // Loop through and make 7 columns
      for (var j = 0; j < 7; j++) {
        // Create the columns for the game rows
        var $column = $('<div>').attr({
          id: 'row' + i + 'col' + j,
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

    var width = 'calc(' + 100 / ($columns.length / ($rows.length + $playRow.length)) + '%)';
    var height = 100 / ($rows.length + $playRow.length);

    // Set the height and width for the appropriate rows and columns via a html css.
    // Doing this here so it can calcualte them dynamically based on how many rows/columns exist
    $columns.css('width', width);
    $rows.css('height', height + '%');
    $playRow.css('height', height + '%')
  }

  var setDropSquaresClick = function() {
    // Create variable in function to make sure HTML el's are created before trying to grab
    var $playRowButtons = $('.play-row .column');

    // Set a click function on each play button
    $playRowButtons.each(function() {
        $(this).click(playClick) // end click parens
      }) // end each parens
  };

  var playClick = function() {

    // Get the column and rown number clicked
    var $col = $(this).attr('col');
    var $row = $(this).attr('row');

    // Get the all the column numbers with that column number
    var $cols = $("[col=" + $col + "]");

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
          // Display other player's turn
          $header.html("It is " + playerTwoName + "'s turn!");
          // Check the winner and set it to var (so we can use it later perhaps)
          var winner = checkIfWinner($rowNum, $colNum, colorPlayed, checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative);
          // Check to see if there's a tie
          isTie(winner);
          // Change player's turn

          playerTurn = !playerTurn;


          if (playAgainstComputer && !winner & !isTie(winner)) {
            setTimeout(computerPlayWrapper, 250);
            // setTimeout(computerPlayWrapper, 500);
          }


          // Break the loop since it doesn't need to keep playing up the empty spaces
          break;
        } else {
          // Doing the same thing for black
          $cols.eq(i).html(' ');
          $cols.eq(i).addClass('black');
          var $colNum = parseInt($cols.eq(i).attr('col'));
          var $rowNum = parseInt($cols.eq(i).attr('row'));
          var colorPlayed = 'black';
          $header.html("It is " + playerOneName + "'s turn!");
          var winner = checkIfWinner($rowNum, $colNum, colorPlayed, checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative);
          isTie(winner);

          playerTurn = !playerTurn;
          break;
        }
      }; // end of if statement
    } // end of for loop
  };

  var checkHorizontal = function(row, col, color) {
    var $piecePlayed = $("[row=" + row + "] [col=" + col + "]");
    horizontalCount = 1;
    blockHorizontal = 1;
    var blockedLeft = 4;
    var blockedRight = 4;

    checkRight = 1;
    checkLeft = -1;

    while (checkRight < 4) {
      var $pieceToCheck = $("[row=" + row + "] [col=" + (col + checkRight) + "]");
      if (color === 'red' && $pieceToCheck.hasClass('black') || color === 'black' && $pieceToCheck.hasClass('red')) {
        var blockedRight = checkRight;
        break;
      } else if (color === 'red' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red') || color === 'black' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red')) {
        horizontalCount = horizontalCount;
      } else {
        horizontalCount += 1;
      }
      checkRight++;
    }

    while (checkLeft > -4) {
      var $pieceToCheck = $("[row=" + row + "] [col=" + (col + checkLeft) + "]");
      if (color === 'red' && $pieceToCheck.hasClass('black') || color === 'black' && $pieceToCheck.hasClass('red')) {
        var blockedLeft = checkLeft;
        break;
      } else if (color === 'red' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red') || color === 'black' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red')) {
        horizontalCount = horizontalCount;
      } else {
        horizontalCount += 1;
      }
      checkLeft--;
    }

    if (blockedRight < 3 && blockedLeft > -3) {
      blockHorizontal = 0;
    }

    horizontalCount = horizontalCount * blockHorizontal;
    if (horizontalCount === 4) {
      // If there are 4 in a row, return true
      return true;
    };
    // Else return false because they did not win going right
    return false;
  }; // end check horizontal

  var checkVertical = function(row, col, color) {
    var $piecePlayed = $("[row=" + row + "] [col=" + col + "]");
    verticalCount = 1;
    blockVertical = 1;
    var blockedUp = 4;
    var blockedDown = 4;

    checkDown = 1;
    checkUp = -1;

    while (checkDown < 4) {
      var $pieceToCheck = $("[row=" + (row + checkDown) + "] [col=" + col + "]");
      if (color === 'red' && $pieceToCheck.hasClass('black') || color === 'black' && $pieceToCheck.hasClass('red')) {
        var blockedDown = checkDown;
        break;
      } else if (color === 'red' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red') || color === 'black' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red')) {
        verticalCount = verticalCount;
      } else {
        verticalCount += 1;
      }
      checkDown++;
    }

    while (checkUp > -4) {
      var $pieceToCheck = $("[row=" + (row + checkUp) + "] [col=" + col + "]");
      if (color === 'red' && $pieceToCheck.hasClass('black') || color === 'black' && $pieceToCheck.hasClass('red')) {
        var blockedUp = checkUp;
        break;
      } else if (color === 'red' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red') || color === 'black' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red')) {
        verticalCount = verticalCount;
      } else {
        verticalCount += 1;
      }
      checkUp--;
    }

    if (blockedDown < 3 && blockedUp > -3) {
      blockVertical = 0;
    }

    verticalCount = verticalCount * blockVertical;
    if (verticalCount === 4) {
      // If there are 4 in a row, return true
      return true;
    };
    // Else return false because they did not win going right
    return false;
  }; // end check vertical

  var checkDiagPositive = function(row, col, color) {
    var $piecePlayed = $("[row=" + row + "] [col=" + col + "]");
    diagonalCountPositive = 1;
    blockDiagonalPostive = 1;
    var blockedUpDiag = 4;
    var blockedDownDiag = 4;
    var blockedRightDiag = 4;
    var blockedLeftDiag = 4;

    checkDown = 1;
    checkUp = -1;
    checkRight = 1;
    checkLeft = -1;

    while (checkRight < 4 && checkUp > -4) {
      var $pieceToCheck = $("[row=" + (row + checkUp) + "] [col=" + (col + checkRight) + "]");
      if (color === 'red' && $pieceToCheck.hasClass('black') || color === 'black' && $pieceToCheck.hasClass('red')) {
        var blockedUpDiag = checkUp;
        var blockedRightDiag = checkRight;
        break;
      } else if (color === 'red' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red') || color === 'black' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red')) {
        diagonalCountPositive = diagonalCountPositive;
      } else {
        diagonalCountPositive += 1;
      }
      checkUp--;
      checkRight++;
    }

    while (checkLeft > -4 && checkDown < 4) {
      var $pieceToCheck = $("[row=" + (row + checkDown) + "] [col=" + (col + checkLeft) + "]");
      if (color === 'red' && $pieceToCheck.hasClass('black') || color === 'black' && $pieceToCheck.hasClass('red')) {
        var blockedDownDiag = checkDown;
        var blockedLeftDiag = checkLeft;
        break;
      } else if (color === 'red' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red') || color === 'black' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red')) {
        diagonalCountPositive = diagonalCountPositive;
      } else {
        diagonalCountPositive += 1;
      }
      checkLeft--;
      checkDown++;
    }

    if (blockedUpDiag < 3 && blockedRightDiag > -3 || blockedDownDiag < 3 && blockedLeftDiag > -3) {
      blockDiagonalPostive = 0;
    }

    diagonalCountPositive = diagonalCountPositive * blockDiagonalPostive;
    if (diagonalCountPositive === 4) {
      // If there are 4 in a row, return true
      return true;
    };
    // Else return false because they did not win going right
    return false;
  };


  var checkDiagNegative = function(row, col, color) {
    var $piecePlayed = $("[row=" + row + "] [col=" + col + "]");
    diagonalCountNegative = 1;
    blockDiagonalNegative = 1;
    var blockedUpDiagNeg = 4;
    var blockedDownDiagNeg = 4;
    var blockedRightDiagNeg = 4;
    var blockedLeftDiagNeg = 4;

    checkDown = 1;
    checkUp = -1;
    checkRight = 1;
    checkLeft = -1;

    while (checkLeft > -4 && checkUp > -4) {
      var $pieceToCheck = $("[row=" + (row + checkUp) + "] [col=" + (col + checkLeft) + "]");
      if (color === 'red' && $pieceToCheck.hasClass('black') || color === 'black' && $pieceToCheck.hasClass('red')) {
        var blockedUpDiagNeg = checkUp;
        var blockedRightDiagNeg = checkLeft;
        break;
      } else if (color === 'red' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red') || color === 'black' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red')) {
        diagonalCountNegative = diagonalCountNegative;
      } else {
        diagonalCountNegative += 1;
      }
      checkUp--;
      checkLeft--;
    }

    while (checkRight < 4 && checkDown < 4) {
      var $pieceToCheck = $("[row=" + (row + checkDown) + "] [col=" + (col + checkRight) + "]");
      if (color === 'red' && $pieceToCheck.hasClass('black') || color === 'black' && $pieceToCheck.hasClass('red')) {
        var blockedDownDiagNeg = checkDown;
        var blockedLeftDiagNeg = checkLeft;
        break;
      } else if (color === 'red' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red') || color === 'black' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red')) {
        diagonalCountNegative = diagonalCountNegative;
      } else {
        diagonalCountNegative += 1;
      }
      checkRight++;
      checkDown++;
    }

    if (blockedUpDiagNeg < 3 && blockedRightDiagNeg > -3 || blockedDownDiagNeg < 3 && blockedLeftDiagNeg > -3) {
      blockDiagonalNegative = 0;
    }

    diagonalCountNegative = diagonalCountNegative * blockDiagonalNegative;
    if (diagonalCountNegative === 4) {
      // If there are 4 in a row, return true
      return true;
    };
    // Else return false because they did not win going right
    return false;
  };

  // Function for returning if someone one
  var checkIfWinner = function(row, col, color, callbackOne, callbackTwo, callbackThree, callbackFour) {
    var horizontal = callbackOne(row, col, color);
    var vertical = callbackTwo(row, col, color);
    var diagPos = callbackThree(row, col, color);
    var diagNeg = callbackFour(row, col, color);
    // var diagUpRight = callbackFive(row, col, color);
    // var diagDownRight = callbackSix(row, col, color);
    // var diagUpLeft = callbackSeven(row, col, color);
    // var diagDownLeft = callbackEight(row, col, color);
    var $playRowButtons = $('.play-row .column');
    // Return true if one of the callbacks returns true
    if (horizontal || vertical || diagPos || diagNeg) {

      if (color === 'red') {
        // Add a win to red
        redWins += 1;
        // Set the header to let the user know someone won!
        $header.html('Congrats! ' + playerOneName + ' won!');
        $('.player-score span').eq(0).html(redWins);
        $playRowButtons.off("click");
        addPlayAgainResetButtons();
      } // end first if incrementing wins
      else {
        // Add a win to black
        blackWins += 1;
        $header.html('Congrats! ' + playerTwoName + ' won!');
        $('.player-score span').eq(1).html(blackWins);
        $playRowButtons.off("click");
        addPlayAgainResetButtons();
      } // end inner else incrementing wins
      // Overall function return true
      return true;
    } // End if statement checking if there's a winner
    else {
      // If no winner return false
      return false;
    } // End else statement
  }; // End check if winner func




  var checkIfWinnerWithoutPlaying = function(row, col, color, callbackOne, callbackTwo, callbackThree, callbackFour) {
    var horizontal = callbackOne(row, col, color);
    var vertical = callbackTwo(row, col, color);
    var diagPos = callbackThree(row, col, color);
    var diagNeg = callbackFour(row, col, color);
    // var diagUpRight = callbackFive(row, col, color);
    // var diagDownRight = callbackSix(row, col, color);
    // var diagUpLeft = callbackSeven(row, col, color);
    // var diagDownLeft = callbackEight(row, col, color);
    var $playRowButtons = $('.play-row .column');
    // Return true if one of the callbacks returns true
    if (horizontal || vertical || diagPos || diagNeg) {
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
      addPlayAgainResetButtons();
      return true;
    };
    return false;
  };

  var initialGameSetup = function() {
    makeBoard();
    setStyles();
    // setDropSquaresText();
    setDropSquaresClick();
  };

  // Reset the board without resetting the score
  var playAgain = function() {
    // Remove old info
    $gameBoardContainer.remove();
    $('#score').remove();
    // Set default els back to default
    $gameBoardContainer = $('<div>').attr('id', 'game-board-container').addClass('board');
    $playRowButtons = $('.play-row .column');
    $header = $('.game-header').html("It is " + playerOneName + "'s turn!");
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

    // Make the overlay visible again. The overlay makes the play button which intiates the intial game setup
    // So we don't need to call that funciton here anymore
    $("#overlay").removeAttr("style");
    $("#overlay").children().removeAttr("style");

    // Remove the old gameplay and scoreboard
    $gameBoardContainer.remove();
    $('#score').remove();

    // Create some new vars
    $gameBoardContainer = $('<div>').attr('id', 'game-board-container').addClass('board');
    $playRowButtons = $('.play-row .column');
    playerTurn = true;
    // Resetting the header text
    $header = $('.game-header').html("It is " + playerOneName + "'s turn!");
    // Append HTML el's to the body
    $gameBoardContainer.appendTo($body);
  };


  // Add Player names and 
  $("button.play-button").click(function() {
    // Get the player names
    getPlayerNames();
    // Setup the board
    initialGameSetup();
    // Hide the elements in the overlay
    $(this).siblings().fadeOut(200);
    $(this).parent().fadeOut(200);
    $('.game-header').html("It is " + playerOneName + "'s turn!");
  });

  $("input.player-input").keypress(function() {

    // Run the same functions that clicking the play button does if you hit enter in the inputs

    if (event.code === 'Enter') {
      // Get the player names
      getPlayerNames();
      // Setup the board
      initialGameSetup();
      // Hide the elements in the overlay
      $(this).siblings().fadeOut(200);
      $(this).parent().fadeOut(200);
      $('.game-header').html("It is " + playerOneName + "'s turn!");
    }
  });



  var addPlayAgainResetButtons = function() {
    var $playAgainButton = $("<button>").attr("id", "play-again").html("Play Again");
    var $resetButton = $("<button>").attr("id", "reset-button").html("Reset Game");

    $playAgainButton.click(playAgain);
    $resetButton.click(resetGame);

    $("#score").append($playAgainButton, $resetButton);
  };


  // just abstracting out some code I've repeated a bunch for get col's and rows
  var getCol = function(num) {
    return $("[col=" + num + "]");
  };

  var getColRow = function(col, row) {
    return $("[col=" + col + "]" + "[row=" + row + "]");
  };

  // Function to determine where x color should play. Expecting a string value
  var determinePossibleMoves = function(color) {
    var numberOfColumns = 7;
    var numberOfRows = 6;
    var winningArray = [];


    // Loop through the rows and columns
    for (var c = 0; c < numberOfColumns; c++) {

      for (var r = numberOfRows; r > 0; r--) {

        // If the square is empoty
        if (getColRow(c, r).html() === '') {

          // Add the class so that I can check if that spot would win
          $("[col=" + c + "]" + "[row=" + r + "]").addClass(color);

          // Running this function. It returns true if there's a winner, but I'm really using it to increment the counts
          // The counts determine how many tiles could be matched. For example, going 4 up if the tile being checked and 3 up was another
          // Equal tile, but the middle two were empty, the count for checkUp would be 2. 
          checkIfWinnerWithoutPlaying(r, c, color, checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative);

          // I then add each count together to get a "Total Count" for each possible square. This needs to be worked on some
          // as currently if there is an opposite color in between it's counting that as null, where I would prefer that to punish
          // that count somehow as there's noway to win that direction. I'm going to do this within each check function 
          // by adding a oppositeColor = 0 if there's a wrong color tile in the way

          var totalCount = horizontalCount + verticalCount + diagonalCountPositive + diagonalCountNegative;

          // Pushes the position being checked into an array with the total
          winningArray.push([c, r, totalCount]);

          // Removing the class so it doesn't accidentally get played
          $("[col=" + c + "]" + "[row=" + r + "]").removeClass(color);

          // Break the nested loop so it goes onto the next column
          break;
        }; // End if loop

      }; // Close row for loop

    }; // Close column for loop

    return winningArray;

  }; // Close function

  // This function is for looping through the array of possible moves and determining the best of those moves.
  // This function could be used as well to block an opposing move
  var loopThroughPossibleMoves = function(a, color) {
    // Set a baseline to compare against

    var col = a[0][0];
    var row = a[0][1];
    var count = a[0][2];

    // Loop through the array
    for (var i = 0; i < a.length; i++) {
      // Add the class to the location it's on so that...
      $("[col=" + a[i][0] + "]" + "[row=" + a[i][1] + "]").addClass(color);

      // If the location being checked would win
      if (checkIfWinnerWithoutPlaying(a[i][1], a[i][0], color, checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative)) {
        // Win the game at that square OR something here...

        $("[col=" + a[i][0] + "]" + "[row=" + a[i][1] + "]").removeClass(color);
        // Break the loop because the game is over
        return {
          'row': a[i][1],
          'col': a[i][0],
          'wins': true
        };
      }
      // Else, if the position's it's at has a score that's higher than the baseline
      else if (a[i][2] > count) {
        // Say that position is better
        col = a[i][0];
        row = a[i][1];
        count = a[i][2];
        $("[col=" + a[i][0] + "]" + "[row=" + a[i][1] + "]").removeClass(color);

      } else {
        $("[col=" + a[i][0] + "]" + "[row=" + a[i][1] + "]").removeClass(color);
      }
    }; // Close For Loop

    // Say what spot the computer should play at
    return {
      'row': row,
      'col': col,
      'wins': false
    };
  }; // Close function;

  var whereToPlay = function(color, callbackOne, callbackTwo) {
    var possibleMoves = callbackOne(color);
    var redMove = callbackTwo(possibleMoves, 'red');
    var blackMove = callbackTwo(possibleMoves, 'black')

    if (color === 'black' && blackMove.wins) {
      console.log("Black Can Win");
      return blackMove;
    } else if (color === 'black' && redMove.wins) {
      console.log("Black Needs To Block");
      return redMove
    } else if (color === 'red' && redMove.wins) {
      console.log("Red Can Win");
      return redMove;
    } else if (color === 'black') {
      return blackMove;
    } else {
      return redMove;
    }
    //call like so
    // whereToPlay('black',determinePossibleMoves,loopThroughPossibleMoves)
  };

  // Function to play a piece. Follows basically the same logic as the ealier logic
  var playAPiece = function(row, column) {
    var $piece = $("[col=" + column + "]" + "[row=" + row + "]")
    if (playerTurn) {
      // Play Red
      $piece.html(' ');
      $piece.addClass('red');
      // Get the row and column numbers played
      var $colNum = column
      var $rowNum = row;
      // Set the a color played var
      var colorPlayed = 'red';
      // Display other player's turn
      $header.html("It is " + playerTwoName + "'s turn!");
      // Check the winner and set it to var (so we can use it later perhaps)
      var winner = checkIfWinner($rowNum, $colNum, colorPlayed, checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative);
      // Check to see if there's a tie
      isTie(winner);
      // Change player's turn

      playerTurn = !playerTurn;
    } else {
      // Doing the same thing for black
      $piece.html(' ');
      $piece.addClass('black');
      var $colNum = column;
      var $rowNum = row;
      var colorPlayed = 'black';
      $header.html("It is " + playerOneName + "'s turn!");
      var winner = checkIfWinner($rowNum, $colNum, colorPlayed, checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative);
      isTie(winner);
      playerTurn = !playerTurn;
    }
    // Example playAPiece(whereToPlay('black',determinePossibleMoves,loopThroughPossibleMoves).row,whereToPlay('black',determinePossibleMoves,loopThroughPossibleMoves).col)
  };

  var computerPlayWrapper = function() {
    var row = whereToPlay('black', determinePossibleMoves, loopThroughPossibleMoves).row;
    var col = whereToPlay('black', determinePossibleMoves, loopThroughPossibleMoves).col;
    playAPiece(row, col);
  }

})