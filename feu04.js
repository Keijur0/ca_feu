// Functions
// Checking if there are more or less than 1 argument
function nbArgCheck(param1){
    if(param1 !== 1){
        return false;
    }
    return true;
}
// Checking if the argument is a text file
function isArgTextFile(param1){
    let arg = param1;
    if(!arg.endsWith(".txt")){
        return false;
    }
    return true;
}
// Checking if the board lines have all the same length, and if line are not null;
function checkLinesLength(param1){
    let array = param1;
    let length = array.length;
    for(let i = 0; i < length; i++){
        lineLength = array[i].length;
        if(i > 0){
            prevLineLength = array[i-1].length;
            if(lineLength !== prevLineLength || !lineLength){
                return false;
            }
        }
    }
    return true;
}
// Check if the chars in the board are only the ones from the first file's line
function checkBoardChars(param1, param2){
    let prop = param1;
    let arrayToCheck = param2;
    let length = arrayToCheck.length;
    for(let i = 0; i < length; i++){
        let lineLength = arrayToCheck.length;
        for(let j = 0; j < lineLength; j++){
            if(!prop.includes(arrayToCheck[i][j], 1)){
                return false;
            }
        }
    }
    return true;
}
// Do all checks to find errors
function globalCheck(){
    if(!nbArgCheck(nbArg)){
        return false;
    }
    if(!isArgTextFile(file)){
        return false;
    }
    if(!checkLinesLength(board)){
        return false;
    }
    if(!checkBoardChars(boardProperties, board)){
        return false;
    }
    return true;
}
// Formatting the board from text file into an array
function formatFileContent(param1){
    const content = readFileSync(param1, 'utf-8');
    const arrayContent = content.split("\n");
    let length = arrayContent.length;
    let newArray = [];
    for(let i = 0; i < length; i++){
        let lineLength = arrayContent[i].length;
        let tempArray = [];
        for(j = 0; j < lineLength; j++){
            tempArray.push(arrayContent[i][j]);
        }
        newArray.push(tempArray);
    }
    return newArray;
}
// Finding the biggest square possible on the board
function findLargestSquare(param1, param2){
    const array = param1;
    length = array.length;
    const obstacle = param2[2];
    size = 1;
    let biggestSquareProp = [0, 0, 1];
    for(let i = 0; i < length; i++){
        lineLength = array[i].length;
        for(let j = 0; j < lineLength; j++){
            // Defining where we start to draw the square
            originLine = i;
            originColumn = j;
            while(size + originColumn < lineLength-1 && size + originLine < length-1){
                let obstacleFound = tryDrawSquare(array, originLine, originColumn, obstacle, size);
                if(!obstacleFound){
                    if(biggestSquareProp[2] < size){
                        biggestSquareProp[2] = size;
                        biggestSquareProp[0] = originLine;
                        biggestSquareProp[1] = originColumn;
                    }
                    size++;
                }
                else{
                    break;
                }
            }
            // If the square is going to exceed the board size go to the beginning of next line
            if(size + originColumn >= lineLength-1 || size + originLine >= length-1){
                break;
            }
        }
    }
    return biggestSquareProp;
}
// Trying to draw a square on the board, returns the size if succeeding
function tryDrawSquare(param1, param2, param3, param4, param5){
    const array = param1;
    let newArray = array;
    const line = param2;
    const col = param3;
    const obs = param4;
    const size = param5;
    const squareLength = line + size;
    const squareHeight = col + size;
    for(let i = line; i < squareLength; i++){
        for(let j = col; j < squareHeight; j++){
            if(newArray[i][j] == obs){
                return true;
            }
        }
    }
    return false;
}
// Drawing largest possible square in the board
function drawLargestSquare(param1, param2, param3){
    array = param1;
    originLine = parseInt(param2[0]);
    originCol = parseInt(param2[1]);
    sqSize = parseInt(param2[2]);
    sqHeight = originLine + sqSize;
    sqLength = originCol + sqSize;
    draw = param3;
    for(let i = originLine; i < sqHeight; i++){
        for(let j = originCol; j < sqLength; j++){
            array[i][j] = draw;
        }
    }
    return array;
}
// Formatting result
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
        if(i<length-1){
            result = result + "\n";
        }
    }
    return result;
}
// Part 1: Parsing
const {readFileSync, promises:fsPromises} = require('fs');
const argList = process.argv.splice(2, process.argv.length-1);
const nbArg = argList.length;
const file = argList[0];
const fileIntoArray = formatFileContent(file);
const boardProperties = fileIntoArray[0];
const board = fileIntoArray.splice(1, fileIntoArray.length-1);

// Part 2: Error management
if(!globalCheck()){
    console.log("error");
    return;
}
// Part 3: Resolution
largestSquare = findLargestSquare(board, boardProperties);
result = drawLargestSquare(board, largestSquare, boardProperties[3]);
finalResult = formatResult(result);
// Part 4: Display result
console.log(finalResult);