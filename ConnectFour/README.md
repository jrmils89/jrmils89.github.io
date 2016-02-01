[Actual Game](jrmils89.github.io/ConnectFour/ConnectFourIndex.html)

# Tech Used
* Javascript / JQuery
* CSS
* HTML

# Game Play
There are two options for game play

### User versus User
This is the typical game play of connect four. One user plays another user until one player wins or there is a tie

### User Versus AI
The user also has an option for playing against an AI/Computer player. The computer player plays using a rudimentary version of the minimax alogorithim (it's easy to beat). The AI makes it choice based on the following criteria

1. Determines if it needs to play a blocking move, if so, it will block your winning move. 
2. If no blocking need is detected, it searches one level of it's possible moves
3. After determining the state of the game and possible moves, it checks the following possible scores for red and tries to minimize the score for red.
4. If multiple equal scores are found, it plays the first one it finds.
5. This is a very rudimentary version of minimax algorithim, which would
  * Determine the state of the board
  * Determine the optimal possible move based on a a series of next moves
  * And play in it's optimal location

Minimax Alogorithim was chosen based on the fact that it is optimal for zero sum games where the state up until that point it known and the inputs are rudimentary. Exmaples of games where this is a good approach are games such as tic-tac-toe and Go (in addition to Connect Four). Sub-optimal games for minimax are games such as Rock-Paper-Scissors.

Upsides of the minimax alogorithim is that it is very good at determining the optimal move. The downside is that it is memory and computationally very intensive. It is recommended that alpha-beta pruning is implemented along with possibly limiting the depth of nodes explored. 

Some resources explored for the Minimax Alogorithim and Alpha-Beta Pruning were here:

[Minimax](https://www.youtube.com/watch?v=6ELUvkSkCts)

[Alpha-Beta](https://www.youtube.com/watch?v=xBXHtz4Gbdo)

[Minimax & Alpha-Beta Psuedo Code From Swarthmore](https://www.cs.swarthmore.edu/~meeden/cs63/f05/minimax.html)

# Other Features
### Local Storage
The game after every move stores the game state in the browsers local storage. Upon loading of the game it will check for a previously played game and display to the user an option to resume their previous game. Local Storage was chosen over session storage so that the user could close their browser and still resume gameplay. The previously stored game is wiped out when the user chooses to play a new game. It remains stored when the user hits Play Again or Reset Game after a single game is finished.
### Play Again / Reset Game
When a game is completed, user has the option to either play again (using the same two players) or to reset the game which will allow the user to set new names and have the scores reset to zero.
### Sounds
There are few sounds. Two types of play sounds, and one type of sound for when the board is cleared. These get triggered when a piece is either played, or if the play again / reset game button are hit.
#Future Improvement
1. Improved AI
	* While the AI is at least making a judgement as to where to play based on more than just randomness, if there was more time it could be heavily optimized. It does no pruning and only checks one possible move for the opposing color. 
2. Un-hardcoding the AI color
	* Right now the AI is hardcoded as black, but ideally it would allow the user to choose whichever color they preferred
3. Remote play
	* Ability to play against more than just a local user or an AI.
4. General UI Improvement
	* Sites can nearly always be improved visually. Pretty happy with where it is currently, but there's a few minor improvements that could be made


# Usage
+ The checkboard pieces come from this app https://play.google.com/store/apps/details?id=com.thaicheckers
+ Other Icons Retrieved From www.uxrepo.com
+ Sounds are licensed free (with credit) from http://www.freesfx.co.uk/
