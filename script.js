
createMainBoard(8);

function createMainBoard(size) {
    
    var table = "";
    for(var i=0; i<size; i++){
        
       table += "</tr\n>"; 

        for (var j=0; j<size; j++){
            
            table += "<td id="+i+j +" class = gameSquare >" 
            

            if((i === size/2 || i === (size/2) - 1) && (j === size/2 || j === (size/2) - 1)){

                if((i === size/2 && j === (size/2) - 1 ) ||(i === size/2 -1 && j === (size/2))){
                    table += "\n<p class =\"gameCurcle CurclePlayer1\"> </p>\n";
                }
                else{
                    table += "\n<p class =\"gameCurcle CurclePlayer2\"> </p>\n";
                }
            }
            else{
                table += "\n<p class = gameCurcle> </p>\n";
            }
           table += "</td\n>";
            
        }
        table += "</tr\n>";
    }

    document.querySelector("#mainBoard").innerHTML = table;
}