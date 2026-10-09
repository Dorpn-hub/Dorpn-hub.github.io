# Dorpn v0.4.4

> This release brings Unicode correctness to strings: proper multi-byte handling, character-level access, character code conversion, and consistent behavior on both the C and JavaScript backends. It also includes a broad cleanup and stability pass across the compiler, both backends and the command line.

## Added

### `.at(index)` string method

Returns the character at the given position as a String. Counts Unicode characters, not bytes. Negative indexes count from the end. Out-of-range access panics with a clear error. Works on both backends.

```dpn
tag name = "नमस्ते"
print(name.at(0))     # "न"
print(name.at(-1))    # "े"
print(name.at(100))   # panic: at: index out of bounds
```

### New units for `.size()`

- `"char"` / `"chars"`: Unicode character count (now the default)
- `"byte"` / `"bytes"`: raw UTF-8 byte count, useful for file and network sizes

Unknown units fall back to bytes and print a warning to stderr, so typos don't silently give wrong values.

```dpn
tag s = "नमस्ते"
print(s.size("char"))        # 6
print(s.size("byte"))        # 18
print(s.size("bit"))         # 144
print(s.size("kilobyte"))    # Warning: unknown size unit 'kilobyte', returning bytes
                             # 18
```

### `toCode(c)` function

Returns the numeric code point of the first character in a String. Unicode-aware on both backends. Useful for character classification, custom case conversion, encoding, and any program that needs the numeric value of a character.

```dpn
print(toCode("h"))     # 104
print(toCode("A"))     # 65
print(toCode("न"))     # 2344
print(toCode("👋"))    # 128075
```

### `toChar(n)` function

Returns a String containing the character for the given code point. Unicode-aware on both backends. Invalid code points (out of range or surrogate values) are rejected with a panic.

```dpn
print(toChar(104))      # "h"
print(toChar(2344))     # "न"
print(toChar(128075))   # "👋"
print(toChar(-1))       # panic: toChar: invalid codepoint
```

### `writeOut(path, content)` function

Implements file I/O operations , writing the provided string content to specified file path.

```dpn
writeOut("output.txt", "Hello,World!")
```

### Stricter compile-time checks

Many mistakes that used to reach the C compiler, or silently produce wrong code, are now reported by Dorpn itself with a clear message:

- unknown functions and methods
- wrong argument count or argument type, for builtin and user-defined functions
- `return` with a missing, unexpected or mismatching value
- `halt` / `skip` outside a loop
- duplicate function and parameter names
- using the result of a call that returns no value
- using a name outside the block where it was declared

### Clear error for unsupported list syntax

`[...]` list literals and `[]` indexing now report "not supported yet" instead of compiling to a wrong value. Use `.at(i)` to read a character.

### Reserved-name safety

Variable and function names that clash with C or JavaScript reserved names are handled automatically.

### Tooling

- The C compiler is auto-detected (clang, then gcc, then cc). Set `DORPN_CC` to choose one.
- Runtime files are also found next to the `dorpn` binary, so it can be started from any directory.
- Faster string concatenation chains.
- Regression test suite for both backends.

## Changed

### `.size()` now counts characters by default

`.size()` returns the Unicode character count instead of the byte count. For ASCII-only strings nothing changes.

```dpn
tag hindi = "नमस्ते"
print(hindi.size())    # 6  (was 18)

tag word = "hello"
print(word.size())     # 5  (unchanged)

print("👋".size())     # 1  (was 4)
```

> **Migration:** if your code relied on `.size()` returning bytes, switch to `.size("byte")`.

### Stricter language rules

- `/` always returns Float, so assigning it to an Int variable is now a type error.
- A user function cannot reuse a builtin name (`print`, `max`, `add`, ...).
- `keep` needs a Bool condition. `loop` needs a numeric count, evaluated once before the loop starts.
- String, number and Bool are separate categories for arguments and return values (Int and Float still mix freely).
- A function without `->` that never returns a value is now void.
- `printOut` takes exactly one argument.
- The lexer is stricter: unknown characters, single-quoted strings, non-ASCII text outside strings and comments, strings spanning several lines and the `\000` escape are errors. Simple statements must end at the end of the line.

