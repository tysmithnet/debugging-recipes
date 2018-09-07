# Modules
- `lm`
- `lmm clr*` list modules that match a wildcard expression

# Registers
- `r` displays registers
- `r eax=0x000000FF` set the `eax` register to `0x000000FF` on the current thread

# Memory
You can display memory using the Memory window of WinDbg and get a better user experience than any of the commands
- `ALT + 5` keyboard shortcut
- `dq <addr>` - displays 64bit values starting at addr
- `s -sq 
You can also view memory in the command window using commands from the `d` family
### Text
- `da <addr>` - ascii
- `du <addr>` - unicode
- `db <addr>` - byte and ascii
- `dc <addr>` - 32 bits and ascii
- `s -sa 0 L80000` - look for ansi strings of length 3+ in the address range 0 80000
- `!mex.dss` - displays all strings on the current stack

# Code
- `!mu` view MSIL interleved with assembly at the current instruction pointer
- `u addr` view disassembly at addr 
- `u @rip-10 L10` view disassembly around the current value of the rip register
 
# Imports
- `!mex.imports <module addr>` - displays the imports for a particular module
- `!mex.imports -f Time` - displays all modules with an import containing Time

# Exports
- `x /D /f KERNEL32!GetSystemT*` - look for exports in Kernel32 that start with GetSystemT

# BreakPoints
- `bl` - list breakpoints
- `sxe ld clr` - break when clr.dll is loaded
- `bm KERNEL32!GetSystemT*` - set a breakpoint on all functions in Kernel32 that start with GetSystemT
- `bp ntdll!NtQuerySystemTime` - set a breakpoint a specific function
- `bd 42` - disable breakpoint 42
- `bc 42` - clear breakpoint 42
- `bc *` - clear all breakpoints

# Threads & Stacks
- `~*kv` - shows all stacks and their args
- `!mex.dss` - displays all strings on the stack for the current thread

# Expressions
- `? @rcx` - prints the value of rcx
