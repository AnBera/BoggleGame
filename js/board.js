
var board = function (width, height) {
    this.canvasMatrix = [],
    this.width = parseInt(width),
    this.height = parseInt(height);
};

board.prototype.initilizeCanvas = function (valueArr) {
    //create a w x h matrix and initialize with values provided
    while(valueArr.length) {
        this.canvasMatrix.push(valueArr.splice(0,this.width));
    }    
}

board.prototype.render = function() {
    console.log('Rendering Started from board constructor');
    let boardContainer = document.getElementById('board');
    
    for (let i = 0; i < this.height; i++) {
        let rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        for (let j = 0; j < this.width; j++) {
            let colDiv = document.createElement('div');
            colDiv.className = 'col';
            let letterTxt = document.createTextNode(this.canvasMatrix[i][j] );
            colDiv.appendChild(letterTxt);
            colDiv.dataset.i = i;
            colDiv.dataset.j = j;
            rowDiv.appendChild(colDiv);
        }
        boardContainer.appendChild(rowDiv);
    }
    
};

board.prototype.find = function (inputString) {
    // var found = false;
    var that = this;//, pixelContent = this.canvasMatrix[y - 1][x - 1];

    //eligible Pixel Condition
    var check_validity = function (x, y, prefix, visitedTrail) {
        //boundary condition
        if (x >= 0 && x < that.height && y >= 0 && y < that.width) {

            var isVisited = function(x, y, visitedArr){
                for (let p = 0; p < visitedArr.length; p++) {
                    if(visitedArr[p].i === x && visitedArr[p].j === y){
                        return true;
                    }
                }
                return false;
            };
            //if the color is same as the starting fill coordinate and if its not visited        
            if (inputString.startsWith(prefix + that.canvasMatrix[x][y]) && !isVisited(x, y, visitedTrail) ){
                console.log('- - - - - - - - - ');
                console.log('x='+ x +' y='+y);
                console.log('Prefix='+ prefix );
                return true;
            }            
        }
        return false;
    };

    // var paint = function (x, y) {
    //     that.canvasMatrix[y - 1][x - 1] = color;
    // };

    // //start with a fresh visited matrix, everytime fill is called
    // resetMatrix(this.visitedMatrix, this.width, this.height);

    var q = new queue();

    for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
            if(inputString[0] == this.canvasMatrix[i][j]) {
                q.enqueue([ i, j, this.canvasMatrix[i][j], [{i:i, j:j}] ]);
                console.log('i='+ i +' j='+j);
            }
        }
    }

    console.log(q);
    
    //####this matrix will take note of all the visited node so that we dont visit it agian
    // this.visitedMatrix[y - 1][x - 1] = 1;

    var addNeighbour = function(neighbourX, neighbourY, prefix, visited){
        let visitedTrail = visited.slice(); //copy the array to avoid refernce
        if (check_validity(neighbourX, neighbourY, prefix, visitedTrail)) {
            visitedTrail.push({i:neighbourX, j:neighbourY});
            console.log('~~~~~~~~~~~~~~~~~');
            console.log(visitedTrail);
            q.enqueue([neighbourX,
                neighbourY, 
                prefix + that.canvasMatrix[neighbourX][neighbourY],
                visitedTrail
            ]);
            // that.visitedMatrix[y1 - 1][x1] = 1;
        }
    };

    //run untill the queue is exhausted
    while (!q.isEmpty()) {
        let item = q.dequeue();
        console.log('==================');
        console.log(item);
        if(item[2] === inputString) {
            // found = true;
            return true;
        }   
        
        let x = item[0],
        y = item[1],
        prefix = item[2],
        visitedTrail = item[3];
        // neighbourX = x

        //check for adjecent 8 pixels - right, left, top, bottom
        addNeighbour(x+1, y, prefix, visitedTrail);
        addNeighbour(x-1, y, prefix, visitedTrail);
        addNeighbour(x, y+1, prefix, visitedTrail);
        addNeighbour(x, y-1, prefix, visitedTrail);
        addNeighbour(x+1, y-1, prefix, visitedTrail);
        addNeighbour(x+1, y+1, prefix, visitedTrail);
        addNeighbour(x-1, y+1, prefix, visitedTrail);
        addNeighbour(x-1, y-1, prefix, visitedTrail);
        
        // if (check_validity(x+1, y, prefix)) {
        //     q.enqueue([x+1, y, prefix + that.canvasMatrix[x+1][y]], visitedTrail.push({i:x+1, j:y}) );
        //     // that.visitedMatrix[y1 - 1][x1] = 1;
        // }

        // if (check_validity(x-1, y, prefix)) {
        //     q.enqueue([x-1, y, prefix + that.canvasMatrix[x-1][y]], visitedTrail.push({i:x+1, j:y}) );
        //     // that.visitedMatrix[y1 - 1][x1] = 1;
        // }

        // if (check_validity(x, y+1, prefix)) {
        //     q.enqueue([x, y+1, prefix + that.canvasMatrix[x][y+1]], visitedTrail.push({i:x+1, j:y}) );
        //     // that.visitedMatrix[y1 - 1][x1] = 1;
        // }

        // if (check_validity(x, y-1, prefix)) {
        //     q.enqueue([x, y-1, prefix + that.canvasMatrix[x][y-1]], visitedTrail.push({i:x+1, j:y}) );
        //     // that.visitedMatrix[y1 - 1][x1] = 1;
        // }

        // if (check_validity(x+1, y-1, prefix)) {
        //     q.enqueue([x+1, y-1, prefix + that.canvasMatrix[x+1][y-1]], visitedTrail.push({i:x+1, j:y}) );
        //     // that.visitedMatrix[y1 - 1][x1] = 1;
        // }
        // if (check_validity(x+1, y+1, prefix)) {
        //     q.enqueue([x+1, y+1, prefix + that.canvasMatrix[x+1][y+1]], visitedTrail.push({i:x+1, j:y}) );
        //     // that.visitedMatrix[y1 - 1][x1] = 1;
        // }

        // if (check_validity(x-1, y+1, prefix)) {
        //     q.enqueue([x-1, y+1, prefix + that.canvasMatrix[x-1][y+1]], visitedTrail.push({i:x+1, j:y}) );
        //     // that.visitedMatrix[y1 - 1][x1] = 1;
        // }
        // if (check_validity(x-1, y-1, prefix)) {
        //     q.enqueue([x-1, y-1, prefix + that.canvasMatrix[x-1][y-1]], visitedTrail.push({i:x+1, j:y}) );
        //     // that.visitedMatrix[y1 - 1][x1] = 1;
        // }

    }
    return false;

};

console.log('board loaded');