# Useful WinDbg Extensions
This is a partial list of extensions that are helpful when using WinDbg to debug managed (.NET) code
### sos
Son of Strike (sos) is the classic tool used to debug managed code through WinDbg. It provides general purpose tools for object inspection, stack & thread information, CLR structure inspection, garbage collection information, and more.

### sosex
sosex is a closed source community extension that provides functionality in addition to sos. Of particular interest are its breakpoint features and string searching functionality.

### psscor4
psscor4 is an augmentation of sos. It provides some ASP.NET specific commands such as listing compiled pages and the ASP.NET cache

### mex
mex is a debugging extension that was developed by Microsoft to be used internally when client memory dumps needed to be analyzed. It has since been released to the public for consumption. It is possibly the most powerful of all debugging extensions.

### pykd
pykd is an extension that allows you to control WinDbg via Python modules. This is particularly useful if you need to dynamically invoke commands based on the output of some previous commands. Obviously, this requires Python.

### NetExt
NetExt provides SQL like commands that make advanced searching and filtering easy inside WinDbg.