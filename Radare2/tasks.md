### Starting
- `r2 -` opens an r2 session without opening a file
- `r2 myfile.exe` opens a file without running an analysis on it
- `r2 -q -c i myfile.exe` opens `myfile.exe` and runs the `c`ommand `i` on it and then `q`uits afterward 

### Getting Help
- `r2 -hh` get help from command line
- `?` get help in session
- `x?` get help about "x"

### Analysis
- `i` gets file info
```
    [0x004007c2]> i
    file    /mnt/c/temp/DebugMe/ConsoleApp1/bin/Debug/ConsoleApp1.exe
    type    EXEC (Executable file)
    pic     false
    has_va  true
    root    pe
    class   PE32
    lang    unknown
    arch    x86
    bits    32
    machine i386
    os      windows
    subsys  Windows CUI
    endian  little
    strip   true
    static  false
    linenum false
    lsyms   false
    relocs  false
    rpath   NONE
    type    EXEC (Executable file)
    os      windows
    arch    i386
    bits    32
    endian  little
    file    /mnt/c/temp/DebugMe/ConsoleApp1/bin/Debug/ConsoleApp1.exe
    fd      10
    size    0x1200
    mode    r--
    block   0x100
    uri     ConsoleApp1.exe
```
- `ii` get imports
- `iz` get strings
- 