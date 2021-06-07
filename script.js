"use strict";

//this part down here for reenabling
//$("#letters *").attr("disabled",false);

//game variables
var playerName;
var money;
var tries = 5;
var rounds;
var phrases =["Grilled cheese sandwich", "Computer science", "The Raven", "fried rice", "Call of the wild", "Whatever floats your boat", "James dean", "brad pitt", "kurt cobain", "daft punk", "super mario", "donkey kong", "legend of zelda","elliott smith", "frank ocean", "jack johnson", "kendrick lamar"];
var phrase = phrases[Math.floor(((Math.random()*(phrases.length-1))))];
phrase = phrase.toUpperCase();
var prizeMoney;

$(document).ready(() => {

    if(sessionStorage.getItem("playerName") !== null){
        playerName = sessionStorage.getItem("playerName");
    }
    else{
        playerName = prompt("Please enter your name", "No name");
        if(playerName == null){
            playerName = "No Name";
        }
        sessionStorage.setItem("playerName",playerName);
    }

    //This part creates the grid tiles from the phrase
    var med = window.matchMedia("(min-width: 992px)");
    let maxTiles;
    if(med.matches){
        maxTiles = 14; 
    }
    else{
        maxTiles = 10;
    }
    let arr = phrase.split(" ");
    let currLengthOnLine = 0;

    for(let j=0;j<arr.length;j++){
        for(let i=0;i<arr[j].length;i++){
            let toAdd = "<p>" + arr[j].charAt(i) + "</p>";
            $("#guessGrid").append(toAdd);
        }
        currLengthOnLine+=arr[j].length;
        if(j != arr.length - 1){
            if(arr[j+1].length > (maxTiles - currLengthOnLine)){ 
                /*if how long the next word is larger than how much space is left in line*/
                   $("#guessGrid").append("<br>"); 
                }
                else{
                    $("#guessGrid").append("<span></span>"); 
                }
        }
    }

    document.querySelectorAll(".buttonGuess").forEach(button =>{
        button.addEventListener("click",guessLetter);
    })

    $("#guessActivate").click(chooseGuess);
    $("#buyVowel").click(buyVowel);
    $("#solve").click(solvePuzzle);
    $("#spin").click(spinWheel);
    $("#submitSolution").click(solveCheck);

    $("#consonants").hide();
    $("#vowels").hide();
    $("#textForSolution").hide();

    document.getElementById("guessActivate").disabled = true;

    //Set game variables
    if(sessionStorage.getItem("money") !== null){
        let moneyString = sessionStorage.getItem("money");
        money = parseInt(moneyString);
    }
    else{
        money = 0;
    }

    if(sessionStorage.getItem("rounds") !== null){
        let roundsString = sessionStorage.getItem("rounds");
        rounds = parseInt(roundsString);
    }
    else{
        rounds = 1;
    }

    //update player info
    document.getElementById("playerInfo").innerHTML = playerName + ":  <br>" + money;

    document.getElementById("roundMsg").innerHTML = "Round " + rounds + ":";
});

function guessLetter(event){
    
    let letter = event.target.innerHTML;
    let phraseN = phrase;
    phraseN = phraseN.toUpperCase();
    phraseN = phraseN.replace(/\s/g, "");

    let reward = 0;

    for(let i=0;i<phraseN.length;i++){
        if(phraseN.charAt(i) == letter){
            let selector = "#guessGrid p:nth-of-type(" + (i+1) + ")";
            $(selector).css("color", "var(--lightGreen)");

            //update reward
            reward += prizeMoney;
        }
    }
    event.target.disabled = true;

    if(event.target.parentNode.id == "consonants"){
        consonantGuess(reward);   
    }
    else{
        money -= 250;
        document.getElementById("guessActivate").disabled = true;
        document.getElementById("spin").disabled = false;
        document.getElementById("solve").disabled = false;
        $("#consonants").hide();
        $("#vowels").hide();
        $("#textForSolution").hide();

        //update player info
        document.getElementById("playerInfo").innerHTML = playerName + ":  <br>" + money;
    }
}

function chooseGuess(event){
    $("#consonants").show();
    document.getElementById("guessActivate").disabled = true;
}

function buyVowel(event){
    if(money < 250){
        alert("You don't have enough money!");
    }
    else{
        $("#vowels").show();
        document.getElementById("buyVowel").disabled = true;
    }
}

function solvePuzzle(event){
    $("#textForSolution").show();
    document.getElementById("textF").focus();
    document.getElementById("solve").disabled = true;
}

function spinWheel(event){

    location.hash = "wheel-space";

    $("#textForSolution").hide();
    document.getElementById("guessActivate").disabled = true;
    document.getElementById("buyVowel").disabled = true;
    document.getElementById("spin").disabled = true;
    document.getElementById("solve").disabled = true;

    let randNum = Math.floor(((Math.random()*360)+2520));
    $(":root").css("--spinNum",randNum+"deg");
    $("#wheel").css({
        "animation-name": "spinning",
        "animation-duration": "5s",
        "animation-timing-function": "ease-out",
        "animation-fill-mode": "forwards",
        "animation-iteration-count": "1"
    })
    $(".picker").css({
        "animation-name": "pickerSpin",
        "animation-duration": "0.2s",
        "animation-timing-function": "ease-out",
        "animation-iteration-count": "25"
    })
    setTimeout(function() {

        $("#wheel").css({
            "animation-name": "",
            "animation-duration": "",
            "animation-timing-function": "",
            "animation-fill-mode": "",
            "animation-iteration-count": "",
            "transform": "rotate(var(--spinNum))"
        })
        $(".picker").css({
            "animation-name": "",
            "animation-duration": "",
            "animation-timing-function": "",
            "animation-iteration-count": ""
        })
        spinResult(randNum);
        location.hash = "roundMsg";
    },5000)
}



