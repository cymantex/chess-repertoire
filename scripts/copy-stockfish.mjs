import { cpSync, mkdirSync } from "fs";

const dest = "public/stockfish";
mkdirSync(dest, { recursive: true });
cpSync("node_modules/stockfish/bin/stockfish-18.js", `${dest}/stockfish-18.js`);
cpSync(
  "node_modules/stockfish/bin/stockfish-18.wasm",
  `${dest}/stockfish-18.wasm`,
);
console.log("Copied stockfish-18.js and stockfish-18.wasm to public/stockfish/");

