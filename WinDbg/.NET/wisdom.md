# To Be Sorted
- Use `!sosex.mbm` to set break points in managed code
  - You can set breakpoints even if the module hasn't been loaded into the virtual address space
  - You can use wildcards to break on multiple methods
    - `!mbm HelloWorld!HelloWorld.Program.Main*` Would set a breakpoint on `Main`, `MainInternal`, etc
    - 
            0:000> !mbm HelloWorld!HelloWorld.Program.Main*
            The CLR has not yet been initialized in the process.
            Breakpoint resolution will be attempted when the CLR is initialized.
- `!EEstack` will display more information than `~*k` because WinDbg doesn't know about 

# Dealing With Crash Dumps
Unfortunately, crash dumps don't have full memory. This means you typically can only find truly useful information
on the stack. This means that you are likely only ever going to find primitive types. If you are lucky you have some
integer ids or the like. 

To find these values its best to take the following actions:
1. Use WinDbg to find threads you think might have values of interest
1. Get the low and high addresses for the memory range on the stack you are interested
   - The stack frames should give you an idea of how much you want to search, but you could always just do stack base and stack limit
1. Use CLRMd to write a small script that will inspect 32/64 bit values for you (don't forget to add `Microsoft.Diagnostics.Runtime` to the nuget packages(`CLRMd`))
     - I find LINQPad to be especially useful here
     - The following script will search whatever memory range you have decided on for some predetermined values
       - This would be useful in scenarios where you have an ELK stack or SPLUNK license and have some traces of ids of interest
     - 

        using (DataTarget dt = DataTarget.LoadCrashDump(@"C:\path\to\mycrash.dmp"))
        {
          // you get these values from looking at the stack trace for some stack that looks interesting
          long lo = 0x0000003cfc9fe6d0;
          long hi = 0x0000003cfc9fe9d0;
          
          // calculate how big the buffer has to be
          long bufferSize = hi - lo;

          byte[] buffer = new byte[bufferSize];
          
          // if you are looking for some potential values put them here
          long[] potentials = new long[] { 0x3d09537, 0x10200, 0x313, 0x41412 };
          int bytesRead;
          
          // read from virtual memory into the buffer
          dt.ReadProcessMemory((ulong)lo, buffer, (int)bufferSize, out bytesRead);
          Dictionary<long, int> count = new Dictionary<long, int>();
          
          // we are assuming 8 byte pointers here, but you could adjust if necessary
          for (int i = 0; i < bytesRead; i += 8)
          {
            long value = BitConverter.ToInt64(buffer, i);

            if (potentials.Contains(value))
            {
              if(!count.ContainsKey(value))
                count.Add(value, 0);
              count[value]++;
            }
          }
          count.OrderByDescending(x => x.Value).Dump();
        }
