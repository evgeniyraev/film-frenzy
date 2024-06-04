
const { time } = require('console');
// const { ipcRenderer } = require('electron');
const storage = require('electron-json-storage');
const os = require('os');

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
let backs = [];

let timeLimit = 30*1000;

let cards = []
let stopwatch = document.getElementById("stopwatch")
let timeStart = null;
let interval = null

let flippedCards = []
let matched = 0

let lockOnMove = false;
let lockBoard = false;

function loadConfig() {
    storage.setDataPath(os.tmpdir());
    let config = storage.getSync('config');

    update(config)
}

document.getElementById('refresh-game').addEventListener("click", (event) => {
    clear()
});

function update(config) {
    timeLimit = config.seconds * 1000
    backs = config.images || []
    cards.length = 0;

    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    let images = config.images;
    images.forEach((element, i) => {
        [null, null].forEach(_ => {
            let card = addCard(i, element)
            gameContainer.appendChild(card);
            cards.push(card)
        })
    })

    //cards = document.querySelectorAll('.card');

    clear()
}

function clear() {
    if(interval) {
        clearInterval(interval);
        interval = null;
        timeStart = null;
    }

    shuffle()
}

function addCard(index, src) {
    const div = document.createElement("div")
    div.classList.add('card');
    div.dataset.index = index
    
    const front = document.createElement("div")

    const img = document.createElement("img")
    img.src = src

    div.appendChild(img)
    div.appendChild(front)
    return div

}

ipcRenderer.on('update-media', (event, config) => {
    update(config);
  });

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
    clear()

    window.location.replace(`../end/end.html?left=${(cards.length - matched)>>1}`);
d

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

loadConfig()