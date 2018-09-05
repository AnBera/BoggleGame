
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

console.log('board loaded');