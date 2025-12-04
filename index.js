/* 
*   Coordinate lang
*   by angel!!!!!
*/

// basic require stuff
const fs = require("fs");
const prompt = require("prompt-sync")();

// basic error function
function throwError(errornum) {
    let errors = [
        "Out-of-bounds tape access", // 0
        "Too little arguments given", // 1
        "Argument type is invalid", // 2
        "Divide by 0", // 3
        "Item turned NaN" // 4
    ]
    console.log(`ERROR ${errornum}: ${errors[errornum]}\nat line ${i + 1} at command ${curFunc}`)
    process.exit()
}


class Nums { 
    // number class so we can handle erroring better
    // I plan on adding more stuff to this
    static parseInt(item) {
        if (isNaN(parseInt(item))) {
            throwError(4);
        }
        return parseInt(item);
    }
    static parseFloat(item) {
        if (isNaN(parseFloat(item))) {
            throwError(4);
        }
        return parseFloat(item);
    }

}
class Memory {
    // memory class so error handling is easier
    tape = [];
    constructor() {
        this.tape = [];
    }
    get(index) {
        if (this.tape[Nums.parseInt(index)] == undefined) {
            throwError(0);
        }
        return this.tape[Nums.parseInt(index)]
    }
    set(index, item) {
        this.tape[Nums.parseInt(index)] = item;
    }
    push(item) {
        this.tape.push(item);
    }
}

// starting variables
var curFunc = ""; // for debugging
var memory = new Memory(); // memory access
var functionC = []; // function called list for nesting functions
var funcargs = []; // function args
var i = 0; // increment

