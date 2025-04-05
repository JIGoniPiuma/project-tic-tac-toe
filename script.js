//1.Crear el Gameboard (IIFE). El tablero debe representar un movimiento hecho (setMove), resetearse y debe estar disponible en todo momento para realizar
// comparaciones ( getBoard).

const Gameboard = (function () {
  let board = Array(9).fill("");

  const resetBoard = () => {
    board = Array(9).fill("");
  };

  const getBoard = () => {
    // trae el Board en el estado en el que esté
    return board;
  };

  // set move toma la posicion ( que luego vamos a definir con el CLICK y asigna el Symbol a esa posicion, si es que el Array[posicion está vacío])
  const setMove = (position, player) => {
    if (board[position] === "") {
      board[position] = player;
      return true; //se pudo efectuar el movimiento
    } else {
      return false; //no se pudo
    }
  };
  return { resetBoard, getBoard, setMove }; // estos son los valores publicos de Gameboard.
})();

// Creo la funcion Player que me permite crear "n" jugadores. Como voy a tener 2 jugadores, tengo 2 instancias de Player y por eso es una factory function
//y no una IIFE ( que solo sirve para instancias únicas.)

function createPlayer(symbol) {
  const getSymbol = () => {
    return symbol;
  };

  return { getSymbol };
}

let playerX = createPlayer("X");
let playerO = createPlayer("O");

const GameController = (function () {
  let currentPlayer = playerX;
  let gameOver = false;
  const winning_combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkWinner() {
    let board = Gameboard.getBoard();

    for (let combo of winning_combinations) {
      const [a, b, c] = combo;
      // el for let recorre cada elemento (llamado combo) en winning combinator.
      // Para cada elemento(Combo) hago una destructuración del mismo,
      // entonces para la primera iteración (por ejemplo): a=0,b=1,c=2.
      // si en la posicición a hay algo y si es lo mismo que en b y c para ALGUNO de los combos. Entonces hay un winner.
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        gameOver = true;
        return board[a];
      }
    }
    // si no hay una combinacion ganadora, me fijo si el tablero esta lleno. Si está lleno es un empate.
    if (!board.includes("")) {
      gameOver = true;
      return "Tie";
    }
    // si no hay winner y hay espacios vacíos en el tablero, sigue jugando.
    else {
      return false;
    }
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    return currentPlayer;
  }

  function makeMove(position) {
    if (!gameOver) {
      //si el juego no termino

      if (Gameboard.setMove(position, currentPlayer.getSymbol())) {
        //si el juego no termino y se puede colocar un simbolo en el tablero.

        let winner = checkWinner();

        if (winner === false) {
          // si esto no genero un ganador... gameoVer es FALSO y se cambia de jugador.
          switchPlayer();
        } else {
          gameOver = true;
        }
      }
    }
  }
  function resetGame() {
    gameOver = false;
    currentPlayer = playerX;
  }
  return { makeMove, checkWinner, switchPlayer, resetGame };
})();

const DisplayController = (function () {
  let cells = Array.from(document.querySelectorAll(".cell")); //me devuelve un nodelist que transformo a array.

  let messageElement = document.getElementById("message");

  const resetElementBoard = () => {
    Gameboard.resetBoard();
    GameController.resetGame();
    cells.forEach((cell) => {
      cell.innerHTML = "";
    });
    // Habilita los clicks nuevamente
    cells.forEach((cell) => {
      cell.style.pointerEvents = "auto";
    });
    messageElement.textContent = "";
    // Volvemos a asignar los event listeners
    play();
  };

  const showResult = (result) => {
    if (result === "Tie") {
      messageElement.textContent = "¡Es un empate!";
    } else {
      messageElement.textContent = `¡El ganador es ${result}!`;
    }
    // Deshabilitar más clicks
    cells.forEach((cell) => (cell.style.pointerEvents = "none"));
  };

  const play = () => {
    cells.forEach((cell, index) => {
      // para cada cell del array Cells, quiero que al hacerle Click (SE DIBUJE UN "SYMBOL" en el Tablero
      // y Se modifique el Array board)
      cell.addEventListener(
        "click",
        () => {
          GameController.makeMove(index);
          const symbol = document.createElement("div");
          symbol.className = "symbol";
          symbol.textContent = Gameboard.getBoard()[index];

          cell.innerHTML = ""; // Limpiar antes de agregar
          cell.appendChild(symbol);

          let winner = GameController.checkWinner();
          if (winner) {
            // Deshabilitar más clicks
            cells.forEach((c) => (c.style.pointerEvents = "none"));
            showResult(winner);
          }
        },
        { once: true }
      );
    });
  };
  resetButton.addEventListener("click", resetElementBoard);
  return { play, resetElementBoard, showResult };
})();

DisplayController.play();
