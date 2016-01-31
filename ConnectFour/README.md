# Game Play
There are two options for game play

### User versus User
This is the typical game play of connect four. One user plays another user until one player wins or there is a tie

### User Versus AI
The user also has an option for playing against an AI/Computer player. The computer player plays using a rudimentary version of the minimax alogorithim (it's easy to beat). The AI makes it choice based on the following criteria

1. Determines if it needs to play a blocking move, if so, it will block your winning move. 
2. If no blocking need is detected, it searches one level of it's possible moves
3. After determining the state of the game and possible moves, it assigns each possible move a score based on how likely/how many
in a row it can have while not being blocked by an opposing piece.
4. It then plays in that slot. If there are multiple spaces with the same score, it plays the first one it finds.
5. This is a very rudimentary version of minimax algorithim, which would
  * Determine the state of the board
  * Determine the optimal possible move based on a a series of next moves
  * And play in it's optimal location

Minimax Alogorithim was chosen based on the fact that it is optimal for zero sum games where the state up until that point it known and the inputs are rudimentary. Exmaples of games where this is a good approach are games such as tic-tac-toe and Go (in addition to Connect Four). Sub-optimal games for minimax are games such as Rock-Paper-Scissors.

Upsides of the minimax alogorithim is that it is very good at determining the optimal move. The downside is that it is memory and computationally very intensive. It is recommended that alpha-beta pruning is implemented along with possibly limiting the depth of nodes explored. 

Some resources for exploring the Minimax Alogorithim and Alpha-Beta Pruning are here:
[Minimax](https://www.youtube.com/watch?v=6ELUvkSkCts)
[Alpha-Beta](https://www.youtube.com/watch?v=xBXHtz4Gbdo)
[Minimax & Alpha-Beta Psuedo Code From Swarthmore](https://www.cs.swarthmore.edu/~meeden/cs63/f05/minimax.html)

# Other Features
### Local Storage
The game after every move stores the game state in the browsers local storage. Upon loading of the game it will check for a previously played game and display to the user an option to resume their previous game. Local Storage was chosen over session storage so that the user could close their browser and still resume gameplay. The previously stored game is wiped out when the user chooses to play a new game. It remains stored when the user hits Play Again or Reset Game after a single game is finished.


# Usage
+ The checkboard pieces come from this app https://play.google.com/store/apps/details?id=com.thaicheckers
+ Other Icons Retrieved From www.uxrepo.com
