// const moduleData = require("./math");
// const { add, sub } = require("./math"); // only common js

// import mul from "./math.js"; // es6 module
// import mul, { add, subtract } from "./math.js"; // es6 module


// console.log(moduleData) ; // { add: [Function: add], sub: [Function: subtract] }

// console.log(moduleData.add(2,3)); // 5
// console.log(moduleData.sub(5,3)); // 2

// console.log(add(2, 3)); // 5
// console.log(subtract(5, 3)); // 2
// console.log(mul(2, 3)); // 6


import randomColor from "randomcolor";

const color = randomColor();
console.log(color);