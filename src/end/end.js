const searchParams = new URLSearchParams(document.location.search);

// Iterating the search parameters
for (const p of searchParams) {
  console.log(p);
}

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

// result.classList.add( || "boss")