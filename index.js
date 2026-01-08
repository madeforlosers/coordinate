/* 
*   Coordinate lang
*   by angel!!!!!
*/

// basic require stuff
const fs = require("fs");
const prompt = require("prompt-sync")();
const sp = require('synchronized-promise');

const sharp = require("sharp");
// basic error function
function throwError(errornum) {
    let errors = [
        "Out-of-bounds tape access", // 0
        "Too little arguments given", // 1
        "Argument type is invalid", // 2
        "Divide by 0", // 3
        "Item turned NaN", // 4
        "Nested summation", // 5
        "Ambiguous error :(", // 6
        "Item is undefined, maybe invalid char in string?", // 7

    ]
    console.log(`ERROR ${errornum}: ${errors[errornum]}\nat line ${i + 1} at command ${curFunc}`)
    console.log(memory.tape)
    process.exit()
}

function stripInlineComments(code) { // thanks to my friend for this
  let result = "";
  let inString = false;
  let stringChar = null;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];

    // Toggle string mode
    if ((char === '"')) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
      result += char;
      continue;
    }

    // If semicolon outside a string, skip until newline
    if (char === ";" && !inString) {
      while (i < code.length && code[i] !== "\n") {
        i++;
      }
      // Preserve newline if present
      if (i < code.length) result += "\n";
      continue;
    }

    result += char;
  }

  return result;
}



class Nums {
    // number class so we can handle erroring better
    // I plan on adding more stuff to this
    static parseInt(item) {
        if (isNaN(parseInt(item))) {
            throwError(4);
        }
        return typeof item == "bigint" || item.toString().match(/^[0-9]+n$/) != null ? BigInt(item) : parseInt(item);
    }
    static parseFloat(item) {
        if (isNaN(parseFloat(item))) {
            throwError(4);
        }
        return typeof item == "bigint" || item.toString().match(/^[0-9]+n$/) != null ? BigInt(item) : parseFloat(item);
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
        for (let n = 0; n < this.tape.length; n++) {
            if (this.tape[n] == undefined) {
                this.tape[n] = item;
                return;
            }
        }
        this.tape.push(item);
    }
}

// starting variables
var curFunc = ""; // for debugging
var memory = new Memory(); // memory access
var functionC = []; // function called list for nesting functions
var funcargs = []; // function args
var i = 0; // increment
var summation = [0, 0, 0];
var summationRunning = false;

