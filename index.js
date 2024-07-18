"use strict";
function SetOutside(area, shapes) {
    var input = document.getElementById(area);
    if (input != null) {
        input.value = shapes;
    }
}
function SolveEncounter() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    //get inside shapes values
    var inside = (_a = document.getElementById("insideShapes")) === null || _a === void 0 ? void 0 : _a.value.toUpperCase();
    //get outside object
    var outside = {
        left: (_b = document.getElementById("leftShapes")) === null || _b === void 0 ? void 0 : _b.value.toUpperCase(),
        mid: (_c = document.getElementById("midShapes")) === null || _c === void 0 ? void 0 : _c.value.toUpperCase(),
        right: (_d = document.getElementById("rightShapes")) === null || _d === void 0 ? void 0 : _d.value.toUpperCase()
    };
    //determine dunks to get to valid shapes
    var currentState = outside;
    var usePureShapes = (_e = document.getElementById("pureShapes")) === null || _e === void 0 ? void 0 : _e.checked;
    var usedShapes = [];
    var validSolutions = {
        left: DetermineCorrectShapes(inside[0], usePureShapes, currentState.left, usedShapes),
        mid: DetermineCorrectShapes(inside[1], usePureShapes, currentState.mid, usedShapes),
        right: DetermineCorrectShapes(inside[2], usePureShapes, currentState.right, usedShapes)
    };
    console.log(validSolutions);
    var dunks = [];
    var allCorrect = false;
    while (!allCorrect) {
        var leftCorrect = false;
        var midCorrect = false;
        var rightCorrect = false;
        var dunk = {
            left: null,
            mid: null,
            right: null
        };
        //sort left state
        currentState.left = currentState.left.split('').sort().join('');
        currentState.mid = currentState.mid.split('').sort().join('');
        currentState.right = currentState.right.split('').sort().join('');
        //check left to right
        while (leftCorrect == false) {
            if (validSolutions.left != currentState.left) {
                //left needs work
                //figure out which shape to get rid of
                if (validSolutions.left.includes(currentState.left[0])) {
                    dunk.left = currentState.left[1]; //C
                    currentState.left = currentState.left[0];
                }
                else {
                    dunk.left = currentState.left[0]; //T
                    currentState.left = currentState.left[1];
                }
                var shapedNeeded = DetermineMissingLetterInString(currentState.left, validSolutions.left);
                //check mid and right to see if they have the needed shape
                if (currentState.mid.includes(shapedNeeded)) {
                    dunk.mid = shapedNeeded;
                    currentState.mid = currentState.mid.replace(shapedNeeded, "");
                    currentState.mid = currentState.mid + dunk.left;
                }
                else if (currentState.right.includes(shapedNeeded)) {
                    dunk.right = shapedNeeded;
                    currentState.right = currentState.right.replace(shapedNeeded, "");
                    currentState.right = currentState.right + dunk.left;
                }
                //we have our dunk so do the dunk
                dunks.push(dunk);
                currentState.left = currentState.left + (dunk.mid ? dunk.mid : dunk.right);
                dunk = {
                    left: null,
                    mid: null,
                    right: null
                };
                currentState.left = currentState.left.split('').sort().join('');
                //do another check to see if we are now good
                if (validSolutions.left == currentState.left) {
                    leftCorrect = true;
                }
            }
            else {
                leftCorrect = true;
            }
        }
        //mid
        currentState.mid = currentState.mid.split('').sort().join('');
        while (midCorrect == false) {
            if (validSolutions.mid != currentState.mid) {
                //mid needs work
                //figure out which shape to get rid of
                if (validSolutions.mid.includes(currentState.mid[0])) {
                    dunk.mid = currentState.mid[1]; //C
                    currentState.mid = currentState.mid[0];
                }
                else {
                    dunk.mid = currentState.mid[0]; //T
                    currentState.mid = currentState.mid[1];
                }
                var shapeNeeded = DetermineMissingLetterInString(currentState.mid, validSolutions.mid);
                //check left and right to see if they have the needed shape
                if (currentState.left.includes(shapeNeeded) && leftCorrect != true) {
                    dunk.left = shapeNeeded;
                    currentState.left = currentState.left.replace(shapeNeeded, "");
                    currentState.left = currentState.left + dunk.mid;
                }
                else if (currentState.right.includes(shapeNeeded)) {
                    dunk.right = shapeNeeded;
                    currentState.right = currentState.right.replace(shapeNeeded, "");
                    currentState.right = currentState.right + dunk.mid;
                }
                dunks.push(dunk);
                currentState.mid = currentState.mid + (dunk.right ? dunk.right : dunk.left);
                dunk = {
                    left: null,
                    mid: null,
                    right: null
                };
                currentState.mid = currentState.mid.split('').sort().join('');
                //check if we are good
                if (validSolutions.mid == currentState.mid) {
                    midCorrect = true;
                }
            }
            else {
                midCorrect = true;
            }
        }
        currentState.right = currentState.right.split('').sort().join('');
        //right
        if (validSolutions.right != currentState.right) {
            //this happens when we need an extra dunk, such as CST inside and CC SS TT outside
            //right needs work
            //figure out which shape to get rid of
            if (validSolutions.right.includes(currentState.right[0])) {
                dunk.right = currentState.right[1]; //C
                currentState.right = currentState.right[0];
            }
            else {
                dunk.right = currentState.right[0]; //T
                currentState.right = currentState.right[1];
            }
            var shapeNeeded = DetermineMissingLetterInString(currentState.right, validSolutions.right);
            //check left and mid to see if they have the needed shape
            if (currentState.left.includes(shapeNeeded) && leftCorrect != true) {
                dunk.left = shapeNeeded;
                currentState.left = currentState.left.replace(shapeNeeded, "");
                currentState.left = currentState.left + dunk.right;
            }
            else if (currentState.mid.includes(shapeNeeded) && midCorrect != true) {
                dunk.mid = shapeNeeded;
                currentState.mid = currentState.mid.replace(shapeNeeded, "");
                currentState.mid = currentState.mid + dunk.right;
            }
            dunks.push(dunk);
            currentState.right = currentState.right + (dunk.mid ? dunk.mid : dunk.left);
            currentState.right = currentState.right.split('').sort().join('');
            if (validSolutions == currentState.right) {
                rightCorrect = true;
            }
        }
        else {
            rightCorrect = true;
        }
        if (leftCorrect == true && rightCorrect == leftCorrect && leftCorrect == midCorrect) {
            allCorrect = true;
        }
    }
    console.log("Solutions: " + JSON.stringify(validSolutions));
    console.log(validSolutions);
    console.log("Dunks: " + JSON.stringify(dunks));
    console.log(dunks);
    console.log("Current State: " + JSON.stringify(currentState));
    console.log(currentState);
    if (validSolutions.left == currentState.left && validSolutions.mid == currentState.mid && validSolutions.right == currentState.right) {
        console.log("All Correct!");
        var steps = document.getElementById("steps");
        steps.innerHTML = "";
        for (var i = 0; i < dunks.length; i++) {
            var step = document.createElement("li");
            var leftMessage = dunks[i].left ? dunks[i].left : "x";
            var midMessage = dunks[i].mid ? dunks[i].mid : "x";
            var rightMessage = dunks[i].right ? dunks[i].right : "x";
            step.innerHTML = leftMessage + " " + midMessage + " " + rightMessage;
            steps === null || steps === void 0 ? void 0 : steps.appendChild(step);
        }
        //determine what shapes need to be shown
        var leftShape = (_f = document.getElementById(currentState.left)) === null || _f === void 0 ? void 0 : _f.cloneNode(true);
        var midShape = (_g = document.getElementById(currentState.mid)) === null || _g === void 0 ? void 0 : _g.cloneNode(true);
        var rightShape = (_h = document.getElementById(currentState.right)) === null || _h === void 0 ? void 0 : _h.cloneNode(true);
        //remove hideThis class
        leftShape.classList.remove("hideThis");
        midShape.classList.remove("hideThis");
        rightShape.classList.remove("hideThis");
        //show these shapes
        var container = document.getElementById("finalShapeContainer");
        container.innerHTML = "";
        container.appendChild(leftShape);
        container.appendChild(midShape);
        container.appendChild(rightShape);
    }
    else {
        alert('error');
    }
}
function DetermineMissingLetterInString(str, goal) {
    //T -> TS
    if (goal[0] == str) {
        return goal[1];
    }
    else {
        return goal[0];
    }
}
function DetermineCorrectShapes(insideShape, usePureShapes, stateShape, usedShapes) {
    var validShapes = [];
    switch (insideShape) {
        case "C":
            validShapes = ["ST", "SS", "TT"];
            break;
        case "S":
            validShapes = ["CT", "TT", "CC"];
            break;
        case "T":
            validShapes = ["CS", "CC", "SS"];
            break;
    }
    if (usePureShapes) {
        //remove first element of array, keeping the other two
        validShapes = validShapes.slice(1);
        //determine which shape is easiest to make
        if (validShapes[0].includes(stateShape[0]) || validShapes[0].includes(stateShape[1])) {
            //if this shape is already in there, then we use the other shape.
            if (usedShapes.indexOf(validShapes[0]) != -1) {
                usedShapes.push(validShapes[1]);
                return validShapes[1];
            }
            usedShapes.push(validShapes[0]);
            return validShapes[0];
        }
        else {
            if (usedShapes.indexOf(validShapes[1]) != -1) {
                usedShapes.push(validShapes[0]);
                return validShapes[0];
            }
            usedShapes.push(validShapes[1]);
            return validShapes[1];
        }
    }
    else {
        //return only first element of array
        validShapes = validShapes.slice(0, 1);
        usedShapes.push(validShapes[0]);
        return validShapes[0];
    }
}
function ToggleStyle(checked) {
    var _a, _b;
    if (checked) {
        //add the fun styling
        var buttonContainers = document.getElementsByClassName("button-container");
        for (var i = 0; i < buttonContainers.length; i++) {
            for (var j = 0; j < buttonContainers[i].children.length; j++) {
                if (i == 0) {
                    buttonContainers[i].children[j].classList.add("arc-button");
                }
                else if (i == 1) {
                    buttonContainers[i].children[j].classList.add("solar-button");
                }
                else {
                    buttonContainers[i].children[j].classList.add("void-button");
                }
            }
        }
        //add prismatic back
        (_a = document.getElementById("finalShapeContainer")) === null || _a === void 0 ? void 0 : _a.classList.add("prismatic-color");
    }
    else {
        var buttonContainers = document.getElementsByClassName("button-container");
        for (var i = 0; i < buttonContainers.length; i++) {
            for (var j = 0; j < buttonContainers[i].children.length; j++) {
                if (i == 0) {
                    buttonContainers[i].children[j].classList.remove("arc-button");
                }
                else if (i == 1) {
                    buttonContainers[i].children[j].classList.remove("solar-button");
                }
                else {
                    buttonContainers[i].children[j].classList.remove("void-button");
                }
            }
        }
        //add prismatic back
        (_b = document.getElementById("finalShapeContainer")) === null || _b === void 0 ? void 0 : _b.classList.remove("prismatic-color");
    }
}
