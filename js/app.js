
(function () {
    
    var BOGGLE_CONFIG = {
        BOARD_WIDTH : 4,
        BOARD_HEIGHT : 4,
        BOARD_CONFIG_FILE_PATH : 'TestBoard.txt',
        DICTIONARY_FILE_PATH : 'dictionary.txt',
        GAME_TIME : 120
    };

    var boardObj,
        word = '',
        wordsList = [],
        boardConf = [],
        neigbourArr = [],
        visitedArr = [],
        goodWords = [],
        badWords = [],
        timeinterval,
        gameOver = true;

    var resetTurn = function () {
        word = '';
        neigbourArr = [];
        visitedArr = [];

        document.getElementById('entered').value = '';
        let selectedEls = document.getElementsByClassName('selected');
        while (selectedEls.length > 0) {
            selectedEls[0].classList.remove('selected');
        }
    };


    var readFile = function (file, conf, separator) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    // var allText = rawFile.responseText;
                    // alert(allText);
                    let contents = rawFile.responseText;
                    if (contents) {
                        if (conf === 'dict')
                            wordsList = contents.split(separator).map(item => item.trim());
                        if (conf === 'board')
                            boardConf = contents.split(separator).map(item => item.trim());
                    }
                }
            }
        }
        rawFile.send(null);
    };

    var onTileClick = function (event) {
        //if it is an active neighbor
        //clear the array push 8 neighbor in an array after checking boundary condition and visited node
        //make only 8 neighbour to active state all other tiles are disabled (we can check i, j at the beigining)
        //create an word string outside and push the letter to it

        let el = event.target,
            x = parseInt(el.dataset.i),
            y = parseInt(el.dataset.j);
        document.getElementById('error-msg').textContent = '';

        if (gameOver) {
            alert('Start a New Game By Clicking Start Game Button');
            return;
        }

        var isValidClick = function (x, y, neigbourArr, visitedArr) {
            let isValid = false;
            for (let p = 0; p < neigbourArr.length; p++) {
                if (neigbourArr[p][0] === x && neigbourArr[p][1] === y) {
                    isValid = true;
                    break;
                }
            }

            for (let p = 0; p < visitedArr.length; p++) {
                if (visitedArr[p][0] === x && visitedArr[p][1] === y) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        };

        if (neigbourArr.length === 0 || isValidClick(x, y, neigbourArr, visitedArr)) {
            //check boundary
            neigbourArr = [];
            // x = parseInt(x); y = parseInt(y);
            neigbourArr.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1], [x + 1, y - 1], [x + 1, y + 1], [x - 1, y + 1], [x - 1, y - 1]);
            word += el.textContent;
            visitedArr.push([x, y]);

            console.log("Valid Click");
            console.log(word);


            el.classList.add('selected');

        }

        //if clicked on same element
        else if (visitedArr[visitedArr.length - 1][0] === x && visitedArr[visitedArr.length - 1][1] === y) {
            neigbourArr = [];
            visitedArr.splice(-1, 1);
            if (visitedArr.length > 0) {
                x = visitedArr[visitedArr.length - 1][0];
                y = visitedArr[visitedArr.length - 1][1];
                neigbourArr.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1], [x + 1, y - 1], [x + 1, y + 1], [x - 1, y + 1], [x - 1, y - 1]);
            }
            word = word.slice(0, -1);

            console.log("same Click");
            console.log(word);

            if (event.target.classList.contains('selected')) {
                event.target.classList.toggle('selected');
            }
        }
        document.getElementById('entered').value = word;
    };

    var onAddWord = function () {
        let liEl = document.createElement('li');
        let wordText;
        let wordsContainer;
        // document.getElementById('error-msg').textContent = '';

        if (gameOver) {
            alert('Start a New Game');
            return;
        }
        if (word.length === 0) {
            return;
        }

        word = word.toLowerCase();
        if (validateWord()) {
            if (goodWords.indexOf(word) > -1) {
                //word already selected
                document.getElementById('error-msg').textContent = 'word already added';
            } else {
                //good word
                goodWords.push(word);
                wordText = document.createTextNode(word);
                wordsContainer = document.getElementById('right-list');
                document.getElementById('ponits').textContent = goodWords.length + ' Point(s)';
                liEl.appendChild(wordText);
                wordsContainer.appendChild(liEl);
            }
        } else {
            //bad word
            badWords.push(word);
            wordText = document.createTextNode(word);
            wordsContainer = document.getElementById('wrong-list');
            liEl.appendChild(wordText);
            wordsContainer.appendChild(liEl);
        }

        resetTurn();

    };

    var validateWord = function () {
        var indices = [];
        for (let i = 0; i < word.length; i++) {
            if (word[i] === '*')
                indices.push(i);
        }
        if (indices.length === 0 && wordsList.indexOf(word.toLowerCase()) > -1) {
            console.log('word is there');
            return true;
        }

        for (let i = wordsList.length - 1; i >= 0; i--) {
            if (wordsList[i].length === word.length) {
                let equal = true;
                //each word
                for (let j = word.length - 1; j >= 0; j--) {
                    if (indices.indexOf(j) === -1) {
                        if (word[j].toLowerCase() !== wordsList[i][j].toLowerCase()) {
                            equal = false;
                            break; //not match
                        }
                    }
                }
                if (equal) {
                    console.log('word found, the word is - ' + wordsList[i]);
                    word = wordsList[i]; //May be dangerous need to check
                    return equal;
                }

            }
        }
        console.log('word is not present');
        return false;
    };


    var bindEvents = function () {
        document.getElementById('add-word').onclick = onAddWord;
        document.getElementById('start-game').onclick = onStartGame;
        document.getElementById('reset-turn').onclick = resetTurn;

        var colNode = document.getElementsByClassName("col");

        for (let i = 0; i < colNode.length; i++) {
            colNode[i].addEventListener('click', onTileClick, false);
        }
    }

    var createBoard = function () {
        readFile(BOGGLE_CONFIG.BOARD_CONFIG_FILE_PATH, 'board', ',');
        boardObj = new board(BOGGLE_CONFIG.BOARD_WIDTH, BOGGLE_CONFIG.BOARD_HEIGHT);
        boardObj.initilizeCanvas(boardConf);
        boardObj.render();
    };

    var getTimeRemaining = function (endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);

        return {
            'total': t,
            'minutes': minutes,
            'seconds': seconds
        };
    };

    var initializeClock = function (id, endtime) {
        if (timeinterval)
            clearInterval(timeinterval);
        var clock = document.getElementById(id);
        var minutesSpan = clock.querySelector('.minutes');
        var secondsSpan = clock.querySelector('.seconds');

        function updateClock() {
            var t = getTimeRemaining(endtime);

            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            if (t.total <= 0) {
                clearInterval(timeinterval);
                gameOver = true;
            }
        }

        updateClock();
        timeinterval = setInterval(updateClock, 1000);
    };


    var onStartGame = function () {
        gameOver = false;
        resetTurn();
        goodWords = [];
        badWords = [];
        document.getElementById('right-list').innerHTML = '';
        document.getElementById('wrong-list').innerHTML = '';
        document.getElementById('error-msg').textContent = '';
        document.getElementById('ponits').textContent = '0 Point(s)'; //reset points
        var deadline = new Date(Date.parse(new Date()) + BOGGLE_CONFIG.GAME_TIME * 1000);
        initializeClock('clockdiv', deadline);
    };

    createBoard();
    readFile(BOGGLE_CONFIG.DICTIONARY_FILE_PATH, 'dict', '\n');
    bindEvents();

    console.log('app loaded');

    //======find test======
    console.log(boardObj.find('TAPAA'))
    // console.log(boardObj.find('ASS'))
    // console.log(boardObj.find('ASSROX'))
    console.log(boardObj.find('ASSRO'))
    //======find test======

})();