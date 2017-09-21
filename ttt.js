var oriBoard=[];
const  human = "O";
const AI = 'X';

const winCombo = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
];

const cells = document.querySelectorAll('.cell');

startGame();

function startGame(){
    document.querySelector(".endGame").style.display='none';
    oriBoard = Array.from(Array(9).keys());
    for (var i=0; i< cells.length; i++){
        cells[i].innerText = "";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square){
    if(typeof oriBoard[square.target.id] =='number'){
        turn(square.target.id, human);
    if(!checkTie()) turn(bestSpot(), AI);
    }
}

function turn(squareId, player){
    oriBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(oriBoard, player);
    if(gameWon) gameOver(gameWon)
    }

    function checkWin(board, player){
        let plays = board.reduce((a,e,i) => 
        (e === player) ? a.concat(i) : a, []);
        let gameWon = null;

        for (let [index, win] of winCombo.entries()){
            if(win.every(elem => plays.indexOf(elem) > -1)){
                gameWon = {index: index, player: player};
                break;
            }
        }
        return gameWon;
    }

    function gameOver(gameWon){
        for(let index of winCombos[gameWon.index]) {
            document.getElementById(index).style.backgroundColor = 
                gameWon.player == human ? 'blue' : 'red';
        }
        for(var i =0; i< cells.length; i++){
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner(gameWon.player == human ? 'You Win!' : 'You lose!')
    }

    function declareWinner(who){
        document.querySelector('.endGame').style.display = 'block';
        document.querySelector('.endGame .text').innerText = who;
    }

    function emptySquares(){
        return oriBoard.filter(s => typeof s == 'number')
    }

    function bestSpot(){
        return emptySquares()[0];
    }

    function checkTie(){
        if(emptySquares().length == 0){
            for(var i=0; i<cells.length; i++){
                cells[i].style.backgroundColor = "green";
                cells[i].removeEventListener('click', turnClick, false);
            }
            declareWinner('Tie Game!')
            return true;
        }
        return false;
    }

    function minimax(newBoard, player){
        var availableSpots = emptySquares(newBoard);

        if(checkWin(newBoard, player)){
            return {score: -10};
        } else if (checkWin(newBoard, AI)){
            return {score: 20};
        } else if (availableSpots.length === 0){
            return {score: 0};
        }

        var moves =[];
        for(var i=0; i< availableSpots.length; i++){
            var move={};
            move.index = newBoard[availableSpots[i]];
            newBoard[availableSpots[i]] = player;

            if(player== AI){
                var result = minimax(newBoard, human);
                move.score = result.score;
            } else {
                var result = minimax(newBoard, AI)
                    move.score = result.score;
            }

            newBoard[availableSpots[i]] = move.index;

            moves.push(move);
        }

        var bestMove;
        if(player === AI){
            var bestScore = -10000;
            for(var i =0; i<moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            var bestScore = 10000;
            for(var i=0; i<moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }