# Common Debugging Tasks
This is a collection of useful snippets and pieces of advice on routine tasks when debugging. This document assumes you have the following extensions loaded:
 - sos
 - sosex
 - mex
 - netext

My goal is to provide a number of correct solutions for each particular use case. Please feel free to submit a PR if you have other methods.

## Loading the correct DAC
The DAC is the library that allows WinDbg to make sense of the CLR's internals.
To load the correct version of the DAC use: `.cordll -ve -u -l`

## Loading Extensions
The call to `!mu` in the below example is just to force sosex to load the appropriate version of sos for you. You could also just load the correctly version if you know where it is.

    .load sosex
    !mu
    .load mex

## Getting Help
 - `!ext.help` where `ext` is a loaded extension
    + `!sos.help`
    + `!sosex.help`
    + `!mex.help`
      + `!mex.help category` where `category` is dotnet, utilities, etc
      + `!mex.somemexcommand -?` where `somemexcommand` is a mex command
    + `!psscor4.help`
    + `!netext.help`
 - `.hh` will load the debugging manual that ships with the Windows Driver Kit (WDK)
## Finding things
### AppDomains
 - `!dumpdomain` dumps all domains and their loaded assemblies and the modules contained in those assemblies

        Domain 2:           000001aad6de5730
        LowFrequencyHeap:   000001aad6de5f28
        HighFrequencyHeap:  000001aad6de5fb8
        StubHeap:           000001aad6de6048
        Stage:              OPEN
        SecurityDescriptor: 000001a64b0b1e30
        Name:               /LM/W3SVC/1/ROOT/Asyncweb-1-131439296514815659
        Assembly:           000001a64b15b330 [C:\WINDOWS\Microsoft.Net\assembly\GAC_64\mscorlib\v4.0_4.0.0.0__b77a5c561934e089\mscorlib.dll]
        ClassLoader:        000001a64b143630
        SecurityDescriptor: 000001aad6d9d740
          Module Name
        00007ff8b47e1000            C:\WINDOWS\Microsoft.Net\assembly\GAC_64\mscorlib\v4.0_4.0.0.0__b77a5c561934e089\mscorlib.dll

        ...

 - `!dumpdomain 000001aad7678f60` dumps the app domain at the specified address

### Assemblies
 - `!ul !grep -r ^Assembly !dumpdomain` list all assemblies loaded into all app domains

        1:  Assembly:   000001aad767adc0 [C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Temporary ASP.NET Files\asyncweb\a4686693\90c46df1\assembly\dl3\6a8efc97\00c691c4_1b11ce01\Antlr3.Runtime.dll]
        1:  Assembly:   000001aad767b120 [C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Temporary ASP.NET Files\asyncweb\a4686693\90c46df1\assembly\dl3\0aed2a39\0092614d_9dafcf01\Newtonsoft.Json.dll]
        1:  Assembly:   000001aad767b240 [C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Temporary ASP.NET Files\asyncweb\a4686693\90c46df1\assembly\dl3\559dc36f\0027753d_8eaece01\WebGrease.dll]
        2:  Assembly:   000001aad75c8cc0 [C:\WINDOWS\Microsoft.Net\assembly\GAC_MSIL\SMDiagnostics\v4.0_4.0.0.0__b77a5c561934e089\SMDiagnostics.dll]
        2:  Assembly:   000001aad7420d30 [C:\WINDOWS\Microsoft.Net\assembly\GAC_MSIL\System.ServiceModel.Activities\v4.0_4.0.0.0__31bf3856ad364e35\System.ServiceModel.Activities.dll]

 - `!grep -r CantFindMe.dll !grep -r ^Assembly !dumpdomain` find a specific assembly

### Modules
 - `!ul !grep -r dll$ !grep -r "Module Name" -v !grep -r ^Assembly -v !grep -r "Module Name" -until ^Assembly !dumpdomain` find a specific module
 - `!ul !grep -r SomethingICareAbout.dll$ !grep -r "Module Name" -v !grep -r ^Assembly -v !grep -r "Module Name" -until ^Assembly !dumpdomain` find a specific module


            1:  00007ff859bd5990            C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Temporary ASP.NET Files\asyncweb\a4686693\90c46df1\assembly\dl3\3951700f\001f9021_36abce01\Microsoft.ScriptManager.WebForms.dll
            1:  00007ff859bd6100            C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Temporary ASP.NET Files\asyncweb\a4686693\90c46df1\assembly\dl3\8a01b91c\00a1a54a_c79fce01\AspNet.ScriptManager.bootstrap.dll
            1:  00007ff859bd6880            C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Temporary ASP.NET Files\asyncweb\a4686693\90c46df1\assembly\dl3\34b508dc\0079b1ee_888dce01\Microsoft.AspNet.FriendlyUrls.dll
            1:  00007ff859bd7360            C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Temporary ASP.NET Files\asyncweb\a4686693\90c46df1\assembly\dl3\837f8b33\003e9a1b_36abce01\Microsoft.ScriptManager.MSAjax.dll

    + USUALLY there is a 1:1 relationship between assemblies and modules, but this not always true
  - `!dumpmodule -mt 00007ff859c73b48` list module info including dependent and depended types  
  
### Objects
 - `!windex -type MyCompanyName.NameSpace.Type` finds instances of a specific type
 - `!dumpgen 0 -stat -type NHibernate` gets stats on types that contain NHibernate in gen0
 - `!refs addr` find references to and from the object at addr
 - `!mroots -all addr` find all direct and indirect roots for the object at addr
 - `!dumpobj addr` dump the fields of an object at addr 

### Strings
 - `!sosex.strings` list all strings
 - `!sosex.strings /g:2 /n:1024` list all strings in gen 2 that are 1024+ bytes
 - `!sort -f 3 -ai !sosex.strings` list all strings in sorted order

### Arrays
 - `!da addr` dump information about the array at `addr`
 - `!da -details` dump the array and its elements 

### Types 
 - `!dumpmodule -mt 00007ff859c73b48` list all types in a module
 - `lmDvm MyModuleName` provides a formatted list of output about a module 

### Viewing Code & Instructions
 - `!dumpstack` view managed and native stack frames
 - `!dumpstack -EE` view managed stacks
 - `!EEStack` view managed and native stacks

### Heap Information
 - `!eeheap` find summary information on all heaps
 - `!wheap -detailsonly` a nicer summary for heaps

## Misc
 - `.cls` clears the screen
 - `sxe ld clr` break when the CLR is loaded into the process address space
