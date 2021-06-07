"use strict";

$(document).ready(() => {
    let scoreArr;
    if(localStorage.getItem("scores") !== null){
        let scoresStr = localStorage.getItem("scores");
        scoreArr = JSON.parse(scoresStr);
    }
    else{
        scoreArr = [];
    }

    scoreArr.sort(function(a,b){return b.scor - a.scor});
    
    scoreArr.forEach(element => {
        var node = document.createElement("LI");               
        var textnode = document.createTextNode(element.pName + ": " + element.scor + "$$");         
        node.appendChild(textnode);                              
        document.getElementById("scoresList").appendChild(node);
    });
});