var time, fps, framecount;
var debugging;
var animationFrameHandle;
var canvasElement;
var ctx;
var width, height;
var dict = [];
var words = [];
var buffer = "";
var spawnrate = 1000;
var fallrate = 2;
var font = "Georgia";
var bgColor = "#22bbff";
var wordColor = "#bbff22";
var wordSize = 24;
//INIT CODE
function init() {
    loadDict();
    document.getElementById("focuscap").focus();
    canvasElement = document.getElementById("canvas");
    ctx = canvasElement.getContext("2d");
    resizeCanvas();
    window.onresize = resizeCanvas;
    window.onkeydown = updateInput;
}
function run() {
    setInterval(spawnWord, spawnrate);
    animationFrameHandle = requestAnimationFrame(mainloop);
}
function loadDict() {
    //TODO: support for user dicts
    fetch('dict.txt')
        .then(function (response) { return response.text(); })
        .then(function (text) {
        dict = text.split("\n");
        dict.forEach(function (word, i, words) { words[i] = word.trim(); });
        run();
    });
}
//CYCLE CODE
function mainloop() {
    update();
    render();
    animationFrameHandle = requestAnimationFrame(mainloop);
}
//UPDATE CODE
function update() {
    words.forEach(updateWord);
    removeWords();
}
function updateWord(word, index, words) {
    //console.log(word)
    //console.log(words[index])
    words[index].y += (-word.str.length + 20) / 10;
    if (word.y > height)
        words[index].remove = true;
}
function updateInput(event) {
    if (event.keyCode >= 48 && event.keyCode <= 90)
        bufferPush(event.key);
    else if (event.key == "Backspace")
        bufferPop();
    else if (event.key == "Enter" || event.key == " ") {
        bufferCheck();
        bufferClear();
    }
}
//RENDER CODE
function render() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    words.forEach(renderWord);
    ctx.fillStyle = "black";
    ctx.font = "72px Georgia";
    var bw = drawSize(buffer);
    ctx.fillText(buffer, (width - bw) / 2, height / 2);
    if (debugging) {
        //TODO: render fps
    }
}
function renderWord(word) {
    ctx.fillStyle = wordColor;
    ctx.font = wordSize + "px " + font;
    ctx.fillText(word.str, word.x, word.y);
}
//HELPER FUNCTIONS
function resizeCanvas() {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
    width = canvasElement.width;
    height = canvasElement.height;
}
function randomWord() {
    //console.log(dict[Math.floor(Math.random() * dict.length)])
    return dict[Math.floor(Math.random() * dict.length)];
}
function spawnWord() {
    var w = {
        str: "",
        x: 0,
        y: 0,
        index: 0,
        remove: false
    };
    w.str = randomWord();
    w.x = Math.random() * (width - drawSize(w.str));
    w.y = -10;
    w.remove = false;
    words.push(w);
}
function drawSize(word) {
    return ctx.measureText(word).width;
}
function bufferPop() {
    buffer = buffer.substring(0, buffer.length - 1);
}
function bufferClear() {
    buffer = "";
}
function bufferPush(str) {
    buffer = buffer.concat(str);
}
function bufferCheck() {
    var clear = false;
    words.forEach(function (element, index, array) {
        if (element.str == buffer.trim()) {
            array[index].remove = true;
            clear = true;
        }
    });
    if (clear) {
        bufferClear();
    }
}
function removeWords() {
    if (words.length <= 0)
        return;
    for (var i = words.length - 1; i > 0; i--) {
        if (words[i].remove) {
            words.splice(i, 1);
        }
    }
}
init();
