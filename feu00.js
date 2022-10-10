// This program takes 2 integers as arguments and will draw a rectangle.

// Functions
function nbArgCheck(param1){
    if(param1 !== 2){
        return false;
    }
    return true;
}
function argValidityCheck(param1){
    argLength = param1.length;
    for(let i = 0; i < argLength; i++){
        if(param1[i].charCodeAt() < 48 || param1[i].charCodeAt() > 57){
            return false;
        }
    }
    if(param1 < 1){
        return false;
    }
    return true;
}
function drawExtremities(param1, param2){
    length = parseInt(param1);
    let result;
    for(let i = 0; i<length; i++){
        if(i == 0 || i == length-1){
            if(!result){
                result = corner;
            }
            else{
                result = result + corner;
            }
        }
        else{
            result = result + horizontalSide;
        }
    }
    param2.push(result);
}
function drawBody(param1, param2){
    length = parseInt(param1);
    let result;
    for(let i = 0; i<length; i++){
        if(i == 0 || i == length-1){
            if(!result){
                result = verticalSide;
            }
            else{
                result = result + verticalSide;
            }
        }
        else{
            result = result + inside;
        }
    }
    param2.push(result);
}
function drawRectagle(param1, param2){
    let length = param1;
    let height = param2;
    resArray = [];
    for(let i = 0; i < height; i++){
        if(i == 0 || i == height-1){
            drawExtremities(length, resArray);
        }
        else{
            drawBody(length, resArray);
        }
    }
    return resArray;
}
function formatResult(param1){
    let length = param1.length;
    let result;
    for(let i = 0; i<length; i++){
        if(!result){
            result = param1[i];
        }
        else{
            result = result + "\n" + param1[i];
        }
    }
    return result;
}
// Part 1: Parsing
argList = process.argv.splice(2, process.argv.length-1);
nbArg = argList.length;
rectangleLength = parseInt(argList[0]);
rectangleHeight = parseInt(argList[1]);
const corner = "o";
const horizontalSide = "-";
const verticalSide = "|";
const inside = " ";

// Part 2: Error Management
if(!nbArgCheck(nbArg) || !argValidityCheck(rectangleLength) || !argValidityCheck(rectangleHeight)){
    console.log("Error: Please enter only 2 integers as arguments (minimum value is 1)")
    return;
}

// Part 3: Resolution
rectangle = drawRectagle(rectangleLength, rectangleHeight);
finalResult = formatResult(rectangle);

// Part 4: Display results
console.log(finalResult);