// functions for the lang
var funcs = {
    "push": function (item) {
        // push item to the tape.
        memory.push(item);
        return item;
    },
    "bigint": function (item) {
        // push item to the tape.
        return BigInt(item);
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
        return number1 > number2;
    },
    "less": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x < number2);
        }
        return number1 < number2;
    },
    "moreis": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x >= number2);
        }
        return number1 >= number2;
    },
    "hasnumber": function (number) {
        return !isNaN(parseFloat(number));
    },
    "lessis": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x <= number2);
        }
        return number1 <= number2;
    },
    "is": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x == number2);
        }
        return number1 == number2;
    },
    "leftshift": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => Nums.parseFloat(x) << Nums.parseFloat(number2));
        }
        return Nums.parseFloat(number1) << Nums.parseFloat(number2);
    },
    "rightshift": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => Nums.parseFloat(x) >> Nums.parseFloat(number2));
        }
        return Nums.parseFloat(number1) >> Nums.parseFloat(number2);
    },
    "subtract": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x - number2);
        }
        return number1 - number2;
    },
    "multiply": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x * number2);
        }
        return number1 * number2;
    },
    "and": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x & number2);
        }
        return number1 & number2;
    },
    "or": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x | number2);
        }
        return number1 | number2;
    },
    "xor": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x ^ number2);
        }
        return number1 ^ number2;
    },
    "not": function (number) {
        if (typeof number == 'object') {
            return number.map(x => !x);
        }
        return !number;
    },
    "modulo": function (number1, number2) {
        if (Nums.parseFloat(number2) == 0) {
            throwError(3);
        }
        if (typeof number1 == 'object') {
            return number1.map(x => x % number2);
        }
        return number1 % number2;
    },
    "divide": function (number1, number2) {
        if (Nums.parseFloat(number2) == 0) {
            throwError(3);
        }
        if (typeof number1 == 'object') {
            return number1.map(x => x / number2);
        }
        return number1 / number2;
    },
    "exp": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x ** number2);
        }
        return number1 ** number2;
    },
    "root": function (number1, number2) {
        if (Nums.parseFloat(number2) == 0) {
            throwError(3);
        }
        if (typeof number1 == 'object') {
            return number1.map(x => Math.pow(Nums.parseFloat(x), (1 / Nums.parseFloat(number2))));
        }
        return Math.pow(Nums.parseFloat(number1), (1 / Nums.parseFloat(number2)));
    },
    "int": function (number) {
        if (typeof number == 'object') {
            return number.map(x => Nums.parseInt(x));
        }
        return Nums.parseInt(number);
    },
    "log": function (number,base = 10) {
        if (typeof number == 'object') {
            return number.map(x => Math.log(x));
        }
        return Math.log(Nums.parseFloat(base)) / Math.log(Nums.parseFloat(number));
    },
    "abs": function (number) {
        if (typeof number == 'object') {
            return number.map(x => Math.abs(x));
        }
        return Math.abs(number);
    },
    "float": function (number) {
        if (typeof number == 'object') {
            return number.map(x => Nums.parseFloat(x));
        }
        return Nums.parseFloat(number);
    },
    "round": function (number) {
        if (typeof number == 'object') {
            return number.map(x => Math.round(Nums.parseFloat(x)));
        }
        return Math.round(Nums.parseFloat(number));
    },
    "fix": function (number,digits) {
        if (typeof number == 'object') {
            return number.map(x => Nums.parseFloat(x).toFixed(digits));
        }
        return Nums.parseFloat(number).toFixed(digits)
    },
    "ceil": function (number) {
        if (typeof number == 'object') {
            return number.map(x => Math.ceil(Nums.parseFloat(x)));
        }
        return Math.ceil(Nums.parseFloat(number));
    },
    "add": function (number1, number2) {
        if (typeof number1 == 'object') {
            return number1.map(x => x + number2);
        }
        return number1 + number2;
    },
    "fpart": function (number) {
        if (typeof number == 'object') {
            return number.map(x => Nums.parseFloat(x) - Nums.parseInt(x));
        }
        return Nums.parseFloat(number) - Nums.parseInt(number);
    },
    "min": function (...arguments) { // this shows an error but it works
        if (typeof arguments[0] == "object") {
            return Math.min(...arguments[0]);
        }
        return Math.min(...arguments.map(x => Nums.parseFloat(x)));
    },
    "max": function (...arguments) {
        if (typeof arguments[0] == "object") {
            return Math.max(...arguments[0]);
        }
        return Math.max(...arguments.map(x => Nums.parseFloat(x)));
    },
    "get": function (index) {
        if(typeof index =="object"){
            return index.map(x=>memory.get(x));
        }
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
                i = h;
                break;
            }
        }
    },
    "function": function (id) {

        if (functionC[0] == undefined) {
            memory.set(Nums.parseInt(id), i);
            let skip = 0;
            for (let h = i + 1; h < codeSp.length; h++) {
                if (codeSp[h].split("(")[0] == "function") {
                    skip++;
                }
                if (codeSp[h].split("(")[0] == "endfunc" && skip != 0) {
                    skip--;
                }
                if (codeSp[h].split("(")[0] == "endfunc" && skip == 0) {
                    i = h;
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
                    i = h;
                    break;
                }
                if (codeSp[h].split("(")[0] == "endif" && skip == 0) {
                    i = h;
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
                    i = h;
                    break;
                }
            }
        }
    },
    "endwhile": function () {
        let skip = 0;
        for (let h = i; h >= 0; h--) {
            if (codeSp[h].split("(")[0] == "endwhile") {
                skip++;
            }
            if (codeSp[h].split("(")[0] == "while" && skip != 0) {
                skip--;
            }
            if (codeSp[h].split("(")[0] == "while" && skip == 0) {
                i = h-1;
                break;
            }
        }
    },
    "puts": function (item) {
        if (item == undefined) {
            throwError(7);
        }
        console.log(item.toString());
    },
    "file": function (file, data, flag) {
        try {
            fs.writeFileSync(file, data, { flag: flag });
        } catch (e) {
            throwError(6);
        }
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
        return char.repeat(toLength - string.length) + string;
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
        return string.split(find);
    },
    "cut": function (string, beginning, end = -1) {
        if (end == -1) {
            return string.slice(beginning);
        }
        return string.slice(beginning, end);
    },
    "glue": function (list) {
        if (typeof list != "object") {
            throwError(2);
        }
        return list.join("");
    },
    "chararray": function (string) {
        if (typeof string != "string") {
            throwError(2);
        }
        return string.split("");
    },
    "charat": function (string, index) {
        if (typeof string != "string") {
            throwError(2);
        }
        return string.charAt(Nums.parseInt(index));
    },
    "length": function (string) {
        if (typeof string == "number") {
            throwError(2);
        }
        return string.length;
    },
    "empty": function () {
        return "";
    },
    "str": function (string) {
        return string.toString();
    },
    "repeat": function (string, times) {
        if (typeof string != "string") {
            throwError(2);
        }
        return string.repeat(Nums.parseInt(times));
    },
    "recruit": function (list, item) {
        if (typeof list != "object") {
            throwError(2);
        }
        return [...list, item];
    },
    "sum": function (list) {
        if (typeof list == "number" || typeof list == "string") {
            throwError(2);
        }
        return list.reduce((accumulator, currentValue) => Nums.parseFloat(accumulator) + Nums.parseFloat(currentValue), 0);
    },
    "piece": function (start, end) {
        return memory.tape.slice(Nums.parseInt(start), Nums.parseInt(end) + 1);
    },
    "copy": function (number, times) {
        return Array(Nums.parseInt(times)).fill(Nums.parseFloat(number));
    },
    "single": function (list, index) {
        if (typeof list != "object") {
            throwError(2);
        }
        return list[Nums.parseInt(index)];
    },
    "count": function (item, thing) {
        if (typeof item == "number") {
            throwError(2);
        }
        return item.split(thing).length - 1;
    },
    "reverse": function (string) {
        if (typeof string == "object") {
            return string.reverse();
        }
        return string.split("").reverse().join("");
    },
    "summation": function (string, start, end, accumulate = true) {
        summation = [0, 0, 0];
        if (typeof string != "string") {
            throwError(2);
        }
        if (summationRunning) {
            throwError(5);
        }
        summationRunning = true;

        summation[1] = Nums.parseFloat(end);
        let accumulator = accumulate ? 0 : [];
        for (summation[0] = Nums.parseFloat(start); summation[0] < summation[1]; summation[0]++) {
            // console.log(accumulator)
            if (accumulate) accumulator += runCommands(string);
            else accumulator.push(runCommands(string));

        }
        summationRunning = false;
        return accumulator;
    },
    "sumvar": function (id) {
        return Nums.parseInt(summation[Nums.parseInt(id)]);

    },
    "image": function (width, height, channels = 3) {
        return sharp({
            create: {
                width: width,
                height: height,
                channels: channels,
                background: { r: 255, g: 255, b: 255 }
            }
        })
    },
    "pixel": function (img, x, y, r, g = null, b = null) {

        // this fucking sucks lmao
        async function t(image) {
            arr = await image.toBuffer({ resolveWithObject: true });
            if (typeof x == "object") {
                for (h of x) {
                    loc = (arr.info.width * Nums.parseInt(y * 3)) + Nums.parseInt(h * 3);

                    arr.data[loc] = r;
                    arr.data[loc + 1] = g;
                    arr.data[loc + 2] = b;
                }
            } else
                if (typeof y == "object") {
                    for (h of y) {
                        loc = (arr.info.width * Nums.parseInt(h * 3)) + Nums.parseInt(x * 3);

                        arr.data[loc] = r;
                        arr.data[loc + 1] = g;
                        arr.data[loc + 2] = b;
                    }
                } else
                    if (typeof r == "object") {
                        inc_y = +(y == -1);
                        inc_x = +(x == -1);
                        iy = y;
                        ix = x;
                        for (h of r) {
                            loc = (arr.info.width * Nums.parseInt(iy * 3)) + Nums.parseInt(ix * 3);
                            iy += inc_y;
                            ix += inc_x;

                            arr.data[loc] = h;
                            arr.data[loc + 1] = h;
                            arr.data[loc + 2] = h;
                        }
                    } else {
                        loc = (arr.info.width * Nums.parseInt(y * 3)) + Nums.parseInt(x * 3);


                        arr.data[loc] = r;
                        arr.data[loc + 1] = g;
                        arr.data[loc + 2] = b;

                    }
            return sharp(arr.data, { raw: { width: arr.info.width, height: arr.info.height, channels: arr.info.channels, } });
        }
        return sp(t)(img);
    },
    "print": function (image, name) {
        image.toFile(name);

    },
    "char": function (number) {
        if(typeof number == "object"){
            return number.map(x=>String.fromCharCode(x))
        }
        return String.fromCharCode(Nums.parseInt(number));
    },
    "code": function (string,id=0) {
        if(typeof string == "object"){
            return string.map(x=>x.charCodeAt(id));
        }
        return string.charCodeAt(id);
    },
    "edit": function (string,id,text) {
        if(typeof string == "number"){
            throwError(2);
        }
        if(typeof string == "object"){
        return string.toSpliced(id,1,text);
        }
        return string.split("").toSpliced(id,1,text).join("");

    },
    "random": function () {
        return Math.random();
    },
    "ansi":function(escape){
        return `\x1b[${escape}`
    }


}

