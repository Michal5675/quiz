var question = document.getElementsByClassName("question")[0];
var questionP = question.querySelector("p");
var list_answer = document.getElementsByClassName("answer");
var button = document.getElementsByTagName("button")[0];
var p = [];
for(var k= 0; k < list_answer.length; k++) {
    var pTags = document.getElementsByClassName("p")[k];
    p.push(pTags);
} 
var click = 0;
var clickSound = new Audio("mixkit-select-click-1109.wav");
var wrongAnswer = new Audio("Wrong-answer-sound-effect.mp3");
var correctAnswer = new Audio("Correct-answer.mp3");
for(var i= 0; i < list_answer.length; i++) {
    var answer = document.getElementsByClassName("answer")[i].addEventListener("click", (e) => {
        
        if(e.target.parentElement.classList.contains("list-answer")) {
            e.stopImmediatePropagation();
        }
        else {
            if(click < 1) {
                clickSound.play();
                isClicked();
                e.target.parentElement.classList.add("clicked");
                click++;
                setTimeout(() => {
                    checkAnswer(e.target);
                },2500)
            } else e.stopImmediatePropagation();
        }
        
        setTimeout(() => {
            nextQuestion();
            click = 0;
            e.target.parentElement.classList.remove("clicked");
            e.target.parentElement.classList.remove("true-answer");
            e.target.parentElement.classList.remove("bad-answer");
            e.target.classList.remove("correct");
        },4500)
            
        
       
       
    });
    
}
var gameScore = document.getElementsByClassName("game-score")[0];
var questionNr = document.getElementsByClassName("number")[0];
var timerClock = document.getElementsByClassName("timer")[0];
const divQuestionNr = document.getElementsByClassName("question-number")[0];
var number = 1;
var score = 0;



   
   
async function getData() {
    let response = await fetch("./quiz.json");
    let data = await response.json();
    return data;
   
}

async function checkAnswer(answer) {
        var data = await getData();
        data.real_answer.forEach((elem) => {
           if(elem === answer.innerHTML) {
            score++;
            answer.classList.add("correct");
           
           }
        })
        if(answer.classList.contains("correct")) {
            correctAnswer.play();
            answer.parentElement.classList.add("true-answer");
           }
           else {
            answer.parentElement.classList.add("bad-answer");
            wrongAnswer.play();
           }     
   
  number++;
  return number;
}



async function nextQuestion() {
 var data = await getData();
 var len = data.options[1].length + 7;
 
 for(var n in p) {
     for(var i = 1; i < len; i++) {
        if(i === number) {
            questionP.innerText = data.questions[i];
            p[n].innerHTML = data.options[i][n];
        }
            
     }
     if(number <= 10) {
        questionNr.innerHTML = `${number}/10`;
     }
    else {
        summary();
    }
 }
 
return p;
}

function summary() {
    divQuestionNr.style.display = "none";
    timerClock.style.display = "none";
    gameScore.style.display = "block";
    let btn = createBtn();
    gameScore.appendChild(btn);
    gameScore.innerHTML += `<p class="quiz">Gratulacje</p><br> <p class="quiz quiz-2">Twój wynik to:</p><br> <p class="score">${score}/10</p>`;
    number = 1;
    return number;
}


function restart() {
    divQuestionNr.style.display = "block";
    timerClock.style.display = "block";
    gameScore.style.display = "none";
    gameScore.innerHTML = "";
    score = 0; 
    nextQuestion();
    return score;
}
getData();

var timeCounter = document.getElementsByClassName("time-counter")[0];
var isVow = false;
var minutes = Number(timeCounter.innerHTML.slice(0,2));
var sec = timeCounter.innerHTML.slice(3,timeCounter.innerHTML.length);




function timer() {
    if(sec === "00") {
        sec = 60;
       
    }
    var currentMin = minutes - 1;
    var currentSec = sec;
   
  var clock = setInterval(() => {
    if(timeCounter.innerHTML === "00:01") {
        clearInterval(clock);
        timeCounter.innerHTML = "00:00";
        nextQuestion();
        restartClock();
        number++;
        return number;
      
    }
    else {
       
        currentSec = currentSec - 1;
        if(currentSec == 0) {
            currentSec = 59;
            currentMin = currentMin - 1;
        }
       
       if(currentSec < 10) {
           timeCounter.innerHTML = "0"+ currentMin +":" + "0"+currentSec;
        }
        else timeCounter.innerHTML = "0"+ currentMin +":" +currentSec;
        stopClock(clock);
  }},1000);


   if(number >= 10) {
    stopClock(clock);
   }
}

function restartClock() { 
   timeCounter.innerHTML = "02:00";
   minutes = 2;
   sec = "00";
    timer();
}

function isClicked() {
    isVow = true;
    return isVow;
   
}

function stopClock(x) {
    if(isVow === true) {
        
        clearInterval(x);
        isVow =false;
        setTimeout(() => {
            restartClock();
        },4000);
        
      }
      return isVow;
}

function createBtn() {
    var btn = document.createElement("button");
    btn.classList.add("btn");
    btn.id ="submit";
    btn.innerHTML = "Restart";
    return btn;
}

timer();

document.addEventListener("click", (e) => {
    if(e.target.id === "submit") {
        restart();
    }
})