function spinResult(number){
    let skip = false;
    number %= 360;
    if(number >= 7.5 && number < 22.5){
        prizeMoney = 300;
    }
    else if(number >= 22.5 && number < 37.5){
        prizeMoney = 400;
    }
    else if(number >= 37.5 && number < 52.5){
        prizeMoney = 600;
    }
    else if(number >= 52.5 && number < 67.5){
        money=0;
        skip=true;
    }
    else if(number >= 67.5 && number < 82.5){
        prizeMoney = 900;
    }
    else if(number >= 82.5 && number < 97.5){
        alert("You got an extra try!");
        tries+=1;
        skip=true;
    }
    else if(number >= 97.5 && number < 112.5){
        prizeMoney = 500;
    }
    else if(number >= 112.5 && number < 127.5){
        prizeMoney = 900;
    }
    else if(number >= 127.5 && number < 142.5){
        prizeMoney = 300;
    }
    else if(number >= 142.5 && number < 157.5){
        prizeMoney = 400;
    }
    else if(number >= 157.5 && number < 172.5){
        prizeMoney = 550;
    }
    else if(number >= 172.5 && number < 187.5){
        prizeMoney = 800;
    }
    else if(number >= 187.5 && number < 202.5){
        prizeMoney = 500;
    }
    else if(number >= 202.5 && number < 217.5){
        prizeMoney = 300;
    }
    else if(number >= 217.5 && number < 232.5){
        prizeMoney = 600;
    }
    else if(number >= 232.5 && number < 247.5){
        prizeMoney = 300;
    }
    else if(number >= 247.5 && number < 262.5){
        prizeMoney = 5000;
    }
    else if(number >= 262.5 && number < 277.5){
        prizeMoney = 600;
    }
    else if(number >= 277.5 && number < 292.5){
        prizeMoney = 300;
    }
    else if(number >= 292.5 && number < 307.5){
        prizeMoney = 700;
    }
    else if(number >= 307.5 && number < 322.5){
        prizeMoney = 450;
    }
    else if(number >= 322.5 && number < 337.5){
        prizeMoney = 350;
    }
    else if(number >= 337.5 && number < 352.5){
        prizeMoney = 800;
    }
    else if((number >= 352.5 && number < 360) || (number >= 0 && number < 7.5)){
        tries--;
        alert("You lost a turn! You have " + tries + " tries left.");
        skip=true;
    }

    if(!skip){
        document.getElementById("guessActivate").disabled = false;
        document.getElementById("buyVowel").disabled = false;
        document.getElementById("solve").disabled = false;
        document.getElementById("spin").disabled = true;
    }
    else{
        document.getElementById("guessActivate").disabled = true;
        document.getElementById("buyVowel").disabled = false;
        document.getElementById("solve").disabled = false;
        document.getElementById("spin").disabled = false;
        //update player info
        document.getElementById("playerInfo").innerHTML = playerName + ":  <br>" + money;
    }
}

function solveCheck(event){
    let submitStr = document.getElementById("textF").value;
    submitStr = submitStr.toUpperCase();

    if(submitStr == phrase){

        console.log(submitStr);
        console.log(phrase);

        alert("You guessed right! You get an extra 1000$");
        money += 1000;
        let moneyStr = money.toString();
        sessionStorage.setItem("money",moneyStr);
        //update player info
        document.getElementById("playerInfo").innerHTML = playerName + ":  <br>" + money;
        nextGameOrEnd();
    }
    else{
        tries--;
        alert("That is wrong! You have " + tries + " tries left");
        document.getElementById("textF").value = "";
        $("#textForSolution").hide();
        document.getElementById("solve").disabled = false;
    }

    if(tries <= 0){
        nextGameOrEnd();
    }
}

function nextGameOrEnd(){
    rounds += 1;
    let roundsStr = rounds.toString();
    sessionStorage.setItem("rounds",roundsStr);
    if(rounds > 3){
        alert("Game Over. Check your score in the Highscores menu.");
        let score = {pName: playerName, scor: money};
        let scoreArr;
        if(localStorage.getItem("scores") !== null){
            let scoresStr = localStorage.getItem("scores");
            scoreArr = JSON.parse(scoresStr);
        }
        else{
            scoreArr = [];
        }
        scoreArr.push(score);
        let scoreString = JSON.stringify(scoreArr);
        localStorage.setItem("scores",scoreString);
        sessionStorage.clear();
        console.log("majmun");
        window.location.replace("index.html");
    }
    else{
        location.reload();
    } 
}

function consonantGuess(reward){
        //update money and tries
        tries --;
        alert("You won " + reward + " dollars! You have " + tries + " tries left.");
        money += reward;
        let moneyStr = money.toString();
        sessionStorage.setItem("money",moneyStr);
    
        //update player info
        document.getElementById("playerInfo").innerHTML = playerName + ":  <br>" + money;
    
        document.getElementById("spin").disabled = false;
        document.getElementById("guessActivate").disabled = true;
        document.getElementById("buyVowel").disabled = false;
        document.getElementById("solve").disabled = false;

        $("#consonants").hide();
        $("#vowels").hide();
        $("#textForSolution").hide();
    
        if(tries <= 0){
            alert("You have no more tries!");
            nextGameOrEnd();
        }
}


