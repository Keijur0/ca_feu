// This script takes a labyrinth as argument and will return the quickest way out
// Functions
// Checking if there are more or less than 1 argument
function nbArgCheck(param1){
    if(param1 !== 1){
        return false;
    }
    return true;
}
// Checking if the argument is a text file
function isArgMapFile(param1){
    let file = param1;
    if(!file.endsWith(".map")){
        return false;
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
        console.log("error1");
        return false;
    }
    if(!isArgMapFile(file)){
        console.log("error2");
        return false;
    }
    if(!checkBoardChars(mazeProperties, maze)){
        console.log("error4");
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
// Main function: looking for the first exit, from start position
function findShortestPath(param1, param2){
    let maze = param1;
    let start = param2;
    let startRow = start[0];    // Start row
    let startCol = start[1];    // Start column
    let exitFound = false;
    moveCount = 0;
    let exitCoords = [];
    rowQueue = [];
    colQueue = [];
    rowQueue.push(startRow);
    colQueue.push(startCol);
    visited[startRow][startCol] = true;
    while(rowQueue.length > 0){
        // Getting value + removing from queue
        r = rowQueue.shift();
        c = colQueue.shift();
        if(maze[r][c] == exit){
            exitFound = true;
            exitCoords.push(r);
            exitCoords.push(c);
            break;
        }
        checkNeighbours(r, c);
        nodesLeftCurrLayer--;   // Decrementing the value after checking 1 node
        if(nodesLeftCurrLayer == 0){
            nodesLeftCurrLayer = nodesNextLayer;
            nodesNextLayer = 0;
            moveCount++;
        }
    }
    if(exitFound){
        return reconstructPath(prev, exitCoords);
    }
    return "no exit";
}
// Scanning the maze to find the entry(ies) and exit door(s)
function findEntry(){
    let entryCoords = [];
    for(let i = 0; i < mazeHeight; i++){
        let lineLength = maze[i].length;
        for(let j = 0; j < lineLength; j++){
            if(maze[i][j] == entry){
                entryCoords.push(i);
                entryCoords.push(j);
            }
        }
    }
    if(entryCoords){
        return entryCoords;
    }
    else{
        return "No Entry :(";
    }
}

// Checking current cell's neighbours
function checkNeighbours(param1, param2){
    let row = param1;
    let col = param2;
    // Observing the cells: above, below, on right, on left
    for(let i = 0; i < 4; i++){
        let newRow = parseInt(row + dirRow[i]);
        let newCol = parseInt(col + dirCol[i]);
        // Making sure we are still in the maze
        if(newRow < 0 || newCol < 0 || newRow >= mazeHeight || newCol >= mazeLength){
            continue;
        }
        // Making sure whether if cells are already visited or if they are obstacles
        if(visited[newRow][newCol] == true || maze[newRow][newCol] == obstacle || maze[newRow][newCol] == rightWall){
            continue;
        }
        rowQueue.push(newRow);
        colQueue.push(newCol);
        visited[newRow][newCol] = true;
        nodesNextLayer++;
        prev[newRow][newCol] = [row, col];
    }
}
// Scanning the next line to find the path through next line
function reconstructPath(param1, param2){
    let path = []
    let prev = param1;
    let e = param2;
    let exitRow = e[0];
    let exitCol = e[1];
    for(let i = prev[exitRow][exitCol]; i !== null; i = prev[i[0]][i[1]]){
        path.push(i);
    }
    path.reverse();
    return path;
}

// Building visited matrix to determine if a node has been visited or not
function buildVisitedMatrix(){
    let array = [];
    for(let i = 0; i < mazeHeight; i++){
        array[i] = maze[i].slice();
        array[i].fill(false);
    }
    return array;
}
// Building prev matrix to reconstruct the shortest path
function buildPrevMatrix(){
    let array = [];
    for(let i = 0; i < mazeHeight; i++){
        array[i] = maze[i].slice();
        array[i].fill(null);
    }
    return array;
}

// Drawing the shortest path and formatting result
function formatResult(param1){
    wayOut = param1;
    pathLength = wayOut.length;
    let result;
    // Drawing
    for(let i = 1; i < pathLength; i++){
        if(wayOut !== null){
            maze[wayOut[i][0]][wayOut[i][1]] = path;
        }
    }

    // Formatting
    for(let i = 0; i < mazeHeight; i++){
        for(let j = 0; j < mazeLength; j++){
            if(!result){
                result = maze[i][j];
            }
            else{
                result = result + maze[i][j];
            }
        }
        result = result + "\n";
    }
    return result;
}

// Part 1: Parsing
const {readFileSync, promises:fsPromises} = require('fs');
const argList = process.argv.splice(2, process.argv.length-1);
const nbArg = argList.length;
const file = argList[0];
const fileIntoArray = formatFileContent(file);
const mazeProperties = fileIntoArray[0];
const maze = fileIntoArray.splice(1, fileIntoArray.length-1);
const mazeHeight = parseInt(mazeProperties[0] + mazeProperties[1], 10);
const mazeLength = parseInt(mazeProperties[3] + mazeProperties[4], 10);
const obstacle = mazeProperties[5];
const passage = mazeProperties[6];
const path = mazeProperties[7];
const entry = mazeProperties[8];
const exit = mazeProperties[9];
const rightWall = mazeProperties[10];
// Defining the 4 directions to check around a cell (Up, Down, Right, Left)
const dirRow = [-1, 1, 0, 0];
const dirCol = [0, 0, +1, -1]
// Counting how many cells we have to check in the current and next layer of Breadth First Search
var nodesLeftCurrLayer = 1;
var nodesNextLayer = 0;
// Created a "visited" array of the same size of the maze, to check if we already visited a node
var visited = buildVisitedMatrix();
var prev = buildPrevMatrix();

// Part 2: Error management
if(!globalCheck()){
    console.log("error");
    return;
}
// Part 3: Resolution

const entryPos = findEntry();
result = findShortestPath(maze, entryPos);
finalResult = formatResult(result);
// Part 4: Display result
console.log(finalResult);
console.log("=> SORTIE ATTEINTE en " + (moveCount-1) + " COUPS !");