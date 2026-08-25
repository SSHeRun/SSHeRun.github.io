---
title: 'VS ATL exe template cannot generate a DLL'
description: 'When a Visual Studio ATL exe template fails MIDL with "will not generate DLLDATA.C," the file is usually in the wrong folder — not missing an interface. Here is the fix.'
pubDate: '2021-04-29'
heroImage: '../../assets/cover-vs-atl-exe-cannot-generate-dll-en.jpg'
tags: ['Windows', '教程']
lang: en
translationKey: 'vs-atl-exe-cannot-generate-dll'
---

# The error

The build reports:

```
EXEC : error : MIDL will not generate DLLDATA.C unless you have at least 1 interface in the main project.
```

And the pre-build echo looks like this:

```
if exist dlldata.c goto :END
echo Error: MIDL will not generate DLLDATA.C unless you have at least 1 interface in the main project.
Exit 1
:END
```

![Debugging an ATL project late at night](../../assets/inline-vs-atl-exe-cannot-generate-dll-01.jpg)

## How you get here

```mermaid
graph TB
OpenVS["Open Visual Studio"]-->NewATL["New ATL project"]
NewATL-->ChooseExe["Choose an .exe project"]
ChooseExe-->TwoProjects["You get ATLProject1 and ATLProject1PS"]
TwoProjects-->RunPS["Build ATLProject1PS"]
RunPS-->Error["The error above"]
```

## What is actually wrong

The message sounds like you forgot an interface. A stock Visual Studio template should generate that for you, so an "interface problem" is the wrong first guess.

Look at `if exist` — this is a **pre-build event**. If `dlldata.c` is not next to the project that checks for it, the check fails even when MIDL already wrote the file.

The proxy/stub (PS) project has a pre-build event that tests for `dlldata.c`. That file does not live in the same folder as the proxy/stub `.vcxproj`, so the check cannot see it. Change the pre-build event for every configuration/platform so it looks in the parent (main) project folder.

Linking the proxy/stub project has the same shape of bug: the linker cannot find `ATLProject1ps.def` because it lives under `ATLProject1`.

![Adjust the pre-build event and linker inputs](../../assets/inline-vs-atl-exe-cannot-generate-dll-02.jpg)

## The fix

### Step one

Point the pre-build event at the parent folder:

```
if exist ../ATLProject1/dlldata.c goto :END
echo Error: MIDL will not generate DLLDATA.C unless you have at least 1 interface in the main project.
Exit 1
:END
```

### Step two

Fix the module-definition path:

```mermaid
graph TB
Props["Project properties"]-->Linker["Linker"]
Linker-->Input["Input"]
Input-->Def["Module definition file"]
Def-->Path["Set it to ../ATLProject1/ATLProject1PS.def"]
```

After both changes, the PS project can see `dlldata.c` and the `.def` file, and the MIDL error goes away.

## Related posts

- [[windows-c-drive-cleanup-guide|A complete guide to cleaning a Windows C: drive]]
- [[winpe-pecmd-commands|PECMD commands in WinPE]]
