const searchParams = new URLSearchParams(document.location.search);

let map = [
    "win",
]

let total = searchParams.get("total") >> 0
let found = searchParams.get("found") >> 0
let left = total - found
let index = left
let endName = map[index] || "lose"

console.log(left, total, endName)

let result = document.getElementById("result")
result.classList.add(endName)