if (process.argv[2] == undefined) {
    console.log("please enter a filename in arguments");
    process.exit();
}

code = fs.readFileSync(process.argv[2], { encoding: "utf8" });




function runCommands(input) { // starting function

    if (input.match(/^\"[^\"]+\"$/g) != null) { // if its a string..
        return input.replace(/"/g, "");
    }
    if (input.match(/^\w+\(.*\)+$/g) != null) { // if its a function..
        return runFunc(input);
    }

    if (input.match(/^[0-9]+/g) != null) { // if its a number..
        return parseInt(input);
    }


}


// helper function to deal with the daunting task of nested items
const splitCom = (s, item = ",") => [...s].map(c => c == item & !(a += ("\0\0()\0\0".indexOf(c) + 4) % 7 - 3) ? `
`: c, a = 0).join``;

function runFunc(input) { // main function handler
    let getFunc = input.split("(")[0]; // get function name

    curFunc = getFunc; // debug it!

    // get all of the args for the command, which could include more functions, so we need to handle for that
    let getArg = splitCom(input.replace(input.match(/\w+\(/g)[0], "").slice(0, -1)).split("\n");

    // filter out garbage that appears through that (This won't cause problems)
    getArg = getArg.filter(x => x != undefined && x != ",");

    // make sure all arguments are fufilled
    if (funcs[getFunc].length > getArg.filter(x => x != '' && x != undefined).length) {
        throwError(1);
    }

    // run the command! this function will run recursively if theres nested-
    // functions, so we need to return to get the output of those
    return funcs[getFunc](...getArg.map(x => runCommands(x, true)));
}

// main code
codeSp = stripInlineComments(code).split("\n").map(x => x.trim());

for (i = 0; i < codeSp.length; i++) {
    runCommands(codeSp[i]);
}