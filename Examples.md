# Examples

Reading about a language only goes so far. The quickest way to become 
comfortable with Dorpn is to read complete programs, run them, and 
then change them. This page walks through six small programs, ordered 
from the simplest to the most involved.

Every example is complete. You can copy any of them into a file with 
the `.dpn` extension and run it directly:

```text
dorpn example.dpn --run
```

For interactive programs, the text you type is shown after the prompt.

---

## Hello, User

The classic first program, with a small addition. It asks for your 
name and greets you by it.

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

`GREETING` is known before the program runs, so it is a `Const`. The 
name arrives at runtime, so it is an `imm`. Both are single-assignment.

`ask()` returns a `String`, and `.tidy()` removes stray spaces around 
it. Methods return new strings; the original is never modified.

The `+` operator joins strings, converting the other side 
automatically when needed. The main logic lives in `_Start`, which 
Dorpn calls automatically.

---

## FizzBuzz

Count from 1 to 15, but print `Fizz` for multiples of 3, `Buzz` for 
multiples of 5, and `FizzBuzz` for multiples of both.

```dpn
loop n in 15:
    tag num = n + 1
    if num % 15 == 0:
        print("FizzBuzz")
    elif num % 3 == 0:
        print("Fizz")
    elif num % 5 == 0:
        print("Buzz")
    else:
        print(num)
```

```text
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
```

`loop n in 15` counts from `0` to `14`, so `n + 1` gives the numbers 
1 through 15.

`%` returns the remainder of a division. A number is a multiple of 
another when the remainder is `0`.

The order of branches matters. Since 15 is a multiple of both 3 and 5, 
the most specific condition is checked first. Once a branch runs, the 
rest are skipped.

---

## Temperature Converter

Read a number from the user, convert it with a function, and print the 
result.

```dpn
func toFahrenheit(c: Float) -> Float:
    return c * 9 / 5 + 32

func _Start() -> Unit:
    imm input = ask("Temperature in Celsius: ")
    tag c = input.asFloat()
    print(c, "C =", toFahrenheit(c), "F")
```

```text
Temperature in Celsius: 36.6
36.600000 C = 97.880000 F
```

`ask()` returns text, not a number, so `.asFloat()` converts it before 
arithmetic. Dorpn never converts types automatically.

The function takes a `Float` and returns a `Float`. The call 
`toFahrenheit(c)` produces a value usable inside `print`, just like 
any other expression.

Floats print with six digits after the decimal point by default.

---

## Palindrome Checker

A palindrome reads the same forwards and backwards. Dorpn's `.flip()` 
method makes this check short.

```dpn
func isPalindrome(word: String) -> Bool:
    return word == word.flip()

func _Start() -> Unit:
    imm text = ask("Enter a word: ")
    imm clean = text.tidy()
    if isPalindrome(clean):
        print(clean, "is a palindrome")
    else:
        print(clean, "is not a palindrome")
```

```text
Enter a word: level
level is a palindrome
```

```text
Enter a word: dorpn
dorpn is not a palindrome
```

A function returning `Bool` can be used directly as an `if` condition.

`==` compares strings by content, not by internal representation.

`word.flip()` returns a new string. The original is never modified.

---

## Number Guessing Game

Repeat until the player guesses the secret number. Count the attempts 
and give a hint after every wrong answer.

```dpn
Const SECRET :Int = 7

func _Start() -> Unit:
    tag tries = 0
    keep true:
        imm answer = ask("Guess the number: ")
        tries += 1
        tag guess = answer.asInt()
        if guess == SECRET:
            print("Correct! Tries:", tries)
            halt
        elif guess < SECRET:
            print("Too low")
        else:
            print("Too high")
```

```text
Guess the number: 3
Too low
Guess the number: 9
Too high
Guess the number: 7
Correct! Tries: 3
```

`keep true` creates a loop that never ends on its own. `halt` is what 
stops it once the guess is right.

`SECRET` never changes, so it is a `Const`. `tries` changes on every 
guess, so it is a `tag`.

If the player types something that is not a number, `.asInt()` stops 
the program with a runtime panic.

---

## A Progress Bar

Draw a bar that fills from 0 to 100 percent on a single line, with 
colored terminal output.

```dpn
Const GREEN :String = "\033[92m"
Const RESET :String = "\033[0m"
Const FILLED :String = "#"
Const EMPTY :String = "="
Const WIDTH :Int = 50

func delay(t: Int) -> Unit:
    tag k = 0
    keep k < t * 3000000:
        k += 1

func bar(step: Int, total: Int) -> Unit:
    tag pct = (step * 100) fld total
    tag fillCount = pct fld 2
    tag emptyCount = WIDTH - fillCount
    tag filled = FILLED.repeat(fillCount)
    tag empty = EMPTY.repeat(emptyCount)
    printOut("\r" + GREEN + "[" + filled + empty + "] " + pct + "%" + RESET)

func _Start() -> Unit:
    loop step in 101:
        bar(step, 100)
        delay(1)
    print("")
    print("Done")
```

When the program finishes, the last line on the screen is:

```text
[##################################################] 100%
Done
```

`\033[92m` and `\033[0m` are terminal color codes. Text between them 
prints in green.

`printOut` does not add a newline. `"\r"` returns the cursor to the 
start of the line. Together, they let each call overwrite the previous 
one, so the bar appears to grow in place.

`fld` is floor division. Unlike `/`, which always returns a `Float`, 
`fld` on two whole numbers returns a whole number, which is what 
`.repeat()` needs.

`delay` is a busy loop that slows the bar down so you can watch it.

---

## Where to Go Next

The best way to learn a language is to change working code. Try 
modifying these programs in small ways. Give the guessing game a 
limited number of tries. Make FizzBuzz accept a number from `ask()`. 
Try converting the progress bar into a countdown.

Each change will teach you something about the language. When 
something breaks, the error message will point you to the problem. 
Reading those messages carefully is a skill in itself.