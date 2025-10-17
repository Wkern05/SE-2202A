let nextPlayer = 'X'; // takes a value of either 'X' or 'O' according to the game turns

//initalize the game by setting the value inside next-lbl to nextPlayer
//hint: you could use innerText for this 
document.querySelector("label").innerText = nextPlayer

//This call will create the buttons needed for the gameboard.
createGameBoard()

function createGameBoard()
{
    // Programatically add a button with square brackets enclosing an empty space to each cell in the gameboard
   
    for(cell of document.querySelectorAll("td")){
        let btn = document.createElement("button")
        btn.innerText = "[ ]"
        cell.appendChild(btn)
    }

    // Programatically add 'takeCell' as an event listener to all the buttons on the board
    let btns = document.querySelectorAll('button');

    for (let i=0; i<btns.length; i++)
    {
        /*
            Assign an event listener to each of the buttons in btns.
            The event to listen for should be 'click'. You will need to pass 
            the event to takeCell. Review the slides for the trick on how to ]
            pass a parameter.
        */
       btns[i].addEventListener("click", function(){takeCell(event)})
    }
}

// This function will be used to respond to a click event on any of the board buttons.
function takeCell(event)
{
    /*
        When the button is clicked, the space inside its square brackets is replaced by the value in the nextPlayer before switching it
    */
    let btn = event.target
    btn.innerText = "[" + nextPlayer + "]"

    nextPlayer = nextPlayer == "X" ? "O" : "X"
    document.querySelector("label").innerText = nextPlayer

    // Make sure the button is clickable only once (I didn't mention how to do that, look it up :) )
    btn.disabled = true

    // Check if the game is over
    if (isGameOver())
    {
        // let the label with the id 'game-over-lbl' display the words 'Game Over' inside <h1> element
        document.querySelector("#game-over-lbl").innerHTML = "<h1>Game Over</h1>"
    }

    // I'll leave declaring the winner for your intrinsic motivation, it's not required for this assignment 
    //win position combinations
    const wins = [[0,1,2],[3,4,5],[6,7,8],
                [0,3,6],[1,4,7],[2,5,8],
                [0,4,8],[2,4,6]]

    //get all button elements
    board = document.querySelectorAll('button');
    const p1 = "[X]", p2 = "[O]"//the two players as text

    for(win of wins){//cycle throught the win conditions, check if the current board matches a win condition
        if(board[win[0]].innerText == p1 && board[win[1]].innerText == p1 && board[win[2]].innerText == p1)
            console.log("X wins")
        if(board[win[0]].innerText == p2 && board[win[1]].innerText == p2 && board[win[2]].innerText == p2)
            console.log("O wins")
            
    }
}

function isGameOver()
{
    // This function returns true if all the buttons are disabled and false otherwise 
    for(button of document.querySelectorAll("button")){
        if (button.disabled == false)
            return false
    }
    return true
}