const cat = new Cat("cat");
document.getElementById("image-container").addEventListener("click", () => {
    console.log("play")
    cat.meow("happy");
    cat.play();
})