> **Migration:** use `fld` where you relied on `/` giving an Int, and rename any function that shares a name with a builtin.

### Behavior changes

- `Onload` embeds the file at compile time on both backends (JavaScript used to read it at run time).
- `.size("byte")`, `.size("bit")` and `.size("char")` return an Int on the C backend (previously a Float).
- `printOut` now flushes output immediately.
- `--run` returns the exit code of the program.
- Generated C is kept only with `-k` / `-V`, and an existing C file you wrote is never overwritten.
- `--upgrade` on non-Windows systems only shows the release link.

## Removed

- `--` single-line comments (deprecated earlier). Use `#` for comments and `#[ ... ]#` for multi-line comments. Writing `--` now reports a clear error instead of being treated as a comment or silently changing meaning.
- The non-functional `--cache` option and other unreachable command-line cases.
- Unused dependency files and prebuilt or generated artifacts from the source package.

## Fixed

- **Method calls after parentheses:** a parenthesized expression can now be followed by a method call. Expressions like `(a + b).size()` or `(c.asInt() - 32).asString()` previously failed with `Expected an expression ... but got '.'` even though the code was valid. Works on both backends.

  ```dpn
  tag code = toCode("h")
  tag upper = toChar((code - 32))     # "H"
  print((code + 1).asString())        # "105"
  ```

- **C backend:** `.size()` on Hindi, Devanagari, emoji and other multi-byte text now returns the correct character count.
- **JavaScript backend:** `.size()` now matches the C backend and returns the character count by default.
- **JavaScript backend:** `.size("char")` no longer crashes with a runtime error.
- **JavaScript backend:** `.size("bit")` now correctly returns bytes × 8 instead of the character count.

- **Lexer / Parser:**
  - Unknown characters and `!` were silently dropped.
  - Unterminated string literals swallowed the rest of the file.
  - Method calls on number and boolean literals.
  - `**` associativity.
  - Missing commas or closing parentheses were accepted.
  - Two statements on one line were accepted.
  - Crashes on invalid octal escapes and oversized integer literals.
  - UTF-8 BOM handling.
- **Semantic analysis:**
  - False type errors from incomplete type inference (unary minus, `.size()`, user function results, division).
  - Wrong `elif` condition check.
  - Missing block scoping (name reuse in sibling blocks, names leaking out of blocks and loops).
  - Self-referencing declarations were accepted.
  - Undefined variables were reported twice.
  - `return` statements were not analyzed.
  - Doubled period at the end of messages.
- **C backend:**
  - Unicode string literal escape bug.
  - Heap buffer overflow in float-to-string conversion.
  - Integer division and modulo by zero crashed (now a runtime panic).
  - Wrong result type for mixed Int/Float math builtins.
  - `printOut` crash on 32-bit values.
  - No-value (void) functions failed to build.
  - Non-constant `Const` initializers failed to build.
  - Wrong return type for calls placed before the function definition.
  - Function-local type information leaked into global scope.
  - `ask()` truncated long input and kept carriage returns.
  - Integer overflow in string repeat.
  - Output ordering between stdout and panic messages.
- **JavaScript backend:**
  - Size, indexing and reversal counted UTF-16 units instead of Unicode characters.
  - `ask()` broke on non-ASCII input.
  - Invalid generated syntax in `printOut` and negative-number expressions.
  - Identifier collision with the runtime binding.
  - Runtime module path resolution.
  - `--out` was ignored.
  - `%` characters in `print` output were treated as format specifiers.
  - Control-character escaping.
  - `type()` result differed from the C backend.
  - Lenient numeric string parsing.
  - Division and modulo by zero behaved differently from the C backend.
