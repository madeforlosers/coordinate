const fs = require("fs");
const { getSystemErrorMap } = require("util");
const prompt = require("prompt-sync")();
const splitCom = (s, item = ",") => [...s].map(c => c == item & !(a += ("{[()]}".indexOf(c) + 4) % 7 - 3) ? `
`: c, a = 0).join``

function throwError(errornum){
    let errors = [
        "Out-of-bounds tape access", // 0
        "Too little arguments given", // 1
        "Argument type is invalid", // 2
        "Divide by 0", // 3
        "Item turned NaN" // 4
    ]
    console.log(`ERROR ${errornum}: ${errors[errornum]}\nat line ${i+1} at command ${curFunc}`)
    process.exit()
}
class Nums {
    static parseInt(item){
        if(isNaN(parseInt(item))){
            throwError(4);
        }
        return parseInt(item);
    }
    static parseFloat(item){
        if(isNaN(parseFloat(item))){
            throwError(4);
        }
        return parseFloat(item);
    }
    
}
class Memory {
    tape = [];
    constructor() {
        this.tape = [];
    }
    get(index){
        if(this.tape[Nums.parseInt(index)] == undefined){
            throwError(0);
        }
        return this.tape[Nums.parseInt(index)]
    }
    set(index,item){
        this.tape[Nums.parseInt(index)] = item;
    }
    push(item){
        this.tape.push(item);
    }
}
var curFunc = "";
var memory = new Memory();
var functionC = [];
var funcargs = [];
var i = 0;
var temp_i = 0;
var funcs = {
    "push": function (item) {
        memory.push(item);
        return item;
    },
    "set": function (index, item) {
        memory.set(index,item);
        return item;
    },
    "increment": function (index) {
        memory.set(index,memory.get(index)+1);
        return memory.get(index);
    },
    "decrement":function(index){
        memory.set(index,memory.get(index)-1);
        return memory.get(index);
    },
    "ask": function (text) {
        return prompt(text);
    },
    "add": function (number1, number2) {
        return number1 + number2
    },
    "more": function (number1, number2) {
        return number1 > number2
    },
    "less": function (number1, number2) {
        return number1 < number2
    },
    "moreis": function (number1, number2) {
        return number1 >= number2
    },
    "hasnumber": function (number) {
        return !isNaN(parseFloat(number))
    },
    "lessis": function (number1, number2) {
        return number1 <= number2
    },
    "is": function (number1, number2) {
        return number1 == number2
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
    "not": function (number) {
        return !number
    },
    "modulo": function (number1, number2) {
        if(Nums.parseFloat(number2) == 0){
            throwError(3);
        }
        return number1 % number2
    },
    "divide": function (number1, number2) {
        if(Nums.parseFloat(number2) == 0){
            throwError(3);
        }
        return number1 / number2
    },
    "exp": function (number1, number2) {
        return number1 ** number2
    },
    "root": function (number1, number2) {
        if(Nums.parseFloat(number2) == 0){
            throwError(3);
        }
        return Math.pow(Nums.parseFloat(number1), (1 / Nums.parseFloat(number2)))
    },
    "int": function (number) {
        return Nums.parseInt(number);
    },
    "float": function (number) {
        return Nums.parseFloat(number);
    },
    "round": function (number) {
        return Math.round(Nums.parseFloat(number));
    },
    "ceil": function (number) {
        return Math.ceil(Nums.parseFloat(number));
    },
    "fpart": function (number) {
        return Nums.parseFloat(number) - Nums.parseInt(number);
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
            memory.set(id,i);
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
        for(i = memory.get(id); i < codeSp.length; i++){
            lastreturn = runCommands(codeSp[i]);
            if(codeSp[i].split("(")[0] == "return" )break;
        }
        i = functionC.shift();
        funcargs.splice(-4);
        return lastreturn;
         
    },
    "getarg":function(id){
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
    /*
    if (nested) {
        // console.log(splitExpr(input).split("\n"))
        if (splitExpr(input).split("\n").length > 1) {
            // console.log("!!!"+input)
            return runQuery(input)
        }
    }*/
    if (input.match(/^\w+\(.*\)+$/g) != null) {
        return runFunc(input);
    }



    // console.log(input.match(/^\"[a-zA-Z0-9]+\"$/g) )

    if (input.match(/^[0-9]+/g) != null) {
        return parseInt(input)
    }


}

function runFunc(input) {
    let getFunc = input.split("(")[0];
    curFunc = getFunc;
    let getArg = splitCom(input.replace(input.match(/\w+\(/g)[0], "").slice(0, -1)).split("\n")
    getArg = getArg.filter(x => x != undefined && x != ",")
    //console.log(getArg)
    if(funcs[getFunc].length > getArg.filter(x=>x!='' && x!=undefined).length){
        throwError(1);
    }
   // console.log(getArg.filter(x=>x!='' && x!=undefined))
    return funcs[getFunc](...getArg.map(x => runCommands(x, true)))
}
codeSp = code.split("\n");
for (i = 0; i < codeSp.length; i++) {
   runCommands(codeSp[i])
}
//console.log(tape)