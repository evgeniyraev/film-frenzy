/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
// const path = require('path');
// const path = require('node:path')

import './index.css';

// const assetsPath = true ? path.join(__dirname, 'assets/fronts') : path.join(process.resourcesPath, 'assets/fronts');
// const cardFrontImages = [
//     path.join(assetsPath, "card-0.png"),
//     path.join(assetsPath, "card-1.png"),
//     path.join(assetsPath, "card-2.png"),
//     path.join(assetsPath, "card-3.png"),
//     path.join(assetsPath, "card-4.png"),
//     path.join(assetsPath, "card-5.png"),
//     path.join(assetsPath, "card-6.png"),
//     path.join(assetsPath, "card-7.png"),
//     path.join(assetsPath, "card-8.png"),
//     path.join(assetsPath, "card-9.png"),
// ];

const fronts = [
    "western",
    "scifi",
    "romance",
    "horror",
    "history",
    "crime",
    "comedy",
    "adventure",
]
const timeLimit = 30*1000;

let cards = document.querySelectorAll('.card');
let stopwatch = document.getElementById("stopwatch")
let timeStart = null;
let interval = null

let flippedCards = []
let matched = 0

let lockOnMove = false;
let lockBoard = false;


function flipCard() {
    if (lockOnMove && lockBoard) return;
    if (this.classList.contains("flip")) return;

    if(timeStart == null) {
        timeStart = Date.now()
        startTimer()
    }

    this.classList.add('flip');
    // let card = this.firstChild
   //card.style.backgroundImage = `url(${cardFrontImages[this.dataset.index]})`;

    flippedCards.push(this)

    if(flippedCards.length & 1 == 1) {
        return;
    }

    checkForMatch();
}

function startTimer() {
    interval = setInterval(() => {
        let now = Date.now()
        let delta = timeLimit - (now - timeStart);
        
        if(delta > 0) {
            deltaToFormat(delta)
        } else {
            endGame()
        }

    }, 1000)
}

function deltaToFormat(delta) {
    var minutes = Math.floor(delta / 60000);
    var seconds = ((delta % 60000) / 1000).toFixed(0);
    let tr = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    stopwatch.innerHTML = tr
}

function checkForMatch() {
    let firstCard = flippedCards.shift()
    let secondCard = flippedCards.shift()
    console.log("checking", firstCard.dataset.index, secondCard.dataset.index)

    let isMatch = firstCard.dataset.index === secondCard.dataset.index;

    if (isMatch) {
        disableCards(firstCard, secondCard) 
    } else {
        unflipCards(firstCard, secondCard);
    }
}

function endGame() {
    clearInterval(interval);
    interval = null

    setTimeout(() => {
        shuffle()
    }, 1000); 

}

function disableCards(firstCard, secondCard) {
    matched += 2;

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    resetBoard();
}

function unflipCards(firstCard, secondCard) {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    lockBoard = false
    
    if(matched == cards.length) {
        endGame()
    }
}

function shuffle() {
    matched = 0
    deltaToFormat(timeLimit)
    flippedCards = []

    let arr = [...Array(cards.length)].map((_, el) => {
        return el >> 1 
    }).reduce((arg, val, i) => {
        let r = (Math.random() * i) >> 0
        arg.splice(r, 0, val)
        return arg
    }, [])

    cards.forEach((card, i) => {

        let frontName = fronts[(Math.random() * fronts.length) >> 0]
        card.style.order = arr[i]

        card.classList.remove('flip');
        card.classList.remove('matched');

        card.classList.add(frontName)
        card.addEventListener('click', flipCard)
    });
};

shuffle()