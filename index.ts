
function SetOutside(area: string, shapes: string): void {
    var input: HTMLInputElement | null = <HTMLInputElement> document.getElementById(area);
    if(input != null) {
        input.value = shapes;
    }
}

function SetInside(shape: string)
{
    var input: HTMLInputElement | null = <HTMLInputElement> document.getElementById("insideShapes");
    if(input != null) {
        var startVal = input.value;
        if(startVal.length == 3)
        {
            startVal = startVal.slice(1);
        }
        //add new character
        startVal = startVal + shape;
        input.value = startVal;
    }
}

function SolveEncounter() : void {
    //get inside shapes values
    var inside: string = (<HTMLInputElement>document.getElementById("insideShapes"))?.value.toUpperCase();
    //get outside object
    var outside: any = {
        left: (<HTMLInputElement>document.getElementById("leftShapes"))?.value.toUpperCase(),
        mid: (<HTMLInputElement>document.getElementById("midShapes"))?.value.toUpperCase(),
        right: (<HTMLInputElement>document.getElementById("rightShapes"))?.value.toUpperCase()
    }

    //determine if its a valid start
    var fullString = outside.left + outside.mid + outside.right;
    if(fullString.length != 6 || fullString.split("C").length - 1 != 2 || 
    fullString.split("S").length - 1 != 2 || fullString.split("T").length - 1 != 2)
    {
        alert("Invalid Outside shapes");
        return;
    }

    //determine dunks to get to valid shapes
    var currentState: any = outside;

    //get first element of inside

    var usePureShapes: boolean = (<HTMLInputElement>document.getElementById("pureShapes"))?.checked;
    var usedShapes: string[] = [];
    var validSolutions: any = {
        left: DetermineCorrectShapes(inside,0, usePureShapes, currentState.left, usedShapes, []),
        mid: DetermineCorrectShapes(inside,1, usePureShapes, currentState.mid, usedShapes, [inside[0]] as string[] ),
        right: DetermineCorrectShapes(inside,2, usePureShapes, currentState.right, usedShapes, [inside[0], inside[1]] as string[])
    }

    console.log(validSolutions);

    

    var dunks: any = [];
    
    var allCorrect: Boolean = false;

    while(!allCorrect)
    {
        var leftCorrect : boolean = false;
        var midCorrect : boolean = false;
        var rightCorrect : boolean = false;
        var dunk: any = {
            left: null,
            mid: null,
            right: null
        };
        
        //sort left state
        currentState.left = currentState.left.split('').sort().join('');
        currentState.mid = currentState.mid.split('').sort().join('');
        currentState.right = currentState.right.split('').sort().join('');

        //check left to right
        while(leftCorrect == false){
            if(validSolutions.left != currentState.left)
            {
                //left needs work
                //figure out which shape to get rid of
                if(validSolutions.left.includes(currentState.left[0]))
                {
                    dunk.left = currentState.left[1] //C
                    currentState.left = currentState.left[0];
                }
                else
                {
                    dunk.left = currentState.left[0]; //T
                    currentState.left = currentState.left[1];
                }
                
                var shapedNeeded = DetermineMissingLetterInString(currentState.left, validSolutions.left);
                //check mid and right to see if they have the needed shape
                if(currentState.mid.includes(shapedNeeded))
                {
                    dunk.mid = shapedNeeded;
                    currentState.mid = currentState.mid.replace(shapedNeeded, "");
                    currentState.mid = currentState.mid + dunk.left;
                }
                else if(currentState.right.includes(shapedNeeded))
                {
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
                if(validSolutions.left == currentState.left)
                {
                    leftCorrect = true;
                }
            }
            else
            {
                leftCorrect = true;
            }
        }
        //mid
        currentState.mid = currentState.mid.split('').sort().join('');
        while(midCorrect == false){
            if(validSolutions.mid != currentState.mid)
            {
                //mid needs work
                //figure out which shape to get rid of
                if(validSolutions.mid.includes(currentState.mid[0]))
                {
                    dunk.mid = currentState.mid[1] //C
                    currentState.mid = currentState.mid[0];
                }
                else
                {
                    dunk.mid = currentState.mid[0]; //T
                    currentState.mid = currentState.mid[1];
                }

                var shapeNeeded = DetermineMissingLetterInString(currentState.mid, validSolutions.mid);
                //check left and right to see if they have the needed shape
                if(currentState.left.includes(shapeNeeded) && leftCorrect != true)
                {
                    dunk.left = shapeNeeded;
                    currentState.left = currentState.left.replace(shapeNeeded, "");
                    currentState.left = currentState.left + dunk.mid;
                }
                else if(currentState.right.includes(shapeNeeded))
                {
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
                if(validSolutions.mid == currentState.mid)
                {
                    midCorrect = true;
                }
            }
            else
            {
                midCorrect = true;
            }
        }

        currentState.right = currentState.right.split('').sort().join('');
        //right
        if(validSolutions.right != currentState.right){
            //this happens when we need an extra dunk, such as CST inside and CC SS TT outside
            //right needs work
            //figure out which shape to get rid of
            if(validSolutions.right.includes(currentState.right[0]))
            {
                dunk.right = currentState.right[1] //C
                currentState.right = currentState.right[0];
            }
            else
            {
                dunk.right = currentState.right[0]; //T
                currentState.right = currentState.right[1];
            }

            var shapeNeeded = DetermineMissingLetterInString(currentState.right, validSolutions.right);
            //check left and mid to see if they have the needed shape
            if(currentState.left.includes(shapeNeeded) && leftCorrect != true)
            {
                dunk.left = shapeNeeded;
                currentState.left = currentState.left.replace(shapeNeeded, "");
                currentState.left = currentState.left + dunk.right;
            }
            else if(currentState.mid.includes(shapeNeeded) && midCorrect != true)
            {
                dunk.mid = shapeNeeded;
                currentState.mid = currentState.mid.replace(shapeNeeded, "");
                currentState.mid = currentState.mid + dunk.right;
            }

            dunks.push(dunk);
            currentState.right = currentState.right + (dunk.mid ? dunk.mid : dunk.left);
            currentState.right = currentState.right.split('').sort().join('');

            if(validSolutions == currentState.right)
            {
                rightCorrect = true;        
            }
        }
        else
        {
            rightCorrect = true;
        }

        if(leftCorrect == true && rightCorrect == leftCorrect && leftCorrect == midCorrect)
        {
            allCorrect = true;
        }
    }

    console.log("Solutions: " + JSON.stringify(validSolutions));
    console.log(validSolutions);
    console.log("Dunks: " + JSON.stringify(dunks));
    console.log(dunks);
    console.log("Current State: " + JSON.stringify(currentState));
    console.log(currentState);
    if(validSolutions.left == currentState.left && validSolutions.mid == currentState.mid && validSolutions.right == currentState.right)
    {
        console.log("All Correct!");

        var steps: HTMLOListElement | null = <HTMLOListElement> document.getElementById("steps");
        steps.innerHTML = "";
        for(var i = 0; i < dunks.length; i++)
        {
            var step: HTMLLIElement = document.createElement("li");
            var leftMessage = dunks[i].left ? dunks[i].left : "x";
            var midMessage = dunks[i].mid ? dunks[i].mid : "x";
            var rightMessage = dunks[i].right ?  dunks[i].right : "x";
            step.innerHTML = leftMessage + " " + midMessage + " " + rightMessage;
            steps?.appendChild(step);
        }
        
        //determine what shapes need to be shown
        var leftShape: HTMLImageElement = <HTMLImageElement> document.getElementById(currentState.left)?.cloneNode(true);
        var midShape: HTMLImageElement = <HTMLImageElement> document.getElementById(currentState.mid)?.cloneNode(true);
        var rightShape: HTMLImageElement = <HTMLImageElement> document.getElementById(currentState.right)?.cloneNode(true);

        //remove hideThis class
        leftShape.classList.remove("hideThis");
        midShape.classList.remove("hideThis");
        rightShape.classList.remove("hideThis");

        //show these shapes
        var container: HTMLElement = <HTMLElement>document.getElementById("finalShapeContainer");
        container.innerHTML = "";
        
        container.appendChild(leftShape);
        container.appendChild(midShape);
        container.appendChild(rightShape);
    }
    else
    {
        alert('error');
    }
}

function DetermineMissingLetterInString(str: string, goal: string): string {
    //T -> TS
    if(goal[0] == str)
    {
        return goal[1];
    }
    else
    {
        return goal[0];
    }
}

function DetermineCorrectShapes(insideShape: string, index: number, usePureShapes: boolean, stateShape: any, usedShapes: string[], processedShapes: string[]) {
    var validShapes: string[] = [];
    switch(insideShape[index]) {
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

    if(usePureShapes) {
        //remove first element of array, keeping the other two
        validShapes = validShapes.slice(1);

        //check if both of our options are valid
        if(usedShapes.indexOf(validShapes[0]) == -1 && usedShapes.indexOf(validShapes[1]) == -1 && usedShapes.length > 0)
        {
            //both shapes can be used, so lets make sure that the last shape doesn't need it
            //get last shape
            var lastInside = insideShape[2];
            //if one of my solutions has the last shapes letter, i need to use that one.
            if(lastInside == validShapes[0][0] || lastInside == validShapes[1][0])
            {
                //use his double shape
                return lastInside + lastInside;
            }
        }

        //determine which shape is easiest to make
        if(validShapes[0].includes(stateShape[0]) || validShapes[0].includes(stateShape[1]))
        {
            //if this shape is already in there, then we use the other shape.
            if(usedShapes.indexOf(validShapes[0]) != -1)
            {
                usedShapes.push(validShapes[1]);
                return validShapes[1];
            }
            usedShapes.push(validShapes[0]);
            return validShapes[0];
        }
        else
        {
            if(usedShapes.indexOf(validShapes[1]) != -1)
            {
                usedShapes.push(validShapes[0]);
                return validShapes[0];
            }
            usedShapes.push(validShapes[1]);
            return validShapes[1];
        }
    }
    else
    {
        //return only first element of array
        validShapes = validShapes.slice(0, 1);
        usedShapes.push(validShapes[0]);
        return validShapes[0];
    }
}

function ToggleStyle(checked: boolean)
{
    if(checked)
    {
        //add the fun styling
        var buttonContainers :HTMLCollectionOf<Element> = document.getElementsByClassName("button-container");
        for(var i = 0; i < buttonContainers.length; i++)
        {
            for(var j = 0; j < buttonContainers[i].children.length; j++)
            {
                if(i == 0)
                {
                    buttonContainers[i].children[j].classList.add("stasis-button");
                }
                else if(i == 1)
                {
                    buttonContainers[i].children[j].classList.add("arc-button");
                }
                else if(i == 2) {
                    buttonContainers[i].children[j].classList.add("solar-button");
                }
                else
                {
                    buttonContainers[i].children[j].classList.add("void-button");
                }
            }
            
        }

        //add prismatic back
        document.getElementById("finalShapeContainer")?.classList.add("prismatic-color");
    }
    else
    {
        var buttonContainers :HTMLCollectionOf<Element> = document.getElementsByClassName("button-container");
        for(var i = 0; i < buttonContainers.length; i++)
        {
            for(var j = 0; j < buttonContainers[i].children.length; j++)
            {
                if(i == 0)
                {
                    buttonContainers[i].children[j].classList.remove("stasis-button");
                }
                else if(i == 1)
                {
                    buttonContainers[i].children[j].classList.remove("arc-button");
                }
                else if(i == 2) {
                    buttonContainers[i].children[j].classList.remove("solar-button");
                }
                else
                {
                    buttonContainers[i].children[j].classList.remove("void-button");
                }
            }
            
        }

        //add prismatic back
        document.getElementById("finalShapeContainer")?.classList.remove("prismatic-color");
    }
}