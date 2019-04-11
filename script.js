var currentPossibleMoves; 
var player1;
var player2; 
var board;
var currentPlayer;

function startGame(){
    getGameDetails();
    currentPossibleMoves = findPossibleMove();
    currentPlayer.setStartTurn();
}  

function getGameDetails()
{
    var player1Name = document.querySelector("#playerName1");
    var player2Name = document.querySelector("#playerName2");

    if(player1Name.value === ""){
        player1Name = "Player 1";
    }
    else{
        player1Name = player1Name.value;
    }
    if(player2Name.value === ""){
        player2Name = "Player 2";
    }
    else{
        player2Name = player2Name.value;
    }

    var size = parseInt(document.querySelector('input[name="boardSize"]:checked').value);
    initGame(player1Name, player2Name, size);
}

function handleCountineClickButton(){
    player1.totalTurnTime.concat(player1.turnTimeArray);
    player2.totalTurnTime.concat(player2.turnTimeArray);
    resetGame();
    document.querySelector("#popupEnd").classList.toggle("hidden");
}

function resetGame(){
    deleteBoard();
    board = new Board(board.size);
    player1.scoreElement.innerHTML = 2;
    player2.scoreElement.innerHTML = 2;

    player1.score = 2;
    player2.score = 2;

    player1.averagePlayTime.innerHTML = "";
    player2.averagePlayTime.innerHTML = "";

    player1.turnTimeArray = [];
    player2.turnTimeArray = [];

    player1.riskAmount.innerHTML = 1;
    player2.riskAmount.innerHTML = 1;

    currentPlayer = player1;

    currentPossibleMoves = findPossibleMove();
    currentPlayer.setStartTurn();

}

function handleStartNewGameClickButton(){
    deleteBoard();
    document.querySelector("#popupEnd").classList.toggle("hidden");
    document.querySelector("#popup").classList.toggle("hidden");
    document.querySelector("#game").classList.toggle("hidden");
    
}

function deleteBoard(){
    var table = document.querySelector("#mainBoard");
    table.innerHTML = "";
}


function initGame(player1Name, player2Name, size) {
    player1 = new Player(1,player1Name);
    player2 = new Player(2,player2Name);
    board = new Board(size);
    document.querySelector("#popup").classList.toggle("hidden");
    document.querySelector("#game").classList.toggle("hidden");
    document.querySelector(".playerPanel1").querySelector(".trainerCheckBox").addEventListener("change", function(){
        if(this.checked) {
            player1.trainerMode = true;
       } 
       else {
            player1.trainerMode=false;     
        }

    });

    document.querySelector(".playerPanel2").querySelector(".trainerCheckBox").addEventListener("change", function(){
        if(this.checked) {
            player2.trainerMode = true;
       } 
       else {
            player2.trainerMode=false;     
        }

    });
    
    currentPlayer = player1;
}

function endGame(){
    var winPlayer = getWinner();
    var text = document.querySelector(".endGameContext");
    text.innerHTML = "The Winner is " + winPlayer.name.innerHTML;
    document.querySelector("#popupEnd").classList.toggle("hidden");
}

function getWinner(){
    if(player1.score > player2.score){
        return player1;
    }
    else{
        return player2;
    }
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
    var basePoint = {row:parseInt(cell.dataset.rows), col:parseInt(cell.dataset.cols)};
    var currentPoint = new Object();  

    for (var i = 0;  i < 8; i++){
        Object.assign(currentPoint,basePoint);
        getNextCellToCheck(i,currentPoint);
        currentCellId = calculateIdFromRowsAndCols(currentPoint);
        currentCell = document.getElementById(currentCellId);
        //console.log(currentCellId + " " + i);
        if(currentCell !== null){         
            if(isCellOccupied(currentCell)){                   
                return true;
            }
        }
    }
    return false;
}

function Player(playerNumber, playerName) {
    this.NO = playerNumber;
    this.name = document.querySelector(".player" + playerNumber + "Name");
    this.name.innerHTML = playerName;
    this.panel = document.querySelector(".playerPanel" + this.NO);
    this.scoreElement = document.querySelector("#scorePlayer" + playerNumber);
    this.score = this.scoreElement.innerHTML = 2;
    var playerAverageStatsEl = document.querySelector(".player"+this.NO+"AverageStats");
    this.averagePlayTime = playerAverageStatsEl.querySelector(".statsContent");
    this.averagePlayTime.innerHTML = "";
    this.riskAmountElement = this.panel.querySelector(".playerRiskStats");
    this.riskAmount =this.riskAmountElement.querySelector(".statsContent");
    this.riskAmount.innerHTML = 1;
    this.trainerElement = this.panel.querySelector(".trainerWrapper");
    this.numberOfTurns = 0;
    this.turnTimeArray = new Array();
    this.timeStart;
    this.totalTurnTime = new Array();
    this.trainerMode = false;

    this.addScore = (numberToAdd)=>{
        this.score += numberToAdd;
        this.scoreElement.textContent = this.score;
    }

    this.decreaseScore = (numberToDecrease)=>{
        this.score -= numberToDecrease;
        this.scoreElement.textContent = this.score;
        this.updateRiskAmount();
    }
    
    this.updateRiskAmount = function() {
        var newRiskAmount = this.riskAmount.innerHTML;
        //console.log(newRiskAmount);
        var res = 0;
        var cell;
        for(i=0; i<board.size*board.size; i++)
        {
            cell = document.getElementById(i);
            if(cell.querySelector(".circlePlayer" + this.NO)!== null){
                res++;
            }
        }
        if(res === 2)
        {
            newRiskAmount++;
            this.riskAmount.innerHTML = newRiskAmount;         
        }
    }

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

        /* calculate total avg */
        if(this.totalTurnTime.length !== 0){
            var sum = 0;
            var res;
            for(var i = 0; i < this.totalTurnTime.length; i++) {
                sum += this.totalTurnTime[i];
            }
            res = (sum / this.totalTurnTime.length).toFixed(2);
            this.totalTurnTime.innerHTML = res;
        }
    }

}

