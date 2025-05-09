/**
  * @typedef {object} Data
  * @property {'keyboard'} type
  * @property {'press' | 'release'} event - What event happened
  * @property {string} key - Keyboard key
  */
const websocket = new WebSocket("ws://127.0.0.1:8001/");
websocket.onopen = function() {
    console.log("Connected to WebSocket!")
}
const characters = [...Array(95).keys()].map(i => String.fromCharCode(i+32))
for (var i = 0; i < characters.length; i++) {
    let el = document.createElement("div");
    el.id = characters[i].toLowerCase();
    //No uppercase
    if (/[a-z]/g.test(characters[i])) continue;
    //No special characters
    //But I added them back in the HTML
    //I'm too lazy to fix it
    if (/[!-\/:-@[-`{-~]/g.test(characters[i])) continue;
    if (el.id == " ") {
        el.id = "space";
        characters[i] = " ";
    }
    el.classList.add("key");
    el.innerHTML = characters[i];
    document.getElementById("keys").appendChild(el);
}
websocket.addEventListener("message", ({ data }) => {
    /**@type {Data}*/
    const key = JSON.parse(data);
    if (/[!@#$%^&*()]/g.test(key.key.toLowerCase())) return;
    if (document.getElementById(key.key.toLowerCase()) == null) return;
    if (key.event == "press") {
        document.getElementById(key.key.toLowerCase()).style.backgroundColor = "white";
        document.getElementById(key.key.toLowerCase()).style.color = "black";
    }
    if (key.event == "release") {
        document.getElementById(key.key.toLowerCase()).style.backgroundColor = "black";
        document.getElementById(key.key.toLowerCase()).style.color = "white";
    }
});