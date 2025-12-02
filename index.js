const fs = require("fs");
const { getSystemErrorMap } = require("util");
const prompt = require("prompt-sync")();
const splitCom = (s, item = ",") => [...s].map(c => c == item & !(a += ("{[()]}".indexOf(c) + 4) % 7 - 3) ? `
`: c, a = 0).join``
function splitExpr(item) {
    // console.log(item)
    return splitCom(splitCom(splitCom(splitCom(item, "<"), ">"), "!"), "=")

}

var tape = [];
var functionC = [];
var funcargs = [];
var i = 0;
var temp_i = 0;
var funcs = {
    "push": function (item) {
        tape.push(item);
    },
    "set": function (index, item) {
        tape[parseInt(index)] = item;
    },
    "ask": function (text) {
        return prompt(text);
    },
    "add": function (number1, number2) {
        return number1 + number2
    },
    "subtract": function (number1, number2) {
        return number1 - number2
    },
    "multiply": function (number1, number2) {
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
    "modulo": function (number1, number2) {
        return number1 % number2
    },
    "divide": function (number1, number2) {
        return number1 / number2
    },
    "exp": function (number1, number2) {
        return number1 ** number2
    },
    "root": function (number1, number2) {
        return Math.pow(number1, (1 / number2))
    },
    "toInt": function (number) {
        return parseInt(number)
    },
    "get": function (index) {
        return tape[parseInt(index)]
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
            tape[id] = i;
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
    "return":function(returned){
        return returned;
    },
    "callfunc":function(id,arg1 = 0,arg2 = 0,arg3 = 0, arg4 = 0){
        funcargs.push(arg1,arg2,arg3,arg4)
        temp_i = i;
        functionC.unshift(i);
        let lastreturn = 0;
        for(i = tape[id]; i < codeSp.length; i++){
            lastreturn = runCommands(codeSp[i]);
            if(codeSp[i].split("(")[0] == "return" )break;
        }
        i = functionC.shift();
        funcargs.splice(-4);
        return lastreturn;
         
    },
    "getarg":function(id){
        return funcargs.slice(-4)[id];
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
    "putsin":function(item){
        process.stdout.write(item.toString());
    }

}

code = fs.readFileSync("input.coo", { encoding: "utf8" })

function runCommands(input, nested = false) {

    if (input.match(/^\"[^\"]+\"$/g) != null) {
        // console.log(input.replace(/"/g,""))
        return input.replace(/"/g, "");
    }
    if (nested) {
        // console.log(splitExpr(input).split("\n"))
        if (splitExpr(input).split("\n").length > 1) {
            // console.log("!!!"+input)
            return runQuery(input)
        }
    }
    if (input.match(/^\w+\(.*\)+$/g) != null) {
        return runFunc(input);
    }



    // console.log(input.match(/^\"[a-zA-Z0-9]+\"$/g) )

    if (input.match(/^[0-9]+/g) != null) {
        return parseInt(input)
    }


}

function runQuery(input) {
    regex = /(?:(?!\B"[^"]*)\s*(?:!|=|>|<)\s*(?![^"]*"\B))(?![^()]*(?:\([^()]*\))?\))/g
    h = splitExpr(input).split("\n")
    // console.log(input.match(regex)[0])
    return eval(runCommands(h[0].trim(), true) + "" + ["!=", "==", ">", "<"]["!=><".indexOf(input.match(regex)[0].trim())] + "" + runCommands(h[1].trim(), true))
}
function runFunc(input) {
    let getFunc = input.split("(")[0];

    let getArg = splitCom(input.replace(input.match(/\w+\(/g)[0], "").slice(0, -1)).split("\n")
    getArg = getArg.filter(x => x != undefined && x != ",")
    //console.log(getArg)
    return funcs[getFunc](...getArg.map(x => runCommands(x, true)))
}
codeSp = code.split("\n");
for (i = 0; i < codeSp.length; i++) {
   runCommands(codeSp[i])
}
//console.log(tape)