# Syntax Basics

Dorpn is an indentation-based language. There are no curly braces to 
open a block, no semicolons to end a statement, and no parentheses 
around conditions. A statement ends where the line ends, and a block 
is simply a group of lines that are indented further than the line 
that introduced them.

This page covers the rules that apply everywhere in the language: how 
a program is laid out, how indentation works, how to write comments, 
what names and keywords look like, and how to write literal values 
such as numbers and strings. Once these rules feel natural, the rest 
of the language builds on them.

---

## Program Structure

A Dorpn file is a list of statements that run from top to bottom. 
Variable declarations, function calls, `if` blocks and loops can all 
appear directly at the top level of the file, and they execute in the 
order they are written.

Function definitions are the one exception to this ordering. A 
function can be defined anywhere in the file, and it can be called 
from anywhere, including from lines that appear above the definition.

If a file defines a function named `_Start`, Dorpn calls it 
automatically once all top-level statements have finished. You never 
call `_Start` yourself. It is the natural place for the main logic of 
a program, while the top level is used for constants and setup.

```dpn
print("before")
hello()                        # fine, even though hello is defined below

func hello() -> Unit:
    print("hi")

func _Start() -> Unit:
    print("start runs last")

print("after")
```

Running this program prints:

```text
before
hi
after
start runs last
```

Notice that `_Start` ran last, after the top-level `print("after")`, 
even though it appears earlier in the file.

---

## Indentation

Blocks are created by indentation. A line that ends with a colon 
starts a block, and every line inside that block must be indented 
further than the line that started it.

```dpn
tag age = 20

if age >= 18:
    print("adult")
    print("welcome")
print("this line is outside the block")
```

Each new level of indentation must be exactly **2 or 4 spaces** deeper 
than the level before it. Any other amount is rejected. You are free 
to choose either 2 or 4 for your project, but it is best to pick one 
and use it everywhere.

When a block ends, the next line must return to a level that already 
exists. You cannot dedent to a position that was never used by an 
enclosing block.

```dpn
if true:
    if true:
        print("two levels deep")
    print("back to one level")
print("back to zero")
```

Blank lines and comment-only lines are ignored, so you can use them 
freely to separate sections of your code.

### Tabs are not supported

Indentation must be made of spaces. A tab character is counted as a 
single space, which is not a valid indentation step, so a tab-indented 
block produces an `IndentError`. If your editor inserts tabs when you 
press the Tab key, switch it to insert spaces instead.

### Single-line branches

For `if`, `elif` and `else`, a block that contains one statement can 
be written on the same line as the colon:

```dpn
if score > 90: print("excellent")
elif score > 50: print("passed")
else: print("try again")
```

Loops and functions always need a normal indented block.

---

## Comments

Dorpn supports two kinds of line comments and one kind of block 
comment. Comments are ignored by the compiler and exist only for 
human readers.

```dpn
# A line comment starting with a hash

tag a = 1            # a comment after code

#[ A block comment.
   It can span many lines. ]#
```

> **Removed in v0.4.4:** The `--` single-line comment style has been 
> removed. Writing `--` now reports a clear error instead of being 
> treated as a comment. Use `#` for line comments and `#[ ... ]#` for 
> multi-line comments.

A block comment starts with `#[` and ends with `]#`. Block comments 
can be nested, which makes them convenient for temporarily disabling a 
piece of code that already contains a comment:

```dpn
#[ disabled for now
print("a")
#[ an old note ]#
print("b")
]#
```

If a block comment is never closed, the compiler stops with a 
`LexorError` that tells you the line where the comment began. When you 
write a block comment on its own lines, put the closing `]#` at the 
end of a line rather than in front of code.

---

## Names and Keywords

Names for variables and functions are built from letters, digits and 
underscores. A name cannot start with a digit, and names are case 
sensitive, so `count` and `Count` are two different names.

```dpn
tag score = 10
tag _temp = 3
tag player_two = 7
```

Some words have a special meaning in the language. These are called 
keywords, and they cannot be used as names.

| Keywords | Purpose |
|----------|---------|
| `tag` `imm` `Const` | Declaring variables |
| `func` `return` | Defining functions and returning values |
| `if` `elif` `else` | Conditions |
| `loop` `keep` `halt` `skip` | Loops and loop control |
| `and` `or` `not` `fld` | Word operators |
| `true` `false` | Boolean values |
| `void` | An empty statement that does nothing |

The type names `Int`, `Float`, `String`, `Bool`, `Int32`, `Float32` 
and `Unit` are also special. See the [Types](/Types) page for details.

---

## Literals

A literal is a value written directly in the code.

| Literal | Type | Examples |
|---------|------|----------|
| Whole number | `Int` | `0`, `42`, `1000` |
| Decimal number | `Float` | `3.14`, `0.5`, `2.0` |
| Text | `String` | `"Dorpn"`, `"hello world"` |
| Boolean | `Bool` | `true`, `false` |

Negative numbers are written with a leading minus sign, as in `-5`. 
Strings are always written with double quotes. Single quotes are not 
used for strings in Dorpn.

---

## Strings and Escape Sequences

Inside a string, a backslash starts an escape sequence. It lets you 
write characters that are difficult or impossible to type directly.

| Sequence | Meaning |
|----------|---------|
| `\n` | New line |
| `\t` | Tab |
| `\r` | Carriage return |
| `\\` | A single backslash |
| `\"` | A double quote |
| `\033` | The ESC character, used for terminal colors |

```dpn
print("Name:\tDorpn")
print("She said \"hello\"")
print("C:\\projects")
```

```text
Name:	Dorpn
She said "hello"
C:\projects
```

The `\033` sequence is an octal escape. It is mostly useful for 
printing colored text in a terminal, as in this example:

```dpn
Const CYAN :String = "\033[96m"
Const RESET :String = "\033[0m"

print(CYAN + "colored text" + RESET)
```

If a backslash is followed by a character that has no special 
meaning, the backslash is dropped and the character is kept as it is.

Not every octal escape is supported: the `\000` escape, for example, 
is reported as an error.

---

## Common Mistakes

### 1. Mixing tabs into indentation

A tab is not a valid indentation step. Configure your editor to insert 
spaces, and the error disappears.

### 2. Indenting by 3 spaces

Each level must be 2 or 4 spaces deeper. Three spaces, or five, or any 
other amount, is an `IndentError`:

```dpn
if true:
   print("3 spaces")           # IndentError: must be 2 or 4 spaces
```

### 3. Forgetting the colon

Every line that opens a block, whether `if`, `elif`, `else`, `loop`, 
`keep` or `func`, must end with a colon:

```dpn
if score > 50                  # SyntaxError: Expected ':'
    print("passed")
```

### 4. Leaving the block empty

A colon must be followed by an indented block. If nothing is indented 
below it, the compiler reports `Expected indented block`. Use `void` 
when you genuinely want a block that does nothing:

```dpn
if debug:
    void
```

### 5. Writing semicolons out of habit

Dorpn does not need semicolons. A stray `;` at the end of a line is 
skipped and does no harm, but it is not part of the language and 
should not be used.
