
createMainBoard(8);

function createMainBoard(size) {
    
    var table = "";
    for(var i=0; i<size; i++){
        
       table += "</tr\n>"; 

        for (var j=0; j<size; j++){
            
            table += "<td id="+i+j +" class = gameSquare>" + i + "</td\n>";
        }
        table += "</tr\n>";
    }

    document.querySelector("#mainBoard").innerHTML = table;
}