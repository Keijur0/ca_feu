// This program takes one arithmetic expression as argument and will return the result of the calculation. 

// Functions
function nbArgCheck(param1){
    if(param1 !== 1){
        return false;
    }
    return true;
}
function formatExpression(param1){
    let newArray = [];
    let length = param1.length;
    let toAdd;
    for(let i = 0; i < length; i++){
        // Gathering adjacent numbers in the same cell
        if(isANumber(param1[i])){
            if(!toAdd){
                toAdd = param1[i];
            }
            else{
                toAdd = toAdd + param1[i];
            }
            // If next char is not a number
            if(param1[i+1] && !isANumber(param1[i+1])){
                newArray.push(toAdd);
                toAdd = "";
            }
            else if(!param1[i+1]){
                newArray.push(toAdd);
            }
        }
        // Isolating symbols in cells
        else if(param1[i].charCodeAt() == 45 || param1[i].charCodeAt() == 47 || param1[i].charCodeAt() == 37 || param1[i].charCodeAt() >= 40 && param1[i].charCodeAt() <= 43){
            newArray.push(param1[i]);
        }
    }
    return newArray;
}
function anyLeft(param1, param2, param3, param4){
    let subArray = param1;
    let symbol = param2;
    let leftIndex = param3;
    let rightIndex = param4;
    for(let i = leftIndex; i<rightIndex; i++){
        if(subArray[i] == symbol){
            return true;
        }
    }
    return false;
}
// Find the first closing parenthesis, so we can find the most inner opening parenthesis
function findInnerParenthesis(param1){
    let length = param1.length;
    let i = 0;
    while(param1[i] !== ")" && i < length){
        i++;
    }
    if(i == length-1){
        return false;
    }
    else{
        while(param1[i] !== "("){
            i--;
        }
        return i;
    }
}
// Find the closing parenthesis
function findSecondParenthesis(param1, param2){
    let i = param2;
    while(param1[i] !== ")"){
        i++;
    }
    return i;
}
function doFullCalc(param1){
    length = param1.length;
    // 1st priority: expression(s) between parenthesis
    while(anyLeft(param1, "(", 0, length-1)){
        let left = findInnerParenthesis(param1);
        let right = findSecondParenthesis(param1, left);
        while(anyLeft(param1, "*", left, right) || anyLeft(param1, "/", left, right) || anyLeft(param1, "%", left, right)){
            let calcIndex = findFirstPrioCalc(param1, left, right);
            let calcResult = doSmallCalc(param1[calcIndex-1], param1[calcIndex+1], param1[calcIndex]);
            param1 = updateTable(param1, calcIndex-1, calcIndex+1, calcResult);
            right-=3;
        }
        while(anyLeft(param1, "+", left, right) || anyLeft(param1, "-", left, right)){
            let calcIndex = findSecondPrioCalc(param1, left, right);
            let calcResult = doSmallCalc(param1[calcIndex-1], param1[calcIndex+1], param1[calcIndex]);
            param1 = updateTable(param1, calcIndex-1, calcIndex+1, calcResult);
            right-=3;
        }
        // Remove parenthesis
        left = findInnerParenthesis(param1);
        right = findSecondParenthesis(param1, left);
        param1.splice(left, 1);
        right--;
        param1.splice(right, 1);
    }
    // 2nd priority: multiplications, divisions, modulo out of parenthesis
    while(anyLeft(param1, "*", 0, length-1) || anyLeft(param1, "/", 0, length-1) || anyLeft(param1, "%", 0, length-1)){
        let calcIndex = findFirstPrioCalc(param1, 0, length-1);
        let calcResult = doSmallCalc(param1[calcIndex-1], param1[calcIndex+1], param1[calcIndex]);
        param1 = updateTable(param1, calcIndex-1, calcIndex+1, calcResult);
    }
    // last priority: additions, substractions out of parenthesis
    while(anyLeft(param1, "+", 0, length-1) || anyLeft(param1, "-", 0, length-1)){
        let calcIndex = findSecondPrioCalc(param1, 0, length-1);
        calcResult = doSmallCalc(param1[calcIndex-1], param1[calcIndex+1], param1[calcIndex]);
        param1 = updateTable(param1, calcIndex-1, calcIndex+1, calcResult);
    }
    return calcResult;
}
function updateTable(param1, param2, param3, param4){
    let subArray = param1;
    let leftIndex = param2;
    let rightIndex = param3;
    let calcResult = param4;
    let toDelete = rightIndex - leftIndex + 1;
    // Replace the calculation in the table by the result
    subArray.splice(leftIndex, toDelete, calcResult);
    return subArray;
}
function isANumber(param1){
    let length = param1.length;
    for(let i = 0; i<length; i++){
        if(param1[i].charCodeAt() < 48 || param1[i].charCodeAt() > 57){
            return false;
        }
    }
    return true;
}
function isFirstPriority(param1){
    let symbol = param1;
    if(symbol == "*" || symbol == "/" || symbol == "%"){
        return true;
    }
    return false;
}
function isSecondPriority(param1){
    let symbol = param1;
    if(symbol == "+" || symbol == "-"){
        return true;
    }
    return false;
}
// Multiplications, Division, Modulo
function findFirstPrioCalc(param1, param2, param3){
    let subArray = param1;
    let leftIndex = param2;
    let rightIndex = param3;
    for(let i = leftIndex; i < rightIndex; i++){
        if(isFirstPriority(subArray[i])){
            return i;
        }
    }
}
// Additions, substractions
function findSecondPrioCalc(param1, param2, param3){
    let subArray = param1;
    let leftIndex = param2;
    let rightIndex = param3;
    for(let i = leftIndex; i < rightIndex; i++){
        if(isSecondPriority(subArray[i])){
            return i;
        }
    }
}
// Inner calculations
function doSmallCalc(param1, param2, param3){
    let nb1 = parseInt(param1);
    let nb2 = parseInt(param2);
    let operator = param3;
    let result;
    if(operator == "+"){
        result = nb1 + nb2;
        return result;
    }
    else if(operator == "-"){
        result = nb1 - nb2;
        return result;
    }
    else if(operator == "*"){
        result = nb1 * nb2;
        return result;
    }
    else if(operator == "/"){
        result = nb1 / nb2;
        return result;
    }
    else if(operator == "%"){
        result = nb1 % nb2;
        return result;
    }
}

// Part 1: Parsing
argList = process.argv.splice(2, process.argv.length-1);
nbArg = argList.length;
expression = argList[0];

// Part 2: Error Management
if(!nbArgCheck(nbArg)){
    console.log("Error: please enter an arithmetic expression as one argument.")
    return;
}

// Part 3: Resolution
newExpression = formatExpression(expression);
finalResult = doFullCalc(newExpression);

// Part 4: Display results
console.log(finalResult);
