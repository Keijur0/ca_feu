// This program takes 2 files as arguments, one containing a board, another containing a form. Returns if the form is found on the board. And if so, also its coordinates.

// Functions
function nbArgCheck(param1){
    if(param1 !== 2){
        return false;
    }
    return true;
}
// Check if it is a .txt
function isTextFile(param1){
    if(!param1.endsWith(".txt")){
        return false;
    }
    return true;
}
// Check if all validity tests have been passed
function globalCheck(){
    if(!nbArgCheck(nbArg)){
        return false;
    }
    else if(!isTextFile(fileOne)){
        return false;
    }
    else if(!isTextFile(fileTwo)){
        return false;
    }
    return true;
}
// Format file from argument into an array
function formatFileContent(param1){
    const content = readFileSync(param1, 'utf-8');
    const array = content.split("\n");
    return array;

}
// Testing the rest of the form when its first char is the same as one on the board
function testToDo(param1, param2, param3, param4){
    let board = param1;
    let form = param2;
    let boardLength = board.length;
    let formLength = form.length;
    let originRow = param3;
    let originColumn = param4;
    let k = 0;
    let nbSpaces = 0;
    let l = 0;
    console.log(originRow + " " + originColumn);
    // From the origin point, testing if the rest of the form
    // Making sure we are not going out of the board nor the form
    for(i = originRow ; i < originRow + formLength; i++){
        if(i > boardLength - 1){
            return false;
        }
        let strFormLength = form[k].length;
        let strBoardlength = board[i].length;
        // Initializing the first character to compare in the form, depending on number of spaces
        for(let i = 0; i < strFormLength; i++)
        {
            if(form[i] == " "){
                nbSpaces++;
            }
        }
        l = 0;
        for(j = originColumn; j < originColumn+strFormLength-nbSpaces; j++){
            console.log(k + " " + l + " - " + i + " " + j);
            console.log(form[k][l] + " - " + board[i][j]);
            // In we go out of the board
            if(j > strBoardlength-1 || i > boardLength-1){
                return false;
            }
            // If there is a space in the form, we don't compare it
            else if(form[k][l] == " "){
                // Checking if we are exceeding the form's size
                if(l < strFormLength-1){
                    l++;
                }
                continue;
            }
            // If something is different, we get back searching the form on the board
            else if(form[k][l] !== board[i][j]){
                return false;
            }
            l++;
        }
        // Checking if we are exceeding the form's length
        if(k < formLength - 1){
            k++;
        }
        else{
            k = 0;
        }
    }
    return true;
}
// Check if the form is findable
function isFindable(param1, param2){
    let length1 = param1.length;
    let length2 = param2.length;
    if(length1 < length2){
        return false;
    }
    else{
        // Compare the length of each line of the string to find...
        for(let i = 0; i<length2; i++){
            let strLength2 = param2[i].length;
            let countLongerthan = 0;
            // ...with the length of each line of the board
            for(let j = 0; j < length1; j++){
                let strLength1 = param1[i].length;
                if(strLength1 < strLength2){
                    countLongerthan++;
                }
            }
            // If one line of the string to find is longer than all the lines of the board: not findable
            if(countLongerthan >= length1){
                return false;
            }
        }
    }

    return true;
}
// Checking on the board to find the form the most on top right
function findForm(param1, param2){
    board = param1;
    form = param2;
    boardLength = board.length;
    formLength = form.length;
    let coordinates;
    let k = 0;
    for(let i = 0; i < boardLength; i++){
        strBoardLength = board[i].length;
        for(let j = 0; j < strBoardLength; j++){
            // Finding the first char of the first line of the form, which is not a space. So it can be compared in the board
            while(form[0][k] == " "){
                k++;
            }
            // If the first char of the form is the same as one of the board, start comparing the rest of the form
            if(form[0][k] == board[i][j]){
                let tempOriginRow = i;
                let tempOriginColumn = j;
                console.log(testToDo(board, form, tempOriginRow, tempOriginColumn));
                if(testToDo(board, form, tempOriginRow, tempOriginColumn)){
                    // We found the form in the board
                    coordinates = isMyResult(tempOriginRow, tempOriginColumn);
                }           
            }
        }
        // If we found the form, we will take the coordinates of the form the most further on right of the line
        if(coordinates){
            return coordinates;
        }
    }
    if(!coordinates){
        return false;
    }
}
// Save the coordinates of the form, before checking is another is more appropriate (top right)
function isMyResult(param1, param2){
    let coordinates = [];
    row = param1;
    column = param2;
    coordinates.push(row);
    coordinates.push(column);
    return coordinates;
}
// Format the return value of our script
function formatResult(param1, param2, param3){
    String.prototype.replaceAt = function(index, replacement){
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
    }
    let column = param1[1];
    let row = param1[0];
    let board = param2;
    let form = param3;
    let boardLength = board.length;
    let formLength = form.length;
    let result = "";
    let newBoard = [];
    // Replacing the board with dashes
    for(let i = 0; i < boardLength; i++){
        let strBoardLength = board[i].length;
        for(let j = 0; j < strBoardLength; j++){
            if (!newBoard[i]){
                newBoard[i] = "-";
            }
            else{
                newBoard[i] = newBoard[i] + "-";
            }
        }
    }
    // Placing the form found in the board of dashes
    k = 0;
    for(let i = row; i < row + formLength; i++){
        l = 0;
        strFormLength = form[k].length;
        for (let j = column; j < column + strFormLength; j++){
            // In case we are going out form the form length
            if(l > strFormLength || k > formLength){
                break;
            }
            // Replacing the board's characters by the form's characters, except for spaces
            if(form[k][l] !== ' '){
                newBoard[i] = newBoard[i].replaceAt(j, form[k][l]);
            }
            // Checking if we are exceeding the form's size
            if(l < strFormLength - 1){
            l++;
            }
        }
        // Checking if we are exceeding the form's length
        if(k < formLength - 1){
            k++;
        }
        else{
            k = 0;
        }
    }
    // Placing the result board into a variable
    for(let i = 0; i < boardLength; i++){
        if(!result){
            result = newBoard[i];
        }
        else{
            result = result + "\n" + newBoard[i];
        }
    }
    return result;
}
// Part 1: Parsing
const {readFileSync, promises: fsPromises} = require('fs');
argList = process.argv.splice(2, process.argv.length-1);
nbArg = argList.length;
fileOne = argList[0];
fileTwo = argList[1];
board = formatFileContent(fileOne);
form = formatFileContent(fileTwo);

// Part 2: Error Management
if(!globalCheck()){
    console.log("Error");
    return;
}
if(!isFindable(board, form)){
    console.log("Introuvable");
    return;
}
// Part 3: Resolution
formFound = findForm(board, form);
if(!formFound){
    console.log("Introuvable");
    return;
}
else{
    boardResult = formatResult(formFound, board, form);
    column = formFound[1];
    row = formFound[0];
    // Part 4: Display results
    console.log("Trouvé !\nCoordonnées: " + column + "," + row + "\n" + boardResult);
}


