"use strict";

function initializeScript()
{
    return [new host.apiVersionSupport(1, 2)];
}

//   JIT HelloWorld.Program.Foo(Int32, Char, Boolean)
//   JIT HelloWorld.Program.Main(System.String[])
//  NONE EmptyArray`1..cctor()
//  NONE HelloWorld.Program..ctor()
//PreJIT System.Enum.GetHashCode()
function invokeScript()
{
    var ctl = host.namespace.Debugger.Utility.Control;   
    var exec = function(cmd) {
        let lines = []
        let output = ctl.ExecuteCommand(cmd);
        for(let line of output) {
            lines.push(line)
        }
        return lines;
    }
    var wl = function(line) {
        host.diagnostics.debugLog(line + "\n");
    }
    exec(".load c:\\debug\\x64\\sosex.dll");
    exec("!mu") // force sos to load

    var output = exec("!dumpdomain");
    var moduleFound = false;
    var list = []
    for(let line of output) {
        list.push(line)
    }
    var modules = []
    for(let i = 0; i < list.length; i++) {
        let line = list[i]
        if (/Module Name/.test(line)) {
            i++;
            while(/^[a-f0-9]{16}/.test(list[i])) {
                modules.push(list[i].substr(0,16))
                i++;
            }
            continue;
        }
    }
    let methodTables = new Set([])
    for(let mod of modules) {
        output = exec(`!dumpmodule -mt ${mod}`);
        for(let i = 0; i < output.length; i++) {
            let line = output[i]
            if(/^[a-f0-9]{16}/.test(line)) {
                methodTables.add(line.substr(0, 16))
            }
        }
    }
    let history = new Set([])
    let methods = []
    for(let mt of methodTables) {
        let output = exec(`!dumpmt -md ${mt}`);
        for(let line of output) {
            if(/^[a-f0-9 ]{34}/.test(line)) {
                let s = line.substr("00007ffa896b03c0 00007ffa889f97b8 ".length)
                if(!history.has(s))
                    methods.push(s)
            }
        }
    }

    methods.sort()
    for(let line of methods) {
        wl(line)
    }
}
