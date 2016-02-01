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

  var randomComputerNames = [
      { 'name': 'Skynet',
        'link': 'http://static.comicvine.com/uploads/original/1/18154/3876860-terminator-salvation-the-final-battle-5-cover.jpg'
      },
      { 'name': 'J.A.R.V.I.S',
        'link': 'http://vignette1.wikia.nocookie.net/shield-files/images/1/13/Avengers_Age_of_Ultron_KISSTHEMGOODBYE_NET_SCREENCAPS_1080p_0646_(1).jpg/revision/latest?cb=20151017235328'
      },
      { 'name': 'F.R.I.D.A.Y',
        'link': 'http://marvelcinematicuniverse.wikia.com/wiki/F.R.I.D.A.Y.'
      },
      { 'name': 'HAL',
        'link': 'https://d13yacurqjgara.cloudfront.net/users/75924/screenshots/916751/hal_1x.png'
      },
      { 'name': 'Gideon',
        'link': 'http://www.theflashfantr.com/wp-content/uploads/2015/05/the-flash-gideon.jpg'
      },
      { 'name': 'Oracle',
        'link': 'http://dcuniverseonline.wikia.com/wiki/Oracle'
      },
      { 'name': 'Ultron',
        'link': 'https://www.sideshowtoy.com/assets/products/200120-classic-ultron-on-throne/lg/200120-classic-ultron-on-throne-003.jpg'
      },
      { 'name': 'Joshua',
        'link': 'http://2new4.fjcdn.com/pictures/Shall+we+play+a+game+let+s+play+a+game+roll_f88afd_5628419.jpg'
      },
      {'name': 'Clu',
       'link': 'http://vignette2.wikia.nocookie.net/tron/images/9/9c/Clu_Program.png/revision/latest?cb=20130118203716'
      },
      {'name': 'C-3PO',
       'link': 'http://img.lum.dolimg.com/v1/images/image_bc196054.jpeg?region=0%2C0%2C1920%2C1080&width=768'
      }
  ]
  
  
  var numberOfRows = 6;
  var numberOfColumns = 7;

  var computerNameRandomNum;

  var winAt = 4;

  var playerTurn = true;
  // holder vars for player names
  var playerOneName;
  var playerTwoName;
  // Default flag to determine whether user should player computer or not
  var playAgainstComputer = false;

  // Adding click event to the checkbox for the user to choose to play against the computer
  $("#computer").click(function() {
    // If they click, call the player two AI and set play against computer flag to true
    if ($(this)[0].checked) {
      playAgainstComputer = true;
      $("#player-two").attr("readonly", true);
      computerNameRandomNum = Math.floor(Math.random()*randomComputerNames.length);
      var computerName = randomComputerNames[computerNameRandomNum].name;
      $("#player-two").val(computerName);
      playerTwoName = $("#player-two").val();
    } else {
      // Otherwise make sure play against computer is false
      playAgainstComputer = false;
      $("#player-two").attr("readonly", false);
    }
  })

  // Add Player names and 
  $("button.play-button").click(function() {
    // Remove last game
    localStorage.removeItem('connectFourGame');
    numberOfRows = null;
    numberOfColumns = null;
    winAt = null;
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
      // Remove last game
      localStorage.removeItem('connectFourGame');
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

  // Get player names function
  var getPlayerNames = function() {
    playerOneName = $("#player-one").val();
    playerTwoName = $("#player-two").val();
  };

  // Get the number of rows and columns based either on the user input or the stored game value
  var getNumberOfRowsAndColumns = function() {

    if (typeof numberOfRows === 'number'){
      numberOfRows = numberOfRows;
    } else if ($("#row-input").val() != '') {
      numberOfRows = parseInt($("#row-input").val());
    } else {
      numberOfRows = 6;
    };

    if (typeof numberOfColumns === 'number'){
      numberOfColumns = numberOfColumns;
    } else if ($("#column-input").val() != '') {
      numberOfColumns = parseInt($("#column-input").val());
    } else {
      numberOfColumns = 7;
    };

    if (typeof winAt === 'number'){
      winAt = winAt;
    } else if ($("#win-number-input").val() != '') {
      winAt = parseInt($("#win-number-input").val());
    } else {
      winAt = 4;
    };
  };

  // Functions for playing sounds when users click or clear the board
  var playSound = function() {
    var audio = document.getElementById("playsound");
    audio.play();
  };

  var playSoundTwo = function() {
    var audio = document.getElementById("playsound-two");
    audio.play();
  };

  var playSoundClear = function() {
    var audio = document.getElementById("playsound-three");
    audio.play();
  };

  // If there's a stored game, add a resume button with click functionality
  var resumeGameButton = function() {
    // Getting a locally stored game
    var storedGame = JSON.parse(localStorage.getItem('connectFourGame'));

    if (storedGame != null) {
      // Create button
      var $resumeButton = $("<button>").addClass("resume-button").html("Resume Last Game");
      // Append it
      $resumeButton.appendTo("#overlay");
      // On click remove the overlay
      $resumeButton.click(function() {
        $(this).siblings().fadeOut(200);
        $(this).parent().fadeOut(200);
        // And resume the game
        resumeGame();
      })
    };
  };

  // Function to make the board HTML el's
  var makeBoard = function() {
    // Determine how many rows and columns should be drawn
    // Setup the player names and scores
    var $scoreDiv = $("<div>").attr("id", "score");
    var $playerOneP = $("<p>").addClass("player-name").html("Red Player: ");
    var $playerTwoP = $("<p>").addClass("player-name").html("Black Player: ");
    var $pOneName = $("<span>").html(playerOneName);
    var $pTwoName = $("<span>").html("<a href='"+randomComputerNames[computerNameRandomNum].link+"'>"+playerTwoName+"</a>");
    var $playerOneScoreP = $("<p>").addClass("player-score").html("Red Wins: ");
    var $playerTwoScoreP = $("<p>").addClass("player-score").html("Black Wins: ");
    var $pOneScore = $("<span>").html(redWins);
    var $pTwoScore = $("<span>").html(blackWins);
    var $directions = $("<p>").html("<h2>To Play</h2>Hover over and/or click the column you wish to drop your piece into<p>P.S. If you're playing against the computer try and find the easter egg :)</p>")

    // Append HTML el's to the body
    $pOneName.appendTo($playerOneP);
    $pTwoName.appendTo($playerTwoP);
    $pOneScore.appendTo($playerOneScoreP);
    $pTwoScore.appendTo($playerTwoScoreP);
    $scoreDiv.append($playerOneP, $playerTwoP, $playerOneScoreP, $playerTwoScoreP)
    $scoreDiv.appendTo($body);
    $directions.appendTo($scoreDiv);
    $gameBoardContainer.appendTo($body);

    // Loop through and make rows. 
    for (var i = 0; i < numberOfRows + 1; i++) {
      // Create a row for players to click and drop their pieces
      if (i === 0) {
        // This first row is for the button that users click to drop game pieces
        var $row = $('<div>').attr('id', 'play-row').addClass('play-row');
      } else {
        // Create the normal game play rows
        var $row = $('<div>').attr({
          id: 'row' + i,
          row: i
        }).addClass('row');
      }
      // Loop through and make columns
      for (var j = 0; j < numberOfColumns; j++) {
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
          playSound();
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

          // If the user is playing the computer, call the function to have the computer move if there's 
          // No winner or tie after the last player move
          if (playAgainstComputer && !winner & !isTie(winner)) {
            setTimeout(computerPlayWrapper, 200);
          } else {
            // If the computer is not playing, store the game info
            storeGame();
          }

          // Break the loop since it doesn't need to keep playing up the empty spaces
          break;
        } else {
          // Doing the same thing for black. Doens't call AI move since user in that case is always red
          playSoundTwo();
          $cols.eq(i).html(' ');
          $cols.eq(i).addClass('black');
          var $colNum = parseInt($cols.eq(i).attr('col'));
          var $rowNum = parseInt($cols.eq(i).attr('row'));
          var colorPlayed = 'black';
          $header.html("It is " + playerOneName + "'s turn!");
          var winner = checkIfWinner($rowNum, $colNum, colorPlayed, checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative);
          isTie(winner);

          playerTurn = !playerTurn;
          // Store the game state after the player plays
          storeGame();
          break;
        }
      }; // end of if statement
    } // end of for loop
  };

  // Check horizontally for 4 in a row
  var checkHorizontal = function(row, col, color) {
    // Check the piece that was played
    var $piecePlayed = $("[row=" + row + "] [col=" + col + "]");
    // Some starter vars for use in the AI and to calculate if the 4 are blocked by an opposing piece
    // in one direction or the other
    horizontalCount = 1;
    blockHorizontal = 1;
    var blockedLeft = winAt;
    var blockedRight = winAt;

    checkRight = 1;
    checkLeft = -1;

    // Count up 3 possible places to the right
    while (checkRight < winAt) {
      // Game area to check
      var $pieceToCheck = $("[row=" + row + "] [col=" + (col + checkRight) + "]");
      // If it's blocked
      if (color === 'red' && $pieceToCheck.hasClass('black') || color === 'black' && $pieceToCheck.hasClass('red')) {
        // set blocked to how many over it was blocked by
        var blockedRight = checkRight;
        break;
        // Checks for empty spaces, and doesn't increment how many in a row there are
      } else if (color === 'red' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red') || color === 'black' && !$pieceToCheck.hasClass('black') && !$pieceToCheck.hasClass('red')) {
        horizontalCount = horizontalCount;
      } else {
        // Else it assume the pieces are matched and increments the horizontal count by 1
        horizontalCount += 1;
      }
      checkRight++;
    }

    while (checkLeft > -winAt) {
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

    // If this is blocked less than 3 spaces in all directions than there is no way this piece can
    // win. For exmaple in index 2 of [X,X,0,null,X,0] there is no way 0 can win horizontally since 
    // the most in a row it could get is 2. Therefore it is blocked and blockDirection = 0
    if (blockedRight < (winAt - 1) && blockedLeft > (-winAt + 1)) {
      blockHorizontal = 0;
    }

    // As long as it's not blocked, assign the direction count total to the count
    horizontalCount = horizontalCount * blockHorizontal;
    if (horizontalCount >= winAt) {
      // If there are 4 in a row, return true. Meaning that this piece is a winner
      return true;
    };
    // Else return false because they did not win going right
    return false;
  }; // end check horizontal

  // See the checkHorizontal function for comment on the logic, as this follows same logic
  var checkVertical = function(row, col, color) {
    var $piecePlayed = $("[row=" + row + "] [col=" + col + "]");
    verticalCount = 1;
    blockVertical = 1;
    var blockedUp = winAt;
    var blockedDown = winAt;
    checkDown = 1;
    checkUp = -1;

    while (checkDown < winAt) {
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
    while (checkUp > -winAt) {
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
    if (blockedDown < (winAt - 1) && blockedUp > (-winAt + 1)) {
      blockVertical = 0;
    }
    verticalCount = verticalCount * blockVertical;
    if (verticalCount >= winAt) {
      return true;
    };
    return false;
  };

  // See the checkHorizontal function for comment on the logic, as this follows same logic
  var checkDiagPositive = function(row, col, color) {
    var $piecePlayed = $("[row=" + row + "] [col=" + col + "]");
    diagonalCountPositive = 1;
    blockDiagonalPostive = 1;
    var blockedUpDiag = winAt;
    var blockedDownDiag = winAt;
    var blockedRightDiag = winAt;
    var blockedLeftDiag = winAt;
    checkDown = 1;
    checkUp = -1;
    checkRight = 1;
    checkLeft = -1;

    while (checkRight < winAt && checkUp > -winAt) {
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
    while (checkLeft > -winAt && checkDown < winAt) {
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
    if (blockedUpDiag < (winAt - 1) && blockedRightDiag > (-winAt + 1) || blockedDownDiag < (winAt - 1) && blockedLeftDiag > (-winAt + 1)) {
      blockDiagonalPostive = 0;
    }
    diagonalCountPositive = diagonalCountPositive * blockDiagonalPostive;
    if (diagonalCountPositive >= winAt) {
      return true;
    };
    return false;
  };

  // See the checkHorizontal function for comment on the logic, as this follows same logic
  var checkDiagNegative = function(row, col, color) {
    var $piecePlayed = $("[row=" + row + "] [col=" + col + "]");
    diagonalCountNegative = 1;
    blockDiagonalNegative = 1;
    var blockedUpDiagNeg = winAt;
    var blockedDownDiagNeg = winAt;
    var blockedRightDiagNeg = winAt;
    var blockedLeftDiagNeg = winAt;
    checkDown = 1;
    checkUp = -1;
    checkRight = 1;
    checkLeft = -1;

    while (checkLeft > -winAt && checkUp > -winAt) {
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
    while (checkRight < winAt && checkDown < winAt) {
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

    if (blockedUpDiagNeg < (winAt - 1) && blockedRightDiagNeg > (-winAt + 1) || blockedDownDiagNeg < (winAt - 1) && blockedLeftDiagNeg > (-winAt + 1)) {
      blockDiagonalNegative = 0;
    }
    diagonalCountNegative = diagonalCountNegative * blockDiagonalNegative;
    if (diagonalCountNegative >= winAt) {
      return true;
    };
    return false;
  };

  // Function for returning if someone one
  var checkIfWinner = function(row, col, color, callbackOne, callbackTwo, callbackThree, callbackFour) {
    // These callbacks are expecting the checkHorizontal, checkVertical, etc functions to be passed in
    var horizontal = callbackOne(row, col, color);
    var vertical = callbackTwo(row, col, color);
    var diagPos = callbackThree(row, col, color);
    var diagNeg = callbackFour(row, col, color);
    var $playRowButtons = $('.play-row .column');

    // Return true if one of the callbacks returns true
    if (horizontal || vertical || diagPos || diagNeg) {
      if (color === 'red') {
        // Add a win to red
        redWins += 1;
        // Set the header to let the user know someone won!
        $header.html('Congrats! ' + playerOneName + ' won!');
        // Display how many wins 'red' has
        $('.player-score span').eq(0).html(redWins);
        // Remove the click functions from the play buttons
        $playRowButtons.off("click");
        // Add in the play again and reset game buttons
        addPlayAgainResetButtons();
      } // end first if incrementing wins
      else {
        // Same logic that 'red' has
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



  // This is the same function as checkIfWinner, excpet it only return true/false and doesn't update the UI
  var checkIfWinnerWithoutPlaying = function(row, col, color, callbackOne, callbackTwo, callbackThree, callbackFour) {
    var horizontal = callbackOne(row, col, color);
    var vertical = callbackTwo(row, col, color);
    var diagPos = callbackThree(row, col, color);
    var diagNeg = callbackFour(row, col, color);
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


  // Function to check if there is a tie. Expecting the value from checkIfWinner function to be passed in
  var isTie = function(isWinner) {
    // Get the length of number of piece played
    var playerPlays = $('.red').length + $('.black').length;
    // Determine how many total columns there are
    var columns = $('.column').length - $('.play-row .column').length;
    var $playRowButtons = $('.play-row .column');

    // If the pieces played and the total number of columns are equal and there is no winner then there is a tie
    if (playerPlays === columns && isWinner === false) {
      // Update UI
      $header.html('Womp Womp There Was A Tie...');
      // Increment ties score (though not being used anywhere)
      ties += 1;
      // Remove click functions
      $playRowButtons.off("click");
      // Add play again and reset buttons
      addPlayAgainResetButtons();
      // Return true for tie
      return true;
    };
    // Otherwise false
    return false;
  };

  // Wrapper funciton for initial game play setup
  var initialGameSetup = function() {
    getNumberOfRowsAndColumns();
    makeBoard();
    setStyles();
    setDropSquaresClick();
  };

  // Reset the board without resetting the score
  var playAgain = function() {
    // Remove old info
    playSoundClear();
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
    playSoundClear();
    // Set all scores back to 0
    redWins = 0;
    blackWins = 0;
    ties = 0;
    winAt = null;

    // Make the overlay visible again. The overlay makes the play button which intiates the intial game setup
    // so we don't need to call that funciton here anymore. Also removes the jquery added styles
    $("#overlay").removeAttr("style");
    $("#overlay").children().removeAttr("style");
    // Updates the play against computer button to not clicked. Needed because if you play against the computer
    // and reset the game, the button was checked and you wouldn't be able to enter in a player two name
    $("#computer").attr('checked', false);
    $(".resume-button").remove()
      // Reset play against computer to default choice
    playAgainstComputer = false;

    // Remove the old gameplay and scoreboard
    $gameBoardContainer.remove();
    $('#score').remove();
    $("#win-number-input").val('');
    $("#column-input").val('');
    $("#row-input").val('');
    // Create some new vars
    $gameBoardContainer = $('<div>').attr('id', 'game-board-container').addClass('board');
    $playRowButtons = $('.play-row .column');
    playerTurn = true;
    // Resetting the header text
    $header = $('.game-header').html("It is " + playerOneName + "'s turn!");
    // Append HTML el's to the body
    $gameBoardContainer.appendTo($body);
    // Add a resume game function if approprate
    resumeGameButton();
  };

  var addPlayAgainResetButtons = function() {
    var $playAgainButton = $("<button>").attr("id", "play-again").html("Play Again");
    var $resetButton = $("<button>").attr("id", "reset-button").html("Reset Game");

    $playAgainButton.click(playAgain);
    $resetButton.click(resetGame);

    $("#score").append($playAgainButton, $resetButton);
  };


  // just abstracting out some code I've repeated a bunch for get col's and rows
  var getColRow = function(col, row) {
    return $("[col=" + col + "]" + "[row=" + row + "]");
  };

  // Function to determine where x color should play. Expecting a string value
  var determinePossibleMoves = function(color) {
    // Determine how many rows and columns should be drawn
    getNumberOfRowsAndColumns();
    // var numberOfColumns = numberOfColumns;
    // var numberOfRows = numberOfRows;
    var potentialMoves = [];

    // Loop through the rows and columns
    for (var c = 0; c < numberOfColumns; c++) {
      for (var r = numberOfRows; r > 0; r--) {

        // If the square is empoty
        if (getColRow(c, r).html() === '') {

          // Add the class so that I can check if that spot would win
          $("[col=" + c + "]" + "[row=" + r + "]").addClass(color);

          // Running this function. It returns true if there's a winner, but I'm really using it to increment the counts
          // The counts determine how many tiles could be matched. For example, going 4 up if the tile being checked and 3 up was another
          // equal tile, but the middle two were empty, the count for checkUp would be 2. 
          checkIfWinnerWithoutPlaying(r, c, color, checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative);

          // I then add each count together to get a "Total Count" for each possible square. The higher the score the more options/closer
          // that square is to winning
          var totalCount = horizontalCount + verticalCount + diagonalCountPositive + diagonalCountNegative;

          // Pushes the position being checked into an array with the total
          potentialMoves.push([c, r, totalCount]);

          // Removing the class so it doesn't accidentally get played
          $("[col=" + c + "]" + "[row=" + r + "]").removeClass(color);

          // Break the nested loop so it goes onto the next column
          break;
        }; // End if loop
      }; // Close row for loop
    }; // Close column for loop
    return potentialMoves;
  }; // Close function

  // This function is for looping through the array of possible moves and determining the best of those moves.
  // This function could be used as well to block an opposing move
  var loopThroughPossibleMoves = function(a, color) {
    // Set a baseline to compare against. So it says the first possible move is "the best" unless another comes along
    // to provide a better score and beat it. 
    var col = a[0][0];
    var row = a[0][1];
    var count = a[0][2];

    // Loop through the array
    for (var i = 0; i < a.length; i++) {
      // Add the class to the location it's on so that...
      $("[col=" + a[i][0] + "]" + "[row=" + a[i][1] + "]").addClass(color);

      // If the location being checked would win
      if (checkIfWinnerWithoutPlaying(a[i][1], a[i][0], color, checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative)) {
        $("[col=" + a[i][0] + "]" + "[row=" + a[i][1] + "]").removeClass(color);
        // Return the position of the winning squre and that it's true that it would win
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

  // Function to determine if the AI needs to block or if it can play it's own place
  // Right now this is only called like so: whereToPlay('black',determinePossibleMoves,loopThroughPossibleMoves)
  // but it could in theory be called for 'red' if we wanted to make the AI the black piece at some point
  var whereToPlay = function(color, callbackOne, callbackTwo) {
    // Get the possible moves for the color being passed in
    var possibleMoves = callbackOne(color);
    // Determine the best spot for red and black
    var redMove = callbackTwo(possibleMoves, 'red');
    var blackMove = callbackTwo(possibleMoves, 'black')

    // This part would need to be tweaked some if we wanted either red or black to play as the AI
    // If black would win on it's move, play return it
    if (color === 'black' && blackMove.wins) {
      return blackMove;
    }
    // Else if black needs to block the red move, return the red move
    else if (color === 'black' && redMove.wins) {
      return redMove
    }
    // If red can win, return the red move
    else if (color === 'red' && redMove.wins) {
      return redMove;
    }
    // Or finally, if the color is black (and no one can win), call the smart AI function to determine where to play
    else if (color === 'black') {
      // This tries to smartly play
      return smartAI('black');
    }
    // Else return the red move
    else {
      return redMove;
    };
  };

  // Function to play a piece. Follows basically the same logic as the ealier logic
  var playAPiece = function(row, column) {
    var $piece = $("[col=" + column + "]" + "[row=" + row + "]")
    if (playerTurn) {
      playSoundTwo();
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
      playSoundTwo();
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
    };
    // Example playAPiece(whereToPlay('black',determinePossibleMoves,loopThroughPossibleMoves).row,whereToPlay('black',determinePossibleMoves,loopThroughPossibleMoves).col)
  };

  var playPieceWithoutCheckTurn = function(row, column, color) {
    var $piece = $("[col=" + column + "]" + "[row=" + row + "]");
    $piece.html(' ');
    $piece.addClass(color);
    var winner = checkIfWinner(row, column, color, checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative);
    isTie(winner);
  };

  var determineBestMove = function(a, color) {
    // Generate a holder array
    var potentionalNextMoves = {
      'potentialNextMoves': [],
      'potentialThisMoves': [a]
    };
    for (var i = 0; i < a.length; i++) {
      // Add the class to the location it's on so that we can test the next set of possible moves
      $("[col=" + a[i][0] + "]" + "[row=" + a[i][1] + "]").addClass(color);
      // Determine the possible moves should the color play in that place
      p = {
        'move': i,
        'potentialMoves': determinePossibleMoves('red')
      };
      // Push that info to the object
      potentionalNextMoves.potentialNextMoves.push(p);
      // And remove the class so it can go onto the next potention play
      $("[col=" + a[i][0] + "]" + "[row=" + a[i][1] + "]").removeClass(color);
    };
    // Return all those moves
    return potentionalNextMoves;
  };

  var determineBestOpposingMoves = function(bm) {
    // Set a default position to compare against
    var count = bm.potentialNextMoves[0].potentialMoves[0][2];
    var position = 0;
    var arrayOfMoves = [];

    for (var m = 0; m < bm.potentialNextMoves.length; m++) {
      // Set the move number of black so we know which potential black move this would be
      position = bm.potentialNextMoves[m].move;
      // Set the count/score
      count = bm.potentialNextMoves[m].potentialMoves[0][2];

      // Loop through the potential red moves and see if there'd be a better move 
      // for it if black played in this position
      for (var s = 0; s < bm.potentialNextMoves[m].potentialMoves.length; s++) {
        compareScore = bm.potentialNextMoves[m].potentialMoves[s][2]
          // If there is, set the score to that score
        if (compareScore > count) {
          count = compareScore
        };
      };
      // Push this info to it an array and then the super array
      var a = [position, count];
      arrayOfMoves.push(a);
    };
    return arrayOfMoves;
  };

  var smartAI = function(color) {
    var pm = determinePossibleMoves(color);
    var bm = determineBestMove(pm, color);
    var bo = determineBestOpposingMoves(bm);
    // Set the default value
    var position = 0;
    var count = bo[0][1];
    var score = bo[0][1];

    // Loop through the scores for red (ie. if the color passed in here is black)
    // and determine which is the worst score for red 
    for (var i = 0; i < bo.length; i++) {
      if (bo[i][1] < count) {
        position = i;
        count = bo[i][1];
      };
    };

    // After looping through the red play and gettin the lowest value, get the black
    // Move that corresponds to that value and set it as the play position
    var play = bm.potentialThisMoves[0][position];

    // Then return the position in the same format as its being return elsewhere so I don't have
    // to rewrite a bunch of code in other places...
    return {
      'row': play[1],
      'col': play[0],
      // Wins is set to false by defualt because the computer move function checks winners before running the smart AI
      'wins': false
    };
  };

  // Wrapper for the AI that says where to play and then plays the move
  var computerPlayWrapper = function() {
    var row = whereToPlay('black', determinePossibleMoves, loopThroughPossibleMoves).row;
    var col = whereToPlay('black', determinePossibleMoves, loopThroughPossibleMoves).col;
    playAPiece(row, col);
    // Store game after the computer moves
    storeGame();
  };

  var storeGame = function() {
    // Get the game pieces
    var $gamePieces = $('.row .column');
    // Set some regex values
    var redClass = /red/;
    var blackClass = /black/;
    // Set a holder for the local storage, with information about the game type as well
    var storageVar = {
      'pieces': [],
      'playerTurn': playerTurn,
      'playAgainstComputer': playAgainstComputer,
      'playerOneName': playerOneName,
      'playerTwoName': playerTwoName,
      'redWins': redWins,
      'blackWins': blackWins,
      'ties': ties,
      'numberOfColumns': numberOfColumns,
      'numberOfRows': numberOfRows,
      'winAt': winAt
    };

    // Loop through the game pieces
    $gamePieces.each(function() {
      var row = parseInt($(this).attr("row"));
      var col = parseInt($(this).attr("col"));
      var classes = $(this).attr("class");
      // Check if they are red or black played
      var myArrayRed = classes.match(redClass);
      var myArrayBlack = classes.match(blackClass);

      // If they are played
      if (myArrayRed != undefined) {
        // Set the information about that piece, where it was played, and if the game ended on that pay
        var piece = {
            'row': row,
            'col': col,
            'color': 'red',
            'gameOver': checkIfWinnerWithoutPlaying(row, col, 'red', checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative)
          }
          // Push it to the storage holder
        storageVar.pieces.push(piece);
      } else if (myArrayBlack != undefined) {
        var piece = {
          'row': row,
          'col': col,
          'color': 'black',
          'gameOver': checkIfWinnerWithoutPlaying(row, col, 'black', checkHorizontal, checkVertical, checkDiagPositive, checkDiagNegative)
        }
        storageVar.pieces.push(piece);
      };
    });
    // Convert the holder into JSON so it can be stored properly
    var storeValue = JSON.stringify(storageVar);
    // Set the item in local storage
    localStorage.setItem('connectFourGame', storeValue);
  };

  var resumeGame = function() {
    // Get the local storage by the key
    var storedGame = JSON.parse(localStorage.getItem('connectFourGame'));
    // If a game exists
    if (storedGame != null) {
      // Set the game conditions
      playerOneName = storedGame.playerOneName;
      playerTwoName = storedGame.playerTwoName;
      playerTurn = storedGame.playerTurn;
      redWins = storedGame.redWins;
      blackWins = storedGame.blackWins;
      ties = storedGame.ties;
      numberOfRows = storedGame.numberOfRows;
      numberOfColumns = storedGame.numberOfColumns;
      playAgainstComputer = storedGame.playAgainstComputer;
      winAt = storedGame.winAt;
      // Say game over false by defualt, may change later
      var gameOver = false;
      // Call the initial game board setup functions
      makeBoard();
      setStyles();
      setDropSquaresClick();
      // Loop through the pieces
      for (var i = 0; i < storedGame.pieces.length; i++) {
        var row = storedGame.pieces[i].row;
        var column = storedGame.pieces[i].col;
        var color = storedGame.pieces[i].color;
        // play the pieces without checking the turn
        playPieceWithoutCheckTurn(row, column, color);
        // If the game way over on that piece, set the game over to true
        if (storedGame.pieces[i].gameOver === true) {
          gameOver = true;
        };
      }; // End for loop

      // Need to do this again because when looping through the pieces it updates the score if there's a winner
      // which we don't really want. More effecient to just do it again here as opposed to changing the function because
      // that function is called in a bunch of different place. Ideally that function would be refactored with more time
      redWins = storedGame.redWins;
      blackWins = storedGame.blackWins;
      ties = storedGame.ties;
      $('.player-score span').eq(0).html(redWins);
      $('.player-score span').eq(1).html(blackWins);

      // Set the header properly if the game isn't over
      if (playerTurn && !gameOver) {
        $header.html("It is " + playerOneName + "'s turn!");
      } else if (!playerTurn && !gameOver) {
        $header.html("It is " + playerTwoName + "'s turn!");
      };
    };
  };

  resumeGameButton();
})