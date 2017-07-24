- Use `!sosex.mbm` to set break points in managed code
  - You can set breakpoints even if the module hasn't been loaded into the virtual address space
  - You can use wildcards to break on multiple meethods
    - `!mbm HelloWorld!HelloWorld.Program.Main*` Would set a breakpoint on `Main`, `MainInternal`, etc
    - 
            0:000> !mbm HelloWorld!HelloWorld.Program.Main*
            The CLR has not yet been initialized in the process.
            Breakpoint resolution will be attempted when the CLR is initialized.