// functions for the lang
var funcs = {
    "push": function (item) {
        // push item to the tape.
        memory.push(item);
        return item;
    },
    "set": function (index, item) {
        // set index in tape to item
        memory.set(index, item);
        return item;
    },
    "increment": function (index) {
        // increment item in tape at index
        memory.set(index, memory.get(index) + 1);
        return memory.get(index) - 1;
    },
    "decrement": function (index) {
        // decrement item in tape at index
        memory.set(index, memory.get(index) - 1);
        return memory.get(index) + 1;
    },
    "ask": function (text) {
        // prompt user
        return prompt(text);
    },
    "more": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x > number2);
        }
        return number1 > number2
    },
    "less": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x < number2);
        }
        return number1 < number2
    },
    "moreis": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x >= number2);
        }
        return number1 >= number2
    },
    "hasnumber": function (number) {
        return !isNaN(parseFloat(number))
    },
    "lessis": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x <= number2);
        }
        return number1 <= number2
    },
    "is": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x == number2);
        }
        return number1 == number2
    },
    "leftshift": function (number1, number2) {
        return Nums.parseFloat(number1) << Nums.parseFloat(number2)
    },
    "rightshift": function (number1, number2) {
        return Nums.parseFloat(number1) >> Nums.parseFloat(number2)
    },
    "subtract": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x - number2);
        }
        return number1 - number2
    },
    "multiply": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x * number2);
        }
        return number1 * number2
    },
    "and": function (number1, number2) {
        return number1 & number2
    },
    "or": function (number1, number2) {
        return number1 | number2
    },
    "xor": function (number1, number2) {
        return number1 ^ number2
    },
    "not": function (number) {
        return !number
    },
    "modulo": function (number1, number2) {
        if (Nums.parseFloat(number2) == 0) {
            throwError(3);
        }
        if (typeof number1 == 'object') {
            return number1.map(x => x % number2);
        }
        return number1 % number2
    },
    "divide": function (number1, number2) {
        if (Nums.parseFloat(number2) == 0) {
            throwError(3);
        }
        if (typeof number1 == 'object') {
            return number1.map(x => x / number2);
        }
        return number1 / number2
    },
    "exp": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x ** number2);
        }
        return number1 ** number2
    },
    "root": function (number1, number2) {
        if (Nums.parseFloat(number2) == 0) {
            throwError(3);
        }
        if (typeof number1 == 'object') {
            return number1.map(x => Math.pow(Nums.parseFloat(x), (1 / Nums.parseFloat(number2))));
        }
        return Math.pow(Nums.parseFloat(number1), (1 / Nums.parseFloat(number2)))
    },
    "int": function (number) {
        if (typeof number == 'object') {
            return number.map(x => Nums.parseInt(x));
        }
        return Nums.parseInt(number);
    },
    "float": function (number) {
        if (typeof number == 'object') {
            return number.map(x => Nums.parseFloat(x));
        }
        return Nums.parseFloat(number);
    },
    "round": function (number) {
        if (typeof number == 'object') {
            return number.map(x => x ** Math.round(Nums.parseFloat(x)));
        }
        return Math.round(Nums.parseFloat(number));
    },
    "ceil": function (number) {
        if (typeof number == 'object') {
            return number.map(x => x ** Math.ceil(Nums.parseFloat(x)));
        }
        return Math.ceil(Nums.parseFloat(number));
    },
    "add": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x + number2);
        }
        return number1 + number2
    },
    "fpart": function (number) {
        if (typeof number == 'object') {
            return number.map(x => Nums.parseFloat(x) - Nums.parseInt(x));
        }
        return Nums.parseFloat(number) - Nums.parseInt(number);
    },
    "min": function (...arguments) { // this shows an error but it works
        return Math.min(...arguments.map(x => Nums.parseFloat(x)));
    },
    "max": function (...arguments) {
        return Math.max(...arguments.map(x => Nums.parseFloat(x)));
    },
    "get": function (index) {
        return memory.get(index);
    },
    "else": function () {
        let skip = 0;
        for (let h = i; h < codeSp.length; h++) {
            if (codeSp[h].split("(")[0] == "if") {
                skip++;
            }
            if (codeSp[h].split("(")[0] == "endif" && skip != 0) {
                skip--;
            }
            if (codeSp[h].split("(")[0] == "endif" && skip == 0) {
                i = h
                break;
            }
        }
    },
    "function": function (id) {

        if (functionC[0] == undefined) {
            memory.set(id, i);
            let skip = 0;
            for (let h = i + 1; h < codeSp.length; h++) {
                if (codeSp[h].split("(")[0] == "function") {
                    skip++;
                }
                if (codeSp[h].split("(")[0] == "endfunc" && skip != 0) {
                    skip--;
                }
                if (codeSp[h].split("(")[0] == "endfunc" && skip == 0) {
                    i = h
                    break;
                }

            }
        }
    },
    "endfunc": function () {

        // nothing
    },
    "return": function (returned = "") {
        return returned;
    },
    "callfunc": function (id, arg1 = 0, arg2 = 0, arg3 = 0, arg4 = 0) {
        funcargs.push(arg1, arg2, arg3, arg4)
        temp_i = i;
        functionC.unshift(i);
        let lastreturn = 0;
        for (i = memory.get(id); i < codeSp.length; i++) {
            lastreturn = runCommands(codeSp[i]);
            if (codeSp[i].split("(")[0] == "return") break;
        }
        i = functionC.shift();
        funcargs.splice(-4);
        return lastreturn;

    },
    "getarg": function (id) {
        return funcargs.slice(-4)[Nums.parseInt(id)];
    },
    "if": function (thing) {
        if (!thing) {
            let skip = 0;
            for (let h = i + 1; h < codeSp.length; h++) {
                if (codeSp[h].split("(")[0] == "if") {
                    skip++;
                }
                if (codeSp[h].split("(")[0] == "endif" && skip != 0) {
                    skip--;
                }
                if (codeSp[h].split("(")[0] == "else" && skip == 0) {
                    i = h
                    break;
                }
                if (codeSp[h].split("(")[0] == "endif" && skip == 0) {
                    i = h
                    break;
                }

            }
        }
    },
    "endif": function () {
        // nothing
    },
    "while": function (item) {
        if (!item) {
            let skip = 0;
            for (let h = i; h < codeSp.length; h++) {
                if (codeSp[h].split("(")[0] == "while") {
                    skip++;
                }
                if (codeSp[h].split("(")[0] == "endwhile" && skip != 0) {
                    skip--;
                }
                if (codeSp[h].split("(")[0] == "endwhile" && skip == 0) {
                    i = h
                    break;
                }
            }
        }
    },
    "endwhile": function () {
        let skip = 0;
        for (let h = i; h > 0; h--) {
            if (codeSp[h].split("(")[0] == "endwhile") {
                skip++;
            }
            if (codeSp[h].split("(")[0] == "while" && skip != 0) {
                skip--;
            }
            if (codeSp[h].split("(")[0] == "while" && skip == 0) {
                i = h - 1;
                break;
            }
        }
    },
    "puts": function (item) {
        console.log(item.toString())
    },
    "putsin": function (item) {
        process.stdout.write(item.toString());
    },
    "find": function (string, sub) {
        if (typeof string != "string" || typeof sub != "string") {
            throwError(2);
        }
        return string.indexOf(sub);
    },
    "pad": function (string, char, toLength) {
        if (typeof string != "string" || typeof char != "string") {
            throwError(2);
        }
        return char.repeat(toLength - string.length) + string
    },
    "replace": function (string, find, repl) {
        if (typeof string != "string" || typeof find != "string" || typeof repl != "string") {
            throwError(2);
        }
        return string.split(find).join(repl);
    },
    "insertafter": function (string, find, insert) {
        if (typeof string != "string" || typeof find != "string" || typeof insert != "string") {
            throwError(2);
        }
        return string.split(find).join(find + insert);
    },
    "split": function (string, find) {
        if (typeof string != "string" || typeof find != "string") {
            throwError(2);
        }
        return string.split(find)
    },
    "chararray": function (string) {
        if (typeof string != "string") {
            throwError(2);
        }
        return string.split("")
    },
    "charat": function (string, index) {
        if (typeof string != "string") {
            throwError(2);
        }
        return string.charAt(Nums.parseInt(index));
    },
    "length": function (string) {
        if (typeof string != "string") {
            throwError(2);
        }
        return string.length;
    },
    "str": function (string) {
        return string.toString();
    },
    "sum": function (list) {
        if (typeof list == "number" || typeof list == "string") {
            throwError(2);
        }
        return list.reduce((accumulator, currentValue) => Nums.parseFloat(accumulator) + Nums.parseFloat(currentValue), 0);
    }

}

code = fs.readFileSync("input.coo", { encoding: "utf8" })




function runCommands(input) { // starting function

    if (input.match(/^\"[^\"]+\"$/g) != null) { // if its a string..
        return input.replace(/"/g, "");
    }
    if (input.match(/^\w+\(.*\)+$/g) != null) { // if its a function..
        return runFunc(input);
    }

    if (input.match(/^[0-9]+/g) != null) { // if its a number..
        return parseInt(input)
    }


}


// helper function to deal with the daunting task of nested items
const splitCom = (s, item = ",") => [...s].map(c => c == item & !(a += ("{[()]}".indexOf(c) + 4) % 7 - 3) ? `
`: c, a = 0).join``

function runFunc(input) { // main function handler
    let getFunc = input.split("(")[0]; // get function name

    curFunc = getFunc; // debug it!

    // get all of the args for the command, which could include more functions, so we need to handle for that
    let getArg = splitCom(input.replace(input.match(/\w+\(/g)[0], "").slice(0, -1)).split("\n")

    // filter out garbage that appears through that (This won't cause problems)
    getArg = getArg.filter(x => x != undefined && x != ",")

    // make sure all arguments are fufilled
    if (funcs[getFunc].length > getArg.filter(x => x != '' && x != undefined).length) {
        throwError(1);
    }

    // run the command! this function will run recursively if theres nested-
    // functions, so we need to return to get the output of those
    return funcs[getFunc](...getArg.map(x => runCommands(x, true)))
}

// main code
codeSp = code.split("\n");
for (i = 0; i < codeSp.length; i++) {
    runCommands(codeSp[i])
}