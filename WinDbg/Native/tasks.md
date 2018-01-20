# Modules
- `lm`
- `lmm clr*` list modules that match a wildcard expression

# Registers
- `r` displays registers
- `r eax=0x000000FF` set the `eax` register to `0x000000FF` on the current thread

# Memory
You can display memory using the Memory window of WinDbg and get a better user experience than any of the commands
- `ALT + 5` keyboard shortcut

You can also view memory in the command window using commands from the `d` family
### Text
- `da <addr>` ascii
- `du <addr>` unicode
- `db <addr>` byte and ascii
- `dc <addr>` 32 bits and ascii

# Code
- `!mu` view MSIL interleved with assembly at the current instruction pointer
- `u addr` view disassembly at addr 
 
# Exports
- `x /D /f KERNEL32!GetSystemT*` - look for exports in Kernel32 that start with GetSystemT

 # BreakPoints
- `sxe ld clr` - break when clr.dll is loaded
- `bm KERNEL32!GetSystemT*` - set a breakpoint on all functions in Kernel32 that start with GetSystemT