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

result.classList.add(map[searchParams.get("left") >> 1] || "boss")