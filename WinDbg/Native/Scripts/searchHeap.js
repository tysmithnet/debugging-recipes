"use strict";

function invokeScript()
{
    
}

function searchHeap(pattern, minLength)
{
    var control = host.namespace.Debugger.Utility.Control;
    var log = host.diagnostics.debugLog;

    if(!pattern)
        pattern = "";

    if(!minLength)
        minLength = 4;
    
    try
    {
        var regexp = new RegExp(pattern);
    }
    catch(e)
    {
        log("Invalid regular expression passed as input: " + e)
    }
    
    var heapOutput = control.ExecuteCommand("!heap -a");
    for(var line of heapOutput)
    {
        if(!/Segment at/.test(line))
            continue;
        var words = line.split(' ');
        var lo = null;
        var hi = null;
        for(var word of words)
        {
            if(!/[0-f]{16}/.test(word))
                continue;
            if(!lo)
            {
                lo = word;   
                continue;
            }
            hi = word;
            break;
        }
        var searchOutput = control.ExecuteCommand(`s -[l${minLength}]sa ${lo} ${hi}`);
        for(let line2 of searchOutput)
        {
            if(!regexp.test(line2))
                continue;
            log(`${line2}\n`);
        }

        searchOutput = control.ExecuteCommand(`s -[l${minLength}]su ${lo} ${hi}`);
        for(let line2 of searchOutput)
        {
            if(!regexp.test(line2))
                continue;
            log(`${line2}\n`);
        }
    }
}