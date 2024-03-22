document.addEventListener("DOMContentLoaded", () =>{

    createSquares();
    setDate();
    // setWord()
    document.getElementById("word-container").classList.add("animate__animated");
    // createWord("GRUND");

    const shift = 1;
    let guessedWords = [[]];
    let availableSpace = 1;
    let guessedWordCount = 0;
    let level = 1;
    let onPause = false;
    let currentRGB = [190, 210, 230];
    const letters = "qwertyuiopasdfghjklzxcvbnm";

    let easy = [];
    let medium = [];
    let hard = [];
    readTextFile("bank/EASY__2_usa.json", function(text1){
        easy = JSON.parse(text1);
        setWord();
    });
    readTextFile("bank/MEDIUM_2_SUBTRACT2_usa.json", function(text2){
        medium = JSON.parse(text2);
        // readTextFile("bank/HARD__2_words_alpha.json", function(text3){
        readTextFile("bank/HARD_2_SUBTRACT3_usa.json", function(text3){
            hard = JSON.parse(text3);
        });
    });

    const keys = document.querySelectorAll('.keyboard-row button');

    for (let i = 0; i < keys.length; i++){
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute('data-key');

            updateGuessedWords(letter);
        }
    }

    document.addEventListener("keydown", function onEvent(event) {

        if (onPause){
            return
        }

        for (i = 0; i < letters.length; i++){
            if (event.key === letters[i]) {
                updateGuessedWords(letters[i]);
            }
        }

        if (event.key === "Delete" || event.key === "Backspace") {
        // if (event.keyCode === 8 || event.keyCode === 46) {
            updateGuessedWords('del');
        }

        if (event.key === 'Enter') {
            updateGuessedWords('enter');
        }
    });

    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    function todayWord() {

        // var d1 = new Date("02/11/2024");   
        var d1 = new Date("03/22/2024");   
        var d2 = new Date();   
        var diff = d2.getTime() - d1.getTime();
        var daydiff = Number((diff / 86400000).toFixed(0)) + shift;

        // THREE DATA SETS

        if (level == 1){
            return [
                easy[daydiff - 1][1][0][0].toUpperCase(),
                easy[daydiff - 1][1][1][0].toUpperCase(),
                easy[daydiff - 1][0].toUpperCase(),
                easy[daydiff - 1][1][0][1],
                easy[daydiff - 1][1][1][1]
            ]  
        }

        if (level == 2){
            return [
                medium[daydiff - 1][1][0][0].toUpperCase(),
                medium[daydiff - 1][1][1][0].toUpperCase(),
                medium[daydiff - 1][0].toUpperCase(),
                medium[daydiff - 1][1][0][1],
                medium[daydiff - 1][1][1][1]
            ]  
        }

        if (level == 3){
            return [
                hard[daydiff - 1][1][0][0].toUpperCase(),
                hard[daydiff - 1][1][1][0].toUpperCase(),
                hard[daydiff - 1][0].toUpperCase(),
                hard[daydiff - 1][1][0][1],
                hard[daydiff - 1][1][1][1]
            ]  
        }


        // ONE DATA SET

        // return [
        //     data[daydiff * 3 + level - 1][1][0][0].toUpperCase(),
        //     data[daydiff * 3 + level - 1][1][1][0].toUpperCase(),
        //     data[daydiff * 3 + level - 1][0].toUpperCase(),
        //     data[daydiff * 3 + level - 1][1][0][1],
        //     data[daydiff * 3 + level - 1][1][1][1]
        // ]
        
    }

    function setWord() {
        let ans = todayWord();

        document.getElementById("word").innerHTML = ans[2];
    }

    // checks if the last typed word equals a string
    function idIsWord(lastId, word){
        for (i = 0; i < 6; i++){
            if (document.getElementById(String(lastId-6+i)).innerText  != word[i]){
                return false
            }
        }
        return true;
    }

    // checks if the last typed word equals previous typed word
    function idIsId(lastId){
        for (i = 0; i < 6; i++){
            if (document.getElementById(String(lastId-6+i)).innerText  != document.getElementById(String(lastId-12+i)).innerText){
                return false
            }
        }
        return true;
    }

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }
    
    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr();

        if (letter == 'del'){
            if (currentWordArr.length > 0){
                currentWordArr.pop();
                availableSpace = availableSpace - 1;
                const availableSpaceEl = document.getElementById(String(availableSpace));
                availableSpaceEl.textContent = "";
            }
        }

        else if (letter == 'enter'){
            ans = todayWord();
            if (currentWordArr.length == 6){

                if (idIsWord(availableSpace, ans[0]) || idIsWord(availableSpace, ans[1])){

                    if (guessedWordCount ==0 || ! idIsId(availableSpace)){
                        handleCorrectWord();
                        
                    }
                    else{
                        handleIncorrectWord();
                    }
                    
                }
                else{
                    handleIncorrectWord();
                }
            }
        }

        else if (currentWordArr && currentWordArr.length < 6) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));

            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

    function interpolateRGB (start, end, percent){
        let a = [];
        for (i = 0; i < start.length; i++){
            a.push(start[i]*(1-percent) + end[i]*percent);
        }
        return a;
    }

    function nextLevel(){
        guessedWords = [[]];
        availableSpace = 1;
        guessedWordCount = 0;
        level += 1;
        onPause = true;

        if (level > 3){
            setTimeout(() => {
                document.getElementById("board-container").classList.add("animate__animated");
                document.getElementById("keyboard-container").classList.add("animate__animated");

                document.getElementById("word-container").classList.add("animate__fadeOut")
                document.getElementById("board-container").classList.add("animate__fadeOut")
                document.getElementById("keyboard-container").classList.add("animate__fadeOut")

                onPause = false;
                
            }, 2800);
        }
        else{

            for (let ms = 0; ms < 2000; ms = ms + 1){
                setTimeout(() => {
                    let percent = ms / 2000;
                    let color = [];
                    if (level == 2){
                        color = interpolateRGB(currentRGB, [196, 190, 230], percent);
                    }
                    if (level == 3){
                        color = interpolateRGB(currentRGB, [245, 142, 138], percent);
                        dark = interpolateRGB([116, 126, 140], [0, 0, 0], percent)
                        document.documentElement.style.setProperty('--dark', `rgb(${dark[0]}, ${dark[1]}, ${dark[2]})`);
                    }
                    document.documentElement.style.setProperty('--background-color', `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
                    if (ms == 1999){
                        currentRGB = color;
                    }

                }, 2800+ms)
            }

            setTimeout(() => {
                for (i = 1; i < 13; i++){
                    const letterEl = document.getElementById(i);
                    letterEl.classList.add("animate__fadeOut")
                }
                document.getElementById("word-container").classList.add("animate__fadeOut")
            }, 2800);
            setTimeout(() => {

                for (i = 1; i < 13; i++){
                    const letterEl = document.getElementById(i);
                    letterEl.classList.remove("animate__fadeOut");
                    letterEl.classList.add("animate__fadeIn");
                }
                document.getElementById("word-container").classList.remove("animate__fadeOut")
                document.getElementById("word-container").classList.add("animate__fadeIn")

                ans = todayWord();
                document.getElementById("word").innerHTML = ans[2];

                document.getElementById("level").innerHTML = `Daily Puzzle ${level}/3`;
    
                for (i = 1; i < 13; i++){
                    const letterEl = document.getElementById(i);
                    letterEl.style = "";
                    letterEl.innerHTML = "";
                }
            }, 3800);
            setTimeout(() => {
                for (i = 1; i < 13; i++){
                    const letterEl = document.getElementById(i);
                    letterEl.classList.remove("animate__fadeIn")
                }
                document.getElementById("word-container").classList.remove("animate__fadeIn")

                onPause = false;

            }, 4800);
        }
    }


    var wait = (ms) => {
        const start = Date.now();
        let now = start;
        while (now - start < ms) {
          now = Date.now();
        }
    }

    function handleCorrectWord(){

        const firstLetterId = guessedWordCount * 6 + 1;
        const interval = 300;

        currentWordArr = getCurrentWordArr();

        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = "var(--correct)";

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`

            }, interval * index)
        });

        setTimeout(() => {
            currentWordArr.forEach((letter, index) => {
            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.remove("animate__flipInX");
            });
        }, 6*interval);

        guessedWordCount += 1;

        
        guessedWords.push([]);

        if (guessedWords.length === 3){
            nextLevel();
        }


        // for (i = 0; i < 6; i++){
        //     document.getElementById(String(availableSpace-i-1)).classList.add("green");
        // }
    }

    function handleIncorrectWord(){
        const firstLetterId = guessedWordCount * 6 + 1;
        currentWordArr = getCurrentWordArr();

        currentWordArr.forEach((letter, index) => {


            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add("animate__headShake");
        });

        setTimeout(() => {
            for (index = 0; index < 12; index += 1){
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.remove("animate__headShake");
            }
        }, 500)

        
    }

    function createWord(dailyWord) {
        const word = document.getElementById("word");

        for (let i = 0; i < 5; i++) {
            let letter = document.createElement("div");
            letter.classList.add("letter");
            letter.innerHTML = dailyWord[i];
            word.appendChild(letter);
        }
    }
    
    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let i = 0; i < 12; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", i+1);
            gameBoard.appendChild(square);
        }
    }

    function setDate() {
        var objToday = new Date(),
        weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
        dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
        months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
        curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";

        var today = curMonth + " " + dayOfMonth + ", " + curYear;

        document.getElementById("date").innerHTML = today;
    }
})