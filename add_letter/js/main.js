document.addEventListener("DOMContentLoaded", () =>{

    createSquares();

    const guessedWords = [[]];

    const keys = document.querySelectorAll('.keyboard-row button');

    for (let i = 0; i < keys.length; i++){
        keys[i].onclick = ({ target }) => {
            const key = target.getAttribute('data-key');

            console.log(key);
        }
    }

    function updateGuessedWords(letter) {

    }
    
    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let i = 0; i < 12; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("id", i+1);
            gameBoard.appendChild(square);
        }
    }
})