# Built-in Methods

Dorpn provides a set of built-in methods that operate on values 
directly. These methods are invoked using dot-notation, where the 
value appears on the left side of the dot and the method name appears 
on the right. For example, `"hello".size()` calls the `size` method 
on the string `"hello"`.

These methods fall into two categories. 
- **The first category :** works primarily on strings and produces new strings or integers. 

- **The second category :** handles explicit type conversion, allowing you to change a value from one type to another when the need arises.

An important property to keep in mind is that none of the string 
methods modify the original value. Strings in Dorpn are immutable, so 
every method that appears to transform a string actually returns a new 
one, leaving the original untouched. When you write 
`tag rev = "hello".flip()`, the original `"hello"` is not modified. A 
new string `"olleh"` is created and assigned to `rev`.


## String Methods

> ### .at(index)

The `.at(index)` method returns the character at the given position as
a `String`. It counts Unicode characters, not bytes. Negative indexes
count from the end of the string. Accessing a position outside the
string panics with a clear error.

```dpn
tag name = "नमस्ते"
print(name.at(0))                  # "न"
print(name.at(-1))                 # "े"
print(name.at(100))                # panic: at: index out of bounds
```

Note that `.at()` works on single code points, not full visual
characters. Combined emoji and conjuncts are split into their parts.

---

> ### .repeat(count)

The `.repeat(count)` method takes an integer and returns a new string 
consisting of the original string repeated `count` times. No separators 
are inserted between repetitions. If `count` is zero or negative, the 
result is an empty string.

```dpn
tag stars = "*".repeat(5)          # "*****"
tag line = "ab".repeat(3)          # "ababab"
tag none = "x".repeat(0)           # ""
```

This method is useful for constructing visual separators, padding, or 
any repeated pattern without writing a loop.

---

> ### .alter(target, replacement)

The `.alter(target, replacement)` method returns a new string in which 
every occurrence of the substring `target` has been replaced with the 
substring `replacement`. If `target` does not appear in the original 
string, the original is returned unchanged. If `target` is empty, the 
original string is returned as-is, since replacing every occurrence of 
an empty substring would produce an unreasonable result.

```dpn
tag text = "Hello World".alter("World", "Dorpn")
# text is "Hello Dorpn"

tag path = "a/b/c".alter("/", "-")
# path is "a-b-c"
```

Note that `.alter` replaces all occurrences, not just the first one.

---
> ### .flip()

The `.flip()` method returns a new string with the order of its 
characters reversed. The first character becomes the last, the second 
becomes the second-to-last, and so on. An empty string returns an 
empty string.

```dpn
tag rev = "hello".flip()           # "olleh"
tag back = "Dorpn".flip()          # "nproD"
```

`.flip()` reverses the string by Unicode character, so multi-byte text
such as Hindi or emoji is no longer corrupted. Like `.at()`, it works
on single code points, not full grapheme clusters, so combined emoji
and conjuncts are still split into parts.

This is often useful in algorithms that work with palindromes, 
reversed strings, or certain kinds of parsing.

---
> ### .tidy()

The `.tidy()` method returns a new string with leading and trailing 
whitespace removed. Whitespace here includes spaces, tabs, newlines, 
and other standard whitespace characters. Internal whitespace is left 
untouched.

```dpn
tag clean = "  hello  ".tidy()     # "hello"
tag lines = "\n text \n".tidy()    # "text"
```

This is commonly used to clean up user input, since `ask()` does not 
strip whitespace automatically.

---
> ### .size()

The `.size()` method returns an `Int` representing the number of
Unicode characters in the string. For an empty string, it returns `0`.
This is the default behavior since v0.4.4.

```dpn
tag length = "Dorpn".size()        # 5
tag empty = "".size()              # 0

tag hindi = "नमस्ते"
print(hindi.size())                # 6
print("👋".size())            # 1
```

For ASCII-only strings nothing changes. If your code relied on
`.size()` returning the number of bytes, use `.size("byte")` instead.

`.size()` can also be called with a unit argument, in which case it
returns the size converted to that unit. This is useful when working
with strings that represent file contents or data, where sizes are
conventionally expressed in bytes, kilobytes, or megabytes.

```dpn
tag bytes = "hello world".size("byte")    # 11
tag bits = "ab".size("bit")               # 16
```

The units `"char"` and `"chars"` give the Unicode character count,
which is the default. The units `"byte"` and `"bytes"` give the raw
UTF-8 byte count, useful for file and network sizes. `"bit"` and
`"bits"` give the byte count multiplied by 8. The other supported
units are `"b"`, `"kb"`, `"kib"`, `"mb"`, `"mib"`, `"gb"`, `"gib"`,
`"tb"`, and `"tib"`.

The `"char"`, `"byte"` and `"bit"` units return an `Int` on both
backends. Unknown units fall back to bytes and print a warning to
stderr, so typos don't silently give wrong values.

---

## Type Conversion Methods

Dorpn does not implicitly convert between types. If a value of one 
type is needed where another is expected, you must say so explicitly 
using one of the conversion methods. These methods are also called 
with dot-notation.

| Method | Accepts | Returns |
|--------|---------|---------|
| `.asInt()` | Int32, Float, Float32, String | Int |
| `.asInt32()` | Int | Int32 |
| `.asFloat()` | Int, Int32, Float32, String | Float |
| `.asFloat32()` | Float | Float32 |
| `.asString()` | Any type | String |

### `.asInt()` and `.asFloat()`

These methods convert a value to an `Int` or `Float` respectively. 
They accept numeric types and strings that represent valid numbers. If 
the string is not a valid number, a runtime panic occurs.

```dpn
tag num_str = "100"
tag num = num_str.asInt()          # 100

tag pi_str = "3.14"
tag pi = pi_str.asFloat()          # 3.14

tag n = 42
tag f = n.asFloat()                # 42.0
```

The strict behavior on invalid input is intentional. Silently 
returning zero for a string like `"abc"` would hide the problem until 
much later, making debugging difficult. A panic at the point of 
conversion makes the failure obvious.

---
### `.asInt32()` and `.asFloat32()`

These methods narrow a value to a smaller type. If the value does not 
fit in the target type, a runtime panic occurs. This is different from 
the silent truncation that occurs in many other languages.

```dpn
tag n = 100
tag narrow = n.asInt32()           # 100 as Int32

tag big = 5000000000
tag overflow = big.asInt32()       # runtime panic: out of range
```

---
### `.asString()`

The `.asString()` method converts any value to its string 
representation. This never fails.

```dpn
tag n = 42
tag s = n.asString()               # "42"

tag f = 3.14
tag fs = f.asString()              # "3.14"

tag b = true
tag bs = b.asString()              # "true"
```

---

## Chaining Methods

Because each method returns a new value, methods can be chained 
together. The result of one method becomes the input to the next.

```dpn
tag result = "  hello world  ".tidy().flip()
# result is "dlrow olleh"
```

In this example, `.tidy()` first removes the surrounding whitespace, 
producing `"hello world"`. Then `.flip()` reverses it, producing 
`"dlrow olleh"`.

Chaining works because each method returns a `String`, and `String` 
values support the same methods. Conversion methods break the chain 
when they change the type, since the resulting `Int` or `Float` does 
not have string methods.

A method call can also follow a parenthesized expression. The method
then operates on the result of the expression in parentheses:

```dpn
tag code = toCode("h")
tag upper = toChar((code - 32))     # "H"
print((code + 1).asString())        # "105"
```

This works on both backends.

