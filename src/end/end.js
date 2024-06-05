const searchParams = new URLSearchParams(document.location.search);

let result = document.getElementById("result")

let map = [
    "boss",
    "genius",
    "master",
    "star",
    "lord"
]

let left = searchParams.get("left")
let index = left >> 1
let endName = map[index] || "boss"

let videoElement = document.getElementById("video-background")

videoElement.src = `./media/videos/${endName}.mp4`