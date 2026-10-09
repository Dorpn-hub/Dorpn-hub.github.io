# Functions in Dorpn

A function is a named block of code that you can run whenever you need 
it. Instead of writing the same steps in several places, you write 
them once inside a function and call it by name. Functions can receive 
values to work with, called parameters, and they can hand a result 
back to the code that called them.

Dorpn functions are statically typed, like variables. Every parameter 
declares the type of value it accepts, and the function declares the 
type of value it gives back. This keeps the contract between a 
function and its callers clear to anyone reading the code.

This page is about functions that you write yourself. For the 
functions that come with the language, such as `print()` and `ask()`, 
see [Built-in Functions](/Built-in-Functions).

---

## Defining a Function

A function is defined with the `func` keyword, followed by its name, 
its parameters in parentheses, an arrow and a return type, and a 
colon. The body is an indented block.

```dpn
func square(n: Int) -> Int:
    return n * n
```

The pieces of the first line are:

| Part | Meaning |
|------|---------|
| `func` | Starts a function definition |
| `square` | The name of the function |
| `(n: Int)` | The parameter list. Here one parameter named `n` of type `Int` |
| `-> Int` | The type of the value the function gives back |
| `:` | Opens the body, which must be indented |

A function with several parameters separates them with commas, and a 
function with none uses empty parentheses:

```dpn
func add3(a: Int, b: Int, c: Int) -> Int:
    return a + b + c

func banner() -> Unit:
    print("==========")
```

---

## Calling a Function

To run a function, write its name followed by the arguments in 
parentheses. If the function returns a value, the call can be used 
anywhere a value is expected: in a variable declaration, inside an 
expression, or as an argument to another call.

```dpn
tag r = square(7)
print(r)                       # 49
print(square(square(2)) + 1)   # 17
```

A function can be called before the place where it is defined in the 
file, so you can put your main logic first and your helper functions 
below it.

A user-defined function cannot reuse the name of a builtin function 
(`print`, `max`, `add`, ...). Rename your function if it clashes with 
a builtin.

---

## Parameters

Each parameter is written as `name: Type`. Inside the function, the 
parameter behaves like a variable that already holds the value the 
caller passed in.

```dpn
func greet(name: String) -> Unit:
    print("Hello,", name)

greet("Dorpn")                 # Hello, Dorpn
```

The type in the definition is not decoration. It tells Dorpn how to 
treat the value inside the function. That is why every parameter 
should always have a type. A parameter written without one is 
treated as a `String`, so passing a number to it leads to wrong 
behavior or a crash at runtime:

```dpn
func twice(x):                 # x silently becomes a String
    print(x)

twice(5)                       # crashes: 5 is not a String
```

Always write the type, as in `func twice(x: Int)`.

The available types are `Int`, `Float`, `String`, `Bool`, `Int32` and 
`Float32`. See the [Types](/Types) page.

---

## Return Values

The `return` statement ends the function and gives a value back to 
the caller. The value must match the type written after the arrow.

```dpn
func label(n: Int) -> String:
    if n > 0:
        return "positive"
    return "non-positive"

print(label(3))                # positive
print(label(0))                # non-positive
```

A function can contain several `return` statements. The first one that 
runs ends the function, and the rest of the body is skipped. This 
makes early returns a clean way to handle special cases first.

### Functions that return nothing

Some functions exist only for what they do, such as printing a message 
or updating a variable. Give these the return type `Unit`. A bare 
`return` with no value can be used to leave such a function early:

```dpn
func report(n: Int) -> Unit:
    if n > 100:
        return
    print("small enough:", n)

report(500)                    # prints nothing
report(5)                      # small enough: 5
```

If you leave out the arrow and return type completely, the function is 
treated as void: it returns no value. Calling such a function where a 
value is expected is an error. It is still good style to write 
`-> Unit` explicitly for functions that return nothing.

---

## Recursion

A function can call itself. This is called recursion, and it is a 
natural fit for problems that can be described in terms of a smaller 
version of themselves. A recursive function needs a base case that 
stops the calls, otherwise it would never finish.

```dpn
func factorial(n: Int) -> Int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))            # 120
```

Here `n <= 1` is the base case. For any larger `n`, the function 
multiplies `n` by the factorial of `n - 1`.

---

## The `_Start` Function

A function named `_Start` is special. If your file defines one, Dorpn 
runs it automatically after every top-level statement in the file has 
finished. You do not call it yourself.

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

Using `_Start` for the main logic of a program is a good habit. The top 
of the file then holds constants and helper functions, and `_Start` 
reads like the table of contents of what the program does.

---

## Scope

Variables created inside a function, including its parameters, exist 
only while that function runs and can be used only inside it. Code 
outside the function cannot see them.

A function can read and change variables that were declared at the top 
level of the file, as long as those variables are declared **above** 
the function:

```dpn
tag total = 0

func bump() -> Unit:
    total += 1

bump()
bump()
print(total)                   # 2
```

Two rules follow from how Dorpn resolves names:

- A variable declared below a function cannot be used inside that 
function. The function is checked at the position where it is written, 
so the variable does not exist yet.
- A local variable cannot reuse the name of a top-level variable that 
is already declared. Inside `bump`, writing `tag total = 5` would be 
a `SemanticError`, because `total` already exists.

Constants declared with `Const` at the top level can be used inside 
functions in the same way:

```dpn
Const LIMIT :Int = 10

func over(n: Int) -> Bool:
    return n > LIMIT

print(over(11))                # true
```

---

## Common Mistakes

### 1. Leaving out parameter types

An untyped parameter is treated as a `String`. Always write 
`name: Type` for every parameter.

### 2. Forgetting `-> Unit`

If a function does not return a value, mark it with `-> Unit`. 
Without an arrow, Dorpn assumes an `Int` result that the function 
never actually provides.

### 3. Passing the wrong number of arguments

Dorpn itself checks the number and types of arguments, for both 
builtin and user-defined functions:

```dpn
func add2(a: Int, b: Int) -> Int:
    return a + b

print(add2(1))                 # SemanticError: wrong argument count
```

### 4. Calling a function that does not exist

A call to a name that was never defined is reported by Dorpn itself as 
a semantic error. Check the spelling of the function name.

### 5. Using a local variable outside its function

Variables created inside a function are gone when the function ends. 
Return the value instead, and store the result in the caller.

```dpn
func compute() -> Int:
    tag result = 42
    return result

tag answer = compute()         # correct
print(answer)
```

### 6. Using a top-level variable declared below the function

Move the declaration above the function that uses it.
