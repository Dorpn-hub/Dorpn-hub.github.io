# Control Flow in Dorpn

By default a program runs one statement after another, from the top of 
the file to the bottom. Control flow is what lets a program break out 
of that straight line: to make decisions, to repeat work, and to stop 
repeating when the work is done.

Dorpn keeps this small. Decisions are made with `if`, `elif` and 
`else`. Repetition is done with two loops, `loop` for a known number of 
repetitions and `keep` for repeating while a condition holds. Two 
keywords, `halt` and `skip`, give you fine control inside any loop.

---

## Quick Reference

| Keyword | What it does |
|---------|--------------|
| `if` / `elif` / `else` | Run a block only when a condition is true |
| `loop n:` | Repeat a block `n` times |
| `loop i in n:` | Repeat `n` times, with a counter `i` from `0` to `n - 1` |
| `keep condition:` | Repeat a block as long as the condition is true |
| `halt` | Leave the current loop immediately |
| `skip` | Jump to the next repetition of the current loop |

---

## `if`, `elif` and `else`

An `if` statement runs its block only when the condition is `true`. 
Add one or more `elif` branches to test further conditions, and an 
`else` branch to handle everything that did not match. Dorpn checks 
the branches from top to bottom and runs only the first one that 
matches.

```dpn
tag score = 75

if score >= 90:
    print("A")
elif score >= 70:
    print("B")
else:
    print("C")
```

```text
B
```

The condition must be a `Bool`. Comparisons such as `==`, `!=`, `<`, 
`>`, `<=` and `>=` all produce a `Bool`, and so does any variable 
declared with a `Bool` value. Strings are compared by their content, 
so `name == "Dorpn"` is true whenever the text is the same.

If a branch has just one statement, it can be written on the same line 
as the condition:

```dpn
if score > 100: print("impossible")
elif score > 50: print("passed")
else: print("failed")
```

### Combining conditions

Use `and`, `or` and `not` to build larger conditions out of smaller 
ones.

```dpn
tag age = 25
tag member = true

if age >= 18 and member:
    print("access granted")

if age < 13 or age > 65:
    print("discount applies")
```

One detail deserves attention. `not` applies only to the value that 
comes right after it, not to a whole comparison. When you want to 
negate a comparison, wrap it in parentheses:

```dpn
tag a = 5

if a > 1 and not (a > 10):     # correct
    print("between 2 and 10")

if a > 1 and not a > 10:       # wrong: this is (not a) > 10
    print("this never prints")
```

---

## `loop` - Repeating a Fixed Number of Times

The `loop` statement repeats its block a set number of times. Write 
the number after the keyword:

```dpn
loop 3:
    printOut("w")
print("")
```

```text
www
```

When you also need to know which repetition you are on, give the loop 
a counter name with `in`:

```dpn
loop n in 4:
    print(n)
```

```text
0
1
2
3
```

The counter is created by the loop itself, so it does not need a `tag`. 
It always starts at `0`, goes up by one on every pass, and stops 
before it reaches the number you gave. A loop of 4 therefore counts 
`0, 1, 2, 3`.

The count can be any expression that gives a whole number, such as 
`height + 1`. If you want the counter to start at 1, add one inside 
the loop:

```dpn
loop n in 5:
    tag number = n + 1
    print(number)              # 1, 2, 3, 4, 5
```

The counter belongs to the loop and disappears when the loop ends. 
Two separate loops can reuse the same counter name without conflict, 
and loops can be nested:

```dpn
loop row in 2:
    loop col in 2:
        print(row, col)
```

```text
0 0
0 1
1 0
1 1
```

The count is evaluated once, before the loop starts. If the body 
changes the variable the count came from, the number of repetitions 
does not change with it.

---

## `keep` - Repeating While a Condition Holds

Use `keep` when you do not know in advance how many repetitions you 
need. The condition must be a `Bool`. The block runs again and again 
for as long as the condition is `true`, and the condition is checked 
before each pass.

```dpn
tag count = 0

keep count < 3:
    print("count is", count)
    count += 1
```

```text
count is 0
count is 1
count is 2
```

Something inside the block must eventually make the condition false. 
In the example, `count += 1` does that. If nothing changes the 
condition, the loop never ends.

A common pattern is to write `keep true:` and leave the loop from the 
inside with `halt`, as described next.

---

## `halt` and `skip`

Both keywords work inside `loop` and `keep`, and both affect the 
innermost loop that contains them.

`halt` ends the loop immediately. The program continues with the first 
statement after the loop. `skip` abandons the current repetition and 
moves on to the next one.

```dpn
tag i = 0

keep i < 5:
    i += 1
    if i == 2:
        skip
    if i == 4: halt
    print("i =", i)

print("done", i)
```

```text
i = 1
i = 3
done 4
```

Trace through it: when `i` is 2, `skip` jumps straight to the next 
repetition, so `2` is never printed. When `i` reaches 4, `halt` ends 
the loop, so the last value printed is 3 and the final line shows 4.

Here is the `keep true:` pattern in a realistic setting, a loop that 
runs until the user gives a valid answer:

```dpn
keep true:
    imm answer = ask("Type yes to continue: ")
    if answer.tidy() == "yes":
        halt
    print("Please type yes")
```

---

## Variables Inside Blocks

A variable declared inside an `if`, `loop` or `keep` block can only be 
used inside that block. There is also a rule that surprises many 
people: a name can be declared only once, even across separate blocks. 
Two sibling branches cannot both declare the same name:

```dpn
tag n = 3

if n > 1:
    tag msg = "big"
else:
    tag msg = "small"          # SemanticError: Redefinition of variable 'msg'
```

The same applies to two loops that each declare a variable of the same 
name in their bodies. The fix is to declare the variable once, before 
the blocks, and assign to it inside them:

```dpn
tag n = 3
tag msg = ""

if n > 1:
    msg = "big"
else:
    msg = "small"

print(msg)                     # big
```

This also gives you a variable that is still available after the 
blocks are finished.

---

## Common Mistakes

### 1. Using a non-Bool as a condition

Some languages treat any number as true or false. Dorpn does not. The 
condition must be a `Bool`, and anything else is a `SemanticError`:

```dpn
tag count = 3

if count:                      # SemanticError: Must be a Boolean expression
    print("has items")

if count > 0:                  # correct
    print("has items")
```

### 2. Forgetting the colon

`if`, `elif`, `else`, `loop` and `keep` must all end with a colon. 
Leaving it out is a `SyntaxError`.

### 3. Writing `not a > b`

As explained above, `not` only applies to the next value. Use 
`not (a > b)`, or better, flip the comparison and write `a <= b`.

### 4. Creating an endless `keep`

If the condition never becomes false and there is no `halt`, the 
program runs forever. Check that something inside the loop changes the 
values used by the condition.

### 5. Using `halt` or `skip` outside a loop

These keywords only make sense inside `loop` and `keep`. Since 
v0.4.4, using them anywhere else is reported by Dorpn itself as a 
compile-time error, before the build runs.

### 6. Declaring the same variable in several blocks

Declare it once above the blocks and assign to it inside, as shown in 
the section on variables inside blocks.
