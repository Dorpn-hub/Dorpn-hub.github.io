# Introduction

Dorpn is a statically typed, compiled programming language built 
around a simple idea: code should read the way it is structured. There 
are no curly braces, no semicolons, and no parentheses around 
conditions. A block is defined by its indentation, a variable's type is 
fixed the moment it is declared, and the compiler checks both of these 
things before your program ever runs.

This documentation covers the language itself, from its basic syntax 
to its full set of built-in functions and methods, along with the 
`dorpn` command line compiler that turns your source files into 
running programs.

---

## Why Dorpn

Most beginner-friendly languages choose between two things: they are 
either easy to read or they catch your mistakes early. Dorpn is an 
attempt to keep both. Its syntax borrows the clean, indentation-based 
structure that makes a program easy to follow at a glance, while its 
type system is strict in the way a compiled language is expected to 
be. A variable's type is locked in when it is created, and any attempt 
to store an incompatible value in it, whether at the same line or three 
hundred lines later, is caught during compilation rather than 
discovered as a bug at runtime.

This combination is deliberate. Dorpn is not trying to be a scripting 
language that happens to look tidy, nor is it trying to be a low-level 
systems language. It sits in between: expressive enough to write and 
read comfortably, and disciplined enough that the compiler acts as a 
second pair of eyes on every line you write.

---

## How Programs Are Compiled

A Dorpn program does not run through an interpreter. When you compile a 
file, the `dorpn` compiler reads it, checks it for errors in several 
stages, and then translates it into C source code. That C code is 
compiled by a standard C toolchain together with a small Dorpn runtime 
library, producing a native executable that runs directly on your 
machine.

Dorpn can also target JavaScript instead of C, which produces a file 
that runs anywhere Node.js is available. Both paths start from the 
same source file and the same language rules; only the final output 
differs. The full set of compiler options, including how to choose a 
target and where the output is written, is covered on the 
[CLI Usage](/CLI) page.

---

## What the Language Looks Like

The following program asks for a name and greets the user. It touches 
several of the language's core ideas at once: a compile-time constant, 
a runtime-only variable, a function, and the automatic entry point.

```dpn
Const GREETING :String = "Hello"

func _Start() -> Unit:
    imm name = ask("What is your name? ")
    print(GREETING + ",", name.tidy() + "!")
```

```text
What is your name? Dorpn
Hello, Dorpn!
```

`GREETING` is declared with `Const`, because its value is fixed before 
the program runs. `name` is declared with `imm`, because it comes from 
the user and, once received, is never reassigned. The `_Start` function 
is the program's entry point, called automatically once every 
top-level statement above it has run. These ideas, along with the 
third kind of variable, `tag`, are explained in full on the 
[Variables](/Variables) page.

---

## Current Status

Dorpn is under active development, currently at version 0.4.4. The 
compiler itself is closed-source for the time being, and will remain 
so until the language reaches version 1.0 or becomes self-hosted, 
whichever comes first. This keeps the language's design and its 
documentation moving together while the core rules are still settling.

Compiler binaries are currently distributed for Windows. On Android, 
Dorpn code is written and compiled through a dedicated code editor 
built specifically for that purpose, maintained as a separate project.

---

## Where to Go From Here

If you are new to Dorpn, the recommended path through this 
documentation is:

1. **[Syntax Basics](/Syntax)** — how programs are structured, how 
indentation works, and how to write comments and literals.
2. **[Variables](/Variables)**, **[Types](/Types)** and 
**[Operators](/Operators)** — how values are declared, what kinds of 
values exist, and how to combine them.
3. **[Control Flow](/Control-flow)** and **[Functions](/Functions)** — 
how to make decisions, repeat work, and organize code into reusable 
pieces.
4. **[CLI Usage](/CLI)** — how to compile and run a program from the 
command line.
5. **[Examples](/Examples)** — complete, working programs that bring 
the earlier pages together.

The **Reference** section, covering 
[Built-in Functions](/Built-in-Functions) and 
[Built-in Methods](/Built-in-Methods), is meant to be consulted as 
needed rather than read start to finish. If something does not compile 
the way you expect, the [Errors](/Errors) page explains what each 
message means and how to fix it.
