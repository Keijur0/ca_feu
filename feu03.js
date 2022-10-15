// This program takes 1 text file as argument containing an uncomplete sudoku inside, and returns the sudoku solved

// Functions
function nbArgCheck(param1){
    if(param1 !== 1){
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
    else if(!isTextFile(file)){
        return false;
    }
    else if(!isASudokuFormat(sudoku)){
        return false;
    }
    else if(!isASudoku(sudoku)){
        return false;
    }
    return true;
}
// Check if the array is a Sudoku
function isASudokuFormat(param1){
    let array = param1;
    let length = array.length;
    // Checking if it's a 9x9 array
    if(length !== 9){
        return false;
    }
    else{
        for(let i = 0; i < length; i++){
            lineLength = array[i].length;
            if(lineLength !== 9){
                return false;
            }
        }
    }
    // Checking if values in the array are only 1-9 and unknowns (".")
    for(let i = 0; i < length; i++){
        let lineLength = array[i].length;
        for(let j = 0; j < lineLength; j++){
            let cellLength = array[i][j].length;
            if(cellLength > 1){
                return false;
            }
            for(let k = 0; k < cellLength; k++){
                if(array[i][j][k] !== "." && array[i][j][k].charCodeAt() < 48 && array[i][j][k].charCodeAt() > 57){
                    return false;
                }
            }
        }
    }
    return true;
}
// Checking if each number is unique per line
function isUniqueInLine(param1, param2, param3){
    let line = param1;
    let toSkip = param2;
    let toCheck = param3;  
    let length = line.length;
    for(let i = 0; i < length; i++){
        if(line[i] == "." || i == toSkip){
            continue;
        }
        else if(toCheck == line[i]){
            console.log("1");
            return false;
        }
    }
    return true;
}
// Checking if each number is unique per column
function isUniqueInColumn(param1, param2, param3, param4){
    let array = param1;
    let arrayLength = array.length;
    let columnToCheck = param2;
    let toSkip = param3;
    let toCheck = param4;
    for(let i = 0; i < arrayLength; i++){
        if(array[i][columnToCheck] == "." || i == toSkip){
            continue;
        }
        else if(toCheck == array[i][columnToCheck]){
            console.log(toCheck + " " + i + " " + columnToCheck + " " + array[i][columnToCheck]);
            console.log("2");
            return false;
        }
    }
    return true;
}
// Checking if each number is unique per subsquare
function isUniqueInSubSquare(param1, param2, param3, param4){
    let array = param1;
    let line = param2;
    let column = param3;
    let toCheck = param4;
    let subSquareStart = defineSubSquare(line, column);
    let subStartLine = parseInt(subSquareStart[0]);
    let subStartColumn = parseInt(subSquareStart[1]);
    for(let i = subStartLine; i < subStartLine+3; i++){
        if(toCheck == "."){
            continue;
        }
        for(let j = subStartColumn; j < subStartColumn+3; j++){
            if(array[i][j] == "." || i == line && j == column){
                continue;
            }
            else if(array[i][j] == toCheck){
                console.log(toCheck + " " + i + " " + j);
                console.log("3");
                return false;
            }
        }
    }
    return true;
}
// Check if each number is unique per line, column and subsquare
function isASudoku(param1){
    let array = param1;
    let length = array.length;
    for(let i = 0; i < length; i++){
        let lineLength = array[i].length;
        for(let j = 0; j < lineLength; j++){
            if(!isUniqueInLine(array[i], j, array[i][j]) || !isUniqueInColumn(array, j, i, array[i][j]) || !isUniqueInSubSquare(array, i, j, array[i][j])){
                return false;
            }
        }
    }
    return true;
}
// Format file from argument into an array of arrays
function formatFileContent(param1){
    const content = readFileSync(param1, 'utf-8');
    const arrayContent = content.split("\n");
    let length = arrayContent.length;
    let sudoku = [];
    for(let i = 0; i < length; i++){
        let tempArray = [];
        let lineLength = arrayContent[i].length;
        for(let j = 0; j < lineLength; j++){
            tempArray.push(arrayContent[i][j]);
        }
        sudoku.push(tempArray);
    }
    return sudoku;

}
// Checking if the Sudoku is finished
function anyLeft(param1){
    let array = param1;
    let length = array.length;
    for(let i = 0; i < length; i++){
        let lineLength = array[i].length;
        for(let j = 0; j < lineLength; j++){
            if(array[i][j] == "."){
                return true;
            }
        }
    }
    return false;
}
// Check if the form is findable
function isDoable(param1){
    let array = param1;
    let nbLines = array.length;
    for(i = 0; i < nbLines; i++){
        let line = array[i];
        columnsToCheck = checkLine(line);
        if(columnsToCheck){
            subArrayToCheck = checkColumns(array, columnsToCheck);
            if(subArrayToCheck){
                isFindable = checkSubSquare(array, subArrayToCheck);
                if(!isFindable){
                    return false;
                }
            }
        }
    } 
    return true;
}
// Checking if a line can be resolved by iself, if more than 1 unknown, return the column numbers, to check columns
function checkLine(param1){
    let line = param1;
    let nbCells = line.length;
    let unknownList = [];
    for(let i = 0; i < nbCells; i++){
        if(line[i] == "."){
            unknownList.push(i);
        }
    }
    let nbUnknowns = unknownList.length;
    if(nbUnknowns > 1){
        return unknownList;
    }
}
// Checking if a column can be resolved by itself
function checkColumns(param1, param2){
    let array = param1;
    let length = array.length;
    let columnList = param2;
    let nbColumns = columnList.length;
    let line = [];
    let column = [];
    let coordinates = [line, column];
    for(let i = 0; i < nbColumns; i++){
        let nbUnknowns = 0;
        for(j = 0; j < length; j++){
            if(array[j][columnList[i]] == "."){
                nbUnknowns++;
            }
        }
        if(nbUnknowns > 1){
            line.push(j-1);
            column.push(columnList[i]);
        }
    }
    if(line.length >= 1 || column.length >= 1){
        return coordinates;
    }
}
// Checking if a subsquare can be resolved by itself
function checkSubSquare(param1, param2){
    let array = param1;
    let coord = param2;
    let line = coord[0];
    let nbCoords = line.length;
    let column = coord[1];
    let subStartLine = 0;
    let subStartColumn = 0;
    for(let i = 0; i < nbCoords; i++){
        j = i;
        let nbUnknowns = 0;
        let subSquareStart = defineSubSquare(line[i], column[j]);
        subStartLine = parseInt(subSquareStart[0]);
        subStartColumn = parseInt(subSquareStart[1]);
        for(let k = subStartLine; k < subStartLine+3; k++){
            for(let l = subStartColumn; l < subStartColumn+3; l++){
                if(array[k][l] == "."){
                    nbUnknowns++;
                }
            }
        }
        if(nbUnknowns > 1){
            return false;
        }
    }
    return true;
}
// Defining the subsquare a cell belongs to
function defineSubSquare(param1, param2){
    let line = param1;
    let column = param2;
    let array = [];
    if(line < 3){
        array.push(0);
    }
    else if(line >= 3 && line < 6){
        array.push(3);
    }
    else{
        array.push(6);
    }
    if(column < 3){
        array.push(0);
    }
    else if(column >= 3 && column < 6){
        array.push(3);
    }
    else{
        array.push(6);
    }
    return array;
}
// Main function, resolving the Sudoku
function resolveSudoku(param1){
    let array = param1;
    let length = array.length;
    while(anyLeft(array)){
        for(let i = 0; i < length; i++){
            let lineLength = array[i].length;
            let line = array[i];
            // If there is only 1 unknown in the line
            if(!checkLine(line)){
                resolveLine(line);
            }
            for(let j = 0; j < lineLength; j++){
                if(array[i][j] == "."){
                    resolvableColumn = isResolvableCol(array, j);
                    // If there is only 1 unknown in the column
                    if(resolvableColumn){
                        resolveColumn(array, j);
                    }
                    // If there is only 1 unknown in the subsquare
                    else{
                        let coordinates = defineSubSquare(i, j);
                        resolvableSubSquare = isResolvableSubSquare(array, coordinates);
                        if(resolvableSubSquare){                  
                            resolveSubSquare(array, coordinates);
                        }
                        else{
                            continue;
                        }
                    }
                }
            }
        }
    }
    return array;
}
// Find the unknown value in a line
function resolveLine(param1){
    let line = param1;
    let lineLength = line.length;
    const total = 45;
    let sum = 0;
    let toResolve;
    for(let i = 0; i < lineLength; i++){
        if(line[i] !== "."){
            sum += parseInt(line[i]);
        }
        else{
            toResolve = i;
        }
    }
    line[toResolve] = total - sum;
}
// Check if there is only 1 unknown value in the column
function isResolvableCol(param1, param2){
    let array = param1;
    let column = param2;
    let length = array.length;
    let nbUnknowns = 0;
    for(i = 0; i < length; i++){
        if(array[i][column] == "."){
            nbUnknowns++;
        }
    }
    if(nbUnknowns > 1){
        return false;
    }
    else{
        return true;
    }
}
// Find the unknown value in a column
function resolveColumn(param1, param2){
    array = param1;
    column = param2;
    length = array.length;
    const total = 45;
    let sum = 0;
    let toResolve;
    for(i = 0; i < length; i++){
        if(array[i][column] !== "."){
            sum += parseInt(array[i][column]);
        }
        else{
            toResolve = i;
        }
    }
    array[toResolve][column] = total - sum;
}
// Check if there is only 1 unknown in the subsquare;
function isResolvableSubSquare(param1, param2){
    let array = param1;
    let subStartLine = param2[0];
    let subStartColumn = param2[1];
    let subSquareLength = subStartLine + 3;
    let subSquareHeight = subStartColumn + 3;
    let nbUnknowns = 0;
    for(let i = subStartLine; i < subSquareLength; i++){
        for(let j = subStartColumn; j < subSquareHeight; j++){
            if(array[i][j] == "."){
                nbUnknowns++;
            }
        }
    }
    if(nbUnknowns > 1){
        return false;
    }
    else{
        return true;
    }
}
// Find the unknown value in a subsquare
function resolveSubSquare(param1, param2){
    let array = param1;
    let subStartLine = parseInt(param2[0]);
    let subStartColumn = parseInt(param2[1]);
    let subSquareLength = subStartLine + 3;
    let subSquareHeight = subStartColumn + 3;
    const total = 45;
    let sum = 0;
    let toResolveLine;
    let toResolveColumn;
    for(let i = subStartLine; i < subSquareLength; i++){
        for(let j = subStartColumn; i < subSquareHeight; j++){
            if(array[i][j] !== "."){
                sum += array[i][j];
            }
            else{
                toResolveLine = i;
                toResolveColumn = j;
            }
        }
    }
    array[toResolveLine][toResolveColumn] = total - sum;
}

// Format the return value of our script
function formatResult(param1){
    let array = param1;
    let length = array.length;
    let result = "";
    for(let i = 0; i < length; i++){
        let lineLength = array[i].length;
        for(let j = 0; j < lineLength; j++){
            if(!result){
                result = array[i][j];
            }
            else{
                result = result + array[i][j];
            }
        }
        if(i < length-1){
            result = result + "\n";
        }
    }
    return result;
}
// Part 1: Parsing
const {readFileSync, promises: fsPromises} = require('fs');
argList = process.argv.splice(2, process.argv.length-1);
nbArg = argList.length;
file = argList[0];
sudoku = formatFileContent(file);

// Part 2: Error Management
if(!globalCheck()){
    console.log("Error");
    return;
}

// Part 3: Resolution
sudokuDoable = isDoable(sudoku);
if(!sudokuDoable){
    console.log("This sudoku is not doable")
    return;
}
else{
    solvedSudoku = resolveSudoku(sudoku);
    finalResult = formatResult(solvedSudoku);
}

// Part 4: Display result
console.log(finalResult);