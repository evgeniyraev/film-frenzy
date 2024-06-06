const searchParams = new URLSearchParams(document.location.search);

let result = document.getElementById("result")

let map = [
    "star",
    "boss",
    "genius",
    "master",
    "lord"
]

let left = searchParams.get("left") >> 0
let index = (left >> 1) - 1
let endName = map[index] || "star"

console.log(left, index, endName)

let videoElement = document.getElementById("video-background")

videoElement.src = `./media/videos/${endName}.mp4`