- **Both backends:** `.flip()` now reverses by Unicode character, so Hindi, emoji and other multi-byte text is no longer corrupted.
- **Command line:**
  - Options before the file name were not accepted.
  - `--run` always returned exit code 0.
  - Failures on paths containing spaces.
  - The version check crashed on short or suffixed tags.

## Known Limitations

- **No grapheme cluster support:** `.at()`, `toCode()` and `.flip()` work on single code points, not full visual characters. Combined emoji (👨‍👩‍👧‍👦) and Devanagari conjuncts (स्ते) get split into parts. Planned for a future release.
- **No `s[index]` or `s[start:end]` syntax yet:** this will arrive with the upcoming Lists / Arrays feature. Until then `[]` reports a clear error.
- **Float output formatting differs between backends:** the C backend prints six decimals, the JavaScript backend prints the shortest form.
- **Semantic errors have no line numbers yet.**

---

# Dorpn v0.4.3 Changelog

> This release focuses on improving developer experience; with clearer 
> error reporting, more expressive syntax options, and compiler 
> features that make coding and debugging smoother.

### Added

- **`.tidy()` string method:** trims leading and trailing whitespace 
from a string, with identical behavior guaranteed across both the C 
and JavaScript backends.

```dpn
tag name : String = "  Hello  ".tidy()
print(name)  # "Hello"
```

- **Optional size threshold for `Onload()`:** `Onload()`, which embeds 
a file's contents at compile time, now accepts an optional second 
argument specifying a size threshold in bytes. If the file exceeds it, 
the compiler emits a build-time notice so large embeds don't silently 
bloat the binary.

```dpn
tag data = Onload("assets/banner.txt", 512)
# ⚠ Warning::Onload(): 'assets/banner.txt' (612B) exceeds threshold (512B).
```

- **Single-line conditional syntax:** `if`/`elif`/`else` now accept a 
single statement on the same line as the colon, in addition to the 
existing multi-line block form, which remains fully supported and 
unaffected.

```dpn
tag x = 8
if x > 5: print("big")
elif x > 1: print("mid")
else: print("small")
```

- **Multiline comments:** compiler now supports block comments using 
`#[ ... ]#`, making it easier to document code.

```dpn
#[ This function converts Celsius to Fahrenheit.
   It assumes standard atmospheric pressure. ]#
func toFahrenheit(c: Float) -> Float:
    return c * 9 / 5 + 32
```

- **`Unit` type:** introduced for functions with no return value, 
ensuring consistent semantics across C and JavaScript backends.

```dpn
func logMsg(msg: String) -> Unit:
    print("[log]", msg)

logMsg("server started")
```

### Changed

- **`Onload()` on the JavaScript backend** now loads files at runtime 
rather than embedding them at compile time. JavaScript has no 
compile-time build step to embed into, so this keeps the feature 
meaningful for that target; the C backend's compile-time embedding is 
unaffected.
- **Generated C string literals** for embedded file content are now 
split across multiple concatenated string-literal lines.
- **Error messages with file names:** compiler errors now include the 
file name, making it easier to identify the source of issues.

```text
✗ SemanticError::Variable 'total' is used but not defined..
|File|: [billing.dpn]
```

### Fixed

- **User-defined function calls:** the C backend now correctly 
compiles calls to user-defined functions. Previously, these were 
silently dropped due to missing fallback handling. The JavaScript 
backend was already handling this case properly.

```dpn
func square(n: Int) -> Int:
    return n * n

print(square(6))  # now compiles correctly on the C backend
```

- **Single-line conditional rules:** `elif` and `else` must now begin 
on a new line after a single-line `if`. This enforces consistent 
syntax and prevents ambiguous chaining.

```dpn
if x > 5: print("big") elif x > 1: print("mid")
# ✗ SyntaxError::Expected newline but got 'elif'.

if x > 5: print("big")
elif x > 1: print("mid")
# ✓ compiles
```

