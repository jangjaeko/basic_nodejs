// const moduleData = require("./math");
const { add, sub } = require("./math");
// console.log(moduleData) ; // { add: [Function: add], sub: [Function: subtract] }

// console.log(moduleData.add(2,3)); // 5
// console.log(moduleData.sub(5,3)); // 2
console.log(add(2, 3)); // 5
console.log(sub(5, 3)); // 2