function handleMouseOverCellEvent() {
    var id = (event.currentTarget).getAttribute("id");
    var potentialFlips;
    if(!currentPossibleMoves.includes(id) && !isCellOccupied(document.getElementById(id)))
    {
        (event.target).style.backgroundColor = "red";
    }
    else if(!isCellOccupied(document.getElementById(id))&& currentPlayer.trainerMode === true){
        potentialFlips = checkClosingMove(event.currentTarget);
        if(potentialFlips.length !== 0){
            currentPlayer.trainerElement.style.visibility ="visible";
            currentPlayer.trainerElement.textContent = (potentialFlips.length + 1) + " Points will be added";
        }       
    }
}

function handleMouseOutCellEvent() {
    var id = (event.currentTarget).getAttribute("id");
    if(!currentPossibleMoves.includes(id) && !isCellOccupied(document.getElementById(id)))
    {
        (event.target).style.backgroundColor = "green";
    }
    else{
        currentPlayer.trainerElement.style.visibility ="hidden";
    }

}

function handleClickCellEvent() {
    var id = (event.currentTarget).getAttribute("id");
    var p =  (event.currentTarget).firstElementChild;
    var cellsToFlip;

    if(currentPossibleMoves.includes(id))
    {
        currentPlayer.trainerElement.style.visibility ="hidden";
        currentPlayer.setEndTurn();
        p.classList.add("circlePlayer" + currentPlayer.NO);
        currentPlayer.numberOfTurns++;
        cellsToFlip = checkClosingMove(event.currentTarget);
        
        if(cellsToFlip.length !== 0){
            board.updateBoard(cellsToFlip);  
           // checkOpponentClosing(cellsToFlip);
        }
        updateScore(cellsToFlip.length);
        updatePlayerStats();
        switchPlayerFull();
        currentPossibleMoves = findPossibleMove();

        checkEndGame();
    }
}

function checkEndGame()
{
    if(player1.score === 0 || player2.score === 0 || 
        player1.score + player2.score === board.size*board.size){
        endGame();
        }
}

function updateScore(number){
    currentPlayer.addScore(number + 1);
    switchPlayerLight();
    currentPlayer.decreaseScore(number);
    switchPlayerLight(); 
}

function checkOpponentClosing(cellsToCheck){

    var basePoint;
    var currentPoint = new Object();
    var currentCell; 


    switchPlayerLight();
    for(var i=0; i<cellsToCheck.length ;i++){
        currentCell = document.getElementById(cellsToCheck[i]);
        var basePoint ={row: parseInt(currentCell.dataset.rows),
            col:parseInt(currentCell.dataset.cols)};

        for(j = 0; j < 8; j++){
            Object.assign(currentPoint,basePoint);    
            getNextCellToCheck(i,currentPoint);
            currentCell = document.getElementById(calculateIdFromRowsAndCols(currentPoint));
            if(isCellOccupied(currentCell)){
                cellsToFlip = checkClosingMove(currentCell);
                //console.log(cellsToFlip +"check");
                if(cellsToFlip.length !== 0){
                    board.updateBoard(cellsToFlip);
                    updateScore(cellsToFlip.length);
                }
            }
        }             
    }
    switchPlayerLight();
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
    this.updateBoard = (ToolsToUpdate)=>{
       
        var currentTool;
        for (var i=0;i<ToolsToUpdate.length ;i++)
        {
           currentTool = document.getElementById(ToolsToUpdate[i]).firstElementChild;
           currentTool.classList.toggle("circlePlayer1");
           currentTool.classList.toggle("circlePlayer2");
        }
    }      
}

function checkClosingMove(cell){
    
    var basePoint ={row: parseInt(cell.dataset.rows),
        col:parseInt(cell.dataset.cols)}
    var currentPoint = new Object;
    var newCellId;   
    var cellToCheck;
    var sawOpponenetCell = false;
    var commitCells;
    var cellsToUpdate = new Array();
    var tempCells = new Array();

    for(var i = 0 ;i < 8 ;i++)
    {   
         Object.assign(currentPoint,basePoint);
        commitCells=false;

        for (var j =0; j<board.size ;j++)
        {
            getNextCellToCheck(i,currentPoint);
            newCellId = calculateIdFromRowsAndCols(currentPoint);
            cellToCheck = document.getElementById(newCellId);
            if(cellToCheck == null){
                break;
            }
            //console.log("" + currentPoint.row + currentPoint.col + " "+i +" "+newCellId);
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
                if(commitCells === true){
                    cellsToUpdate.push(...tempCells);
                    break;
                } 
            }
            else{
                break;
            }         
        }
        tempCells = new Array();
    }
    return (cellsToUpdate.length !== 0 ? cellsToUpdate: new Array());
}

function calculateIdFromRowsAndCols(point){
    var row = point.row;
    var col = point.col;
    if(row >= board.size || row < 0 || col >= board.size || col < 0){
        return null;
    }
    var result =(board.size*row)+ col;
    return result;
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

function switchPlayerLight(){
    if(currentPlayer.NO === 1){
        currentPlayer = player2;
    }
    else {
        currentPlayer = player1;
    }
}

function switchPlayerFull(){
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
    currentPlayer.getAvgTimeTurn();
    currentPlayer.updateRiskAmout;
}
