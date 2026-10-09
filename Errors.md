# Errors in Dorpn

Errors are a normal part of programming, and Dorpn is designed to 
report as many of them as possible **before** your program runs. The 
compiler reads your code in stages, and each stage looks for a 
different kind of mistake. When it finds one, it stops, tells you what 
went wrong and where, and no executable is produced.

This page explains the different kinds of errors you will meet, what 
causes each of them, and how to fix them. It is organized in the same 
order as the compiler's stages, from the earliest to the latest.

---

## Reading an Error Message

Every compile-time error has the same shape:

```text
✗ SyntaxError::Expected ':' at line 2, col 10 but got ''.
|File|: [hello.dpn]
```

The first line begins with the **kind** of error, followed by a 
description of the problem. Most syntax-level errors also include the 
line and column where the compiler noticed it. The second line names 
the file. In a terminal, the kind of error is colored so it is easy to 
spot: red for `SemanticError`, yellow for `SyntaxError`, and magenta 
for `LexorError` and `IndentError`.

| Kind | Stage | What it means |
|------|-------|---------------|
| `LexorError` | Reading characters | Something is wrong at the character level, such as an unclosed bracket |
| `IndentError` | Reading indentation | The indentation is not valid |
| `SyntaxError` | Reading structure | The code does not follow the shape of the language |
| `SemanticError` | Checking meaning | The code is well formed but does not make sense, such as a type mismatch |

A line number can point to where the compiler *noticed* the problem, 
which is sometimes the line right after the real mistake. If the 
reported line looks fine, check the line above it.

The first three kinds stop the compiler at the first error they find. 
Semantic errors are different: the compiler collects all of them and 
prints the whole list, so you can fix several problems in one go. A 
single mistake can sometimes produce more than one message.

---

## Lexor Errors

These come from the first stage, where the compiler turns your text 
into pieces it can work with. They are about brackets and comments.

**Unclosed bracket.** An opening `(` or `[` was never closed:

```dpn
print("a"                      # LexorError: Unclosed ... expected '(' 
```

**Mismatched closing bracket.** A closing bracket has nothing to match:

```dpn
print("a"))                    # LexorError: Mismatched closing expected ')'
```

**Unclosed block comment.** A `#[` comment never reached its `]#`:

```text
✗ LexorError::Unclosed multi-line comment (missing closing ']#'), started near line 2.
```

Count your brackets, and make sure every `#[` has a matching `]#`.

The lexer is stricter since v0.4.4. Unknown characters, single-quoted 
strings, non-ASCII text outside strings and comments, strings spanning 
several lines, and the `\000` escape are now errors. Simple statements 
must end at the end of the line.

---

## Indent Errors

These come from checking the spaces at the start of each line. The 
rules are described on the [Syntax Basics](/Syntax) page.

```text
✗ IndentError::Invalid indentation at line 3 - indent must be 2 or 4 spaces (3).
```

Each new block must be indented by exactly 2 or 4 spaces more than the 
line above. The number in parentheses is the amount that was found. A 
tab counts as one space, so a tab-indented line is reported with `(1)`.

```text
✗ IndentError::Inconsistent indentation at line 4 (got 2 spaces, 0).
```

This appears when a line moves back to a level that no enclosing block 
uses:

```dpn
if true:
    print("x")
  print("y")                   # 2 spaces: matches no earlier level
```

---

## Syntax Errors

Syntax errors mean the code is not shaped the way the language 
expects. The common ones are listed here.

| Message | Usual cause | Fix |
|---------|-------------|-----|
| `Expected ':' ...` | A block-opening line has no colon | Add `:` at the end of the line |
| `Expected indented block ...` | Nothing is indented below a colon | Indent the body, or use `void` |
| `Expected an expression ...` | A value is missing, or a reserved word was used | Write the missing value, and avoid reserved words |
| `'a' must be initialized; expected '=' ...` | A variable was declared without a value | Write `tag a = value` |
| `Expected a valid 'type' ...` | An unknown type name was used | Use `Int`, `Float`, `String`, `Bool`, `Int32`, `Float32` or `Unit` |
| `Expected newline ...` | Two statements share one line | Put each statement on its own line |
| `Expected '(' ...` | A function has no parameter list | Write `func name():` even with no parameters |

Some examples:

```dpn
tag a                          # 'a' must be initialized; expected '='
tag b : Integer = 1            # Expected a valid 'type' but got 'Integer'
func f:                        # Expected '(' but got ':'
    print(1)
```

Every variable in Dorpn needs a starting value, because the compiler 
uses that value to decide the variable's type.

---

## Semantic Errors

Semantic errors are the largest group. The code is written correctly, 
but it breaks one of the language's rules. These rules are what make 
Dorpn a strongly typed language, so this is the compiler doing its 
main job.

### Variables

| Message | Cause |
|---------|-------|
| `Redefinition of variable 'a'.` | The same name was declared twice |
| `Variable 'x' is used but not defined.` | A name was used before it was declared |
| `Assignment to undefined variable 'x'.` | A value was assigned to a name that was never declared |
| `Cannot reassign to immutable 'a'.` | An `imm` variable was reassigned |
| `Cannot reassign to Constant 'a'.` | A `Const` was reassigned |
| `Invalid assignment: runtime value assigned to 'a', expected compile-time constant.` | A `Const` was given a runtime value such as `ask()` |

```dpn
imm a = 1
a = 2                          # Cannot reassign to immutable 'a'

Const b = ask("x")             # runtime value assigned to 'b'
```

See [Variables](/Variables) for the full rules for `tag`, `imm` and 
`Const`.

### Types

A `Type mismatch` error appears when a value of one type is given to 
something that expects another, either when a variable is declared or 
when it is reassigned later:

```dpn
tag a : Int = "hi"             # Type mismatch: declared Int, assigned String

tag b = 1
b = "x"                        # Type mismatch on reassignment
```

Operations are checked as well. Only `+` works between a `String` and 
another type, so this fails:

```dpn
tag c = "x" - 1               # '-' not supported between String and Int
```

### Conditions

```dpn
if 5:                          # Must be a Boolean expression
    print(1)
```

### Built-in functions and methods

The compiler checks how built-ins are called:

```dpn
tag n = ask(5)                 # 'ask' expects String prompt, got Int
print()                        # too few arguments to function 'print'
tag f = 1.5
tag g = f.asInt32()            # 'asInt32' can only be called on Int, got Float
tag b = true
tag m = b.asInt()              # 'asInt' cannot convert from Bool
```

### `Onload`

`Onload()` reads a file while the program is being compiled, so its 
arguments must be known at that time:

| Message | Cause |
|---------|-------|
| `Onload() requires a literal string path (compile-time preload).` | The path was a variable instead of a string literal |
| `Onload(): file not found: '...'` | The file does not exist |
| `Onload() threshold must be a literal Int (bytes).` | The second argument was not a whole-number literal |
| `Onload() takes 1 or 2 arguments: path, [threshold-in-bytes]` | Wrong number of arguments |

---

## Warnings

A warning does not stop the build. Dorpn prints it and continues. The 
only warning you will see from your own code today comes from 
`Onload()`, when a file is larger than the limit you set:

```text
⚠ Warning::Onload(): 'data.txt' (12B) exceeds threshold (5B).
|File|: [hello.dpn]
```

---

## New Semantic Checks in v0.4.4

Version 0.4.4 moved many mistakes that used to reach the C compiler, 
or silently produce wrong code, into Dorpn's own semantic analysis. 
They are now reported as clear `SemanticError` messages before any 
build step runs:

- unknown functions and methods
- wrong argument count or argument type, for builtin and user-defined functions
- `return` with a missing, unexpected or mismatching value
- `halt` / `skip` outside a loop
- duplicate function and parameter names
- using the result of a call that returns no value
- using a name outside the block where it was declared

Two more checks are new in this version:

- `[...]` list literals and `[]` indexing report "not supported yet" 
  instead of compiling to a wrong value. Use `.at(i)` to read a 
  character from a string.
- Variable and function names that clash with C or JavaScript reserved 
  names are handled automatically.

---

## Errors From the C Compiler

Some mistakes used to be found only when the generated C code was 
compiled. Since v0.4.4, most of them are caught by Dorpn's own checks 
(see the section above), but a few can still slip through. When that 
happens, you see this header followed by the message from the C 
compiler:

```text
✗ Compilation failed:
```

The messages mention C code and a `.c` file that you never wrote, which 
can look confusing. The exact wording depends on the C compiler you 
use, but these are the cases you are most likely to meet:

| The C compiler complains about | What it usually means in Dorpn |
|--------------------------------|--------------------------------|
| Too few or too many arguments to a function | A function was called with the wrong number of arguments |
| An undefined reference or undefined symbol | A function that does not exist was called |
| `break` not within a loop | `halt` outside a loop (now reported by Dorpn itself) |
| `continue` not within a loop | `skip` outside a loop (now reported by Dorpn itself) |
| An undeclared identifier | A variable created inside a block was used outside it (now reported by Dorpn itself) |

The name and line in the message still point to the right place. Read 
the message for the function or variable name, then find it in your 
`.dpn` file.

---

## Runtime Errors

Runtime errors happen while your program is running, after compilation 
succeeded. They cannot be found in advance because they depend on the 
values the program receives. A runtime error prints a `panic` message 
and ends the program with exit code `1`.

```dpn
imm text = ask("Enter a number: ")
tag n = text.asInt()
```

If the user types `abc`, the program stops:

```text
panic: asInt: String is not a valid Int
Program exited with code 1
```

A conversion to a smaller type stops the program in the same way when 
the value does not fit:

```text
panic: asInt32: value out of range for Int32
```

You can also stop the program yourself with `panic("message")` when it 
reaches a situation it cannot handle. To end it with a specific exit 
code and no message, use `error_out(code)`, and to end it normally, use 
`finish()`. These are described in [Built-in Functions](/Built-in-Functions).

To avoid the most common runtime error, check the input before 
converting it, or accept that a bad input ends the program and write 
the prompt so users know what to enter.

---

## Quick Troubleshooting Guide

| Symptom | First thing to check |
|---------|----------------------|
| `IndentError` | Spaces only, and 2 or 4 per level |
| `Expected ':'` | The line that opens a block |
| `Redefinition of variable` | Did you declare the same name in two blocks? |
| `Type mismatch` | The type of the first value the variable received |
| `Must be a Boolean expression` | Use a comparison such as `count > 0` |
| `Compilation failed` with C messages | Few remaining cases not caught by Dorpn; since v0.4.4 wrong arguments, `halt`/`skip` placement and names used outside their block are reported as semantic errors |
| `Program exited with code 139` | A function parameter declared without a type |

