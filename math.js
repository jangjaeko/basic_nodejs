
// math module 
export function add (a, b){
    return a + b;
}
export function subtract (a, b){
    return a - b;
}

export default function multiply(a, b){ // representing default export
    return a * b;
}

//common js export
// module.exports = {
//     add :add,
//     sub :subtract
// };

// es6 export
// export { add, subtract };