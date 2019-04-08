
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


console.log(player1);
console.log(player2);
currentPossibleMoves = findPossibleMove();

function startGame(){
    
}


function findPossibleMove()
{
    var counterID = 0;
    var cell;
    var PossibleMovesIDs = new Array();
    for (var i=0; i<board.size; i++){
        for(var j=0; j<board.size; j++){
            cell = document.getElementById(counterID);
            //console.log(cell);
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
    this.averagePlayTime = playerAverageStatsEl.querySelector(".statsContent").textContent;
    var playerElement = document.querySelector(".playerPanel" + playerNumber);
    this.riskAmount = playerElement.querySelector(".playerRiskStats").textContent;
    this.numberOfTurns = 0;
    this.NO = playerNumber;
}

function handleMouseOverCellEvent() {
    //console.log(currentPossibleMoves);
    var id = (event.currentTarget).getAttribute("id");
    if(!currentPossibleMoves.includes(id) && !isCellOccupied(document.getElementById(id)))
    {
        //console.log(id);
        (event.target).style.backgroundColor = "red";
    }
}

function handleMouseOutCellEvent() {
    var id = (event.currentTarget).getAttribute("id");
    if(!currentPossibleMoves.includes(id) && !isCellOccupied(document.getElementById(id)))
    {
        //console.log(id);
        (event.target).style.backgroundColor = "green";
    }
}

function handleClickCellEvent() {
    var id = (event.currentTarget).getAttribute("id");
    var p =  (event.currentTarget).firstElementChild;
    var cellsToFlip;
    if(currentPossibleMoves.includes(id))
    {
        p.classList.add("circlePlayer" + currentPlayer.NO);
        currentPlayer.numberOfTurns++;
        cellsToFlip = checkClosingMove(event.currentTarget);
        console.log(cellsToFlip);
        if(cellsToFlip != null){

        }
        
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

            table += "<td id="+ counterID +" data-rows="+i+" data-cols="+j+" onmouseover=handleMouseOverCellEvent() onmouseout=handleMouseOutCellEvent() onclick=handleClickCellEvent() class = gameSquare >" 
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
    this.updateBoard = (cell)=>{

        checkClosingUp(this.board,cell,direction);
        checkClosingDown();        
    }
       
}

function checkClosingMove(cell){
    
    var newCellId;
    var currentPoint = {
        row:cell.dataset.rows,
        col:cell.dataset.cols
    }
    var cellToCheck;
    var sawOpponenetCell = false;
    var commitCells;
    var cellsToUpdate = new Array();
    var tempCells = new Array();
    for(var i=0;i<8;i++)
    {
        for (var j =0; j<board.size ;j++)
        {
            getNextCellToCheck(i,currentPoint);
            newCellId = calculateIdFromRowsAndCols(currentPoint);
            cellToCheck = document.getElementById(newCellId);
            if(cellToCheck == null){
                break;
            }

            if(isCellOccupied(cellToCheck))
            {
                if(!sawOpponenetCell && cellToCheck.querySelector(".circlePlayer"+currentPlayer.NO) == null)
                {
                    sawOpponenetCell = true;
                    tempCells.push(cellToCheck.getAttribute("id"));
                }
                else if(sawOpponenetCell && cellToCheck.querySelector(".circlePlayer"+currentPlayer.NO) == null)
                {
                    tempCells.push(cellToCheck.getAttribute("id"));
                }
                else if(sawOpponenetCell && cellToCheck.querySelector(".circlePlayer"+currentPlayer.NO) != null){
                    commitCells=true;
                }
            }
            if(commitCells === true){
                cellsToUpdate.push(...tempCells);
            }      
        }
        tempCells = new Array();
    }
    return (cellsToUpdate.length !== 0 ? cellsToUpdate:null);
}

function calculateIdFromRowsAndCols(point){
    var row = point.row;
    var col = point.col;

    return (board.size*row)+col;
}

function getNextCellToCheck(flag,lastCall){

    if(flag === 0) {    //checking up
        lastCall.row--;
    }
   else  if(flag === 1){ //checking upLeft
        lastCall.row--;
        lastCall.col--;
    }
   else  if(flag ===2){ //checking upRight
        lastCall.row--;
        lastCall.col++;
    }
   else if(flag === 3){ //checking down
        lastCall.row++;
    }
   else  if(flag === 4){ //checking downLeft
        lastCall.row++;
        lastCall.col--;
    }
   else if(flag === 5){ //checking upRight
        lastCall.row++;
        lastCall.col++;
    }
   else if(flag === 6){ //checking left
        lastCall.col--;
    }
    else { //checking right
        lastCall.col++;
    }
}

function switchPlayer(){
    if(currentPlayer.NO === 1){
        currentPlayer = player2;
    }
    else {
        currentPlayer = player1;
    }
    player1.panel.classList.toggle("active");
    player2.panel.classList.toggle("active");
}

