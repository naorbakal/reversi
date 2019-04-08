
/*
var checkUpLeft = -101;
var checkUp = -100;
var checkUpRight = -99;
var checkLeft = -1;
var checkRight = 1;
var checkDownLeft = 99;
var checkDown = 100;
var checkDownRight = 101;
*/


var currentPossibleMoves; 
var player1 = new Player(1);
var player2 = new Player(2);
var boardSize = 8;
var board = new Board(boardSize);
var currentPlayer = player1;

startGame();

function startGame(){
    currentPossibleMoves = findPossibleMove();
    currentPlayer.setStartTurn();
}
    


function findPossibleMove()
{
    var counterID = 0;
    var cell;
    var PossibleMovesIDs = new Array();
    for (var i=0; i<board.size; i++){
        for(var j=0; j<board.size; j++){
            cell = document.getElementById(counterID);
            counterID++;
            if(!isCellOccupied(cell)){ 
                if(PossibleMove(cell)){
                    PossibleMovesIDs.push(cell.getAttribute("id"));
                }
            }           
        }
    }
    return PossibleMovesIDs;
    
}

function isCellOccupied(cell){
     
    if(cell !== null){
        if(cell.querySelector(".circlePlayer1")!== null || cell.querySelector(".circlePlayer2")!== null){
        //console.log(cell.querySelector(".circlePlayer1")!= null || cell.querySelector(".circlePlayer2")!= null);
        //console.log(cell);
        return true;
        }
        return false;
    }
    console.log("bug!!!");
    return true;
    
}

function PossibleMove(cell){
    var currentCell;
    var cellID = parseInt(cell.getAttribute("id"));
    var checksArray = [-(board.size+1),-(board.size),-(board.size-1),-1,1,(board.size+1),(board.size),(board.size-1)];

    for (var i=0;  i<checksArray.length; i++){
        //console.log(cellID + parseInt(item));
        currentCell = document.getElementById(cellID + checksArray[i]);
        if(currentCell !== null){         
            if(isCellOccupied(currentCell)){                   
                return true;
            }
        }
    }
    return false;
}


function Player(playerNumber) {
    this.panel = document.querySelector(".playerPanel" + playerNumber);
    this.score = document.querySelector("#scorePlayer" + playerNumber).textContent;
    var playerAverageStatsEl = document.querySelector(".player"+playerNumber+"AverageStats");
    this.averagePlayTime = playerAverageStatsEl.querySelector(".statsContent");
    var playerElement = document.querySelector(".playerPanel" + playerNumber);
    this.riskAmount = playerElement.querySelector(".playerRiskStats").textContent;
    this.numberOfTurns = 0;
    this.NO = playerNumber;
    this.turnTimeArray = new Array();
    this.timeStart;

    this.setStartTurn = function() {
        this.timeStart = new Date().getTime();
    }

    this.setEndTurn = function() {
        var turnTimeSec = (new Date().getTime() - this.timeStart) / 1000;
        this.turnTimeArray.push(turnTimeSec);
    }

    this.getAvgTimeTurn = function() {
        var sum = 0;
        var res;
        for(var i = 0; i < this.turnTimeArray.length; i++) {
            sum += this.turnTimeArray[i];
        }
        res = (sum / this.turnTimeArray.length).toFixed(2);
        this.averagePlayTime.innerHTML = res;
    }
}

function handleMouseOverCellEvent() {
    var id = (event.currentTarget).getAttribute("id");
    if(!currentPossibleMoves.includes(id) && !isCellOccupied(document.getElementById(id)))
    {
        (event.target).style.backgroundColor = "red";
    }
}

function handleMouseOutCellEvent() {
    var id = (event.currentTarget).getAttribute("id");
    if(!currentPossibleMoves.includes(id) && !isCellOccupied(document.getElementById(id)))
    {
        (event.target).style.backgroundColor = "green";
    }

}

function handleClickCellEvent() {
    var id = (event.currentTarget).getAttribute("id");
    var p =  (event.currentTarget).firstElementChild;

    if(currentPossibleMoves.includes(id))
    {
        currentPlayer.setEndTurn();
        p.classList.add("circlePlayer" + currentPlayer.NO);
        updatePlayerStats();
        switchPlayer();
        currentPossibleMoves = findPossibleMove();
    }
}

function createMainBoard(size) { 
    var table = "";
    var counterID = 0;
    for(var i=0; i<size; i++){
        
       table += "</tr\n>"; 

        for (var j=0; j<size; j++){

            table += "<td id="+ counterID + " onmouseover=handleMouseOverCellEvent() onmouseout=handleMouseOutCellEvent() onclick=handleClickCellEvent() class = gameSquare >" 
            counterID++;
            if((i === size/2 || i === (size/2) - 1) && (j === size/2 || j === (size/2) - 1)){
                if((i === size/2 && j === (size/2) - 1 ) ||(i === size/2 -1 && j === (size/2))){
                    table += "\n<p class =\"gameCircle circlePlayer1\"> </p>\n";
                }
                else{
                    table += "\n<p class =\"gameCircle circlePlayer2\"> </p>\n";
                }
            }
            else{
                table += "\n<p class = gameCircle> </p>\n";
            }
           table += "</td\n>";
            
        }
        table += "</tr\n>";
    }

    document.querySelector("#mainBoard").innerHTML = table;
}


function Board(size){
    createMainBoard(size);

    this.board = document.querySelector("#mainBoard");
    this.size = size;
}

function switchPlayer(){
    currentPlayer.numberOfTurns++;
    if(currentPlayer.NO === 1){
        currentPlayer = player2;
    }
    else {
        currentPlayer = player1;
    }
    player1.panel.classList.toggle("active");
    player2.panel.classList.toggle("active");
    currentPlayer.setStartTurn();
}

function updatePlayerStats()
{
    updateAvgTurnTime();
}

function updateAvgTurnTime()
{  
    currentPlayer.getAvgTimeTurn();
    /*
    var activePlayer = document.querySelector(".active");
    var avg = activePlayer.querySelector(".player" + currentPlayer.NO + "AverageStats");
    var content = avg.querySelector(".statsContent");
    */

}   