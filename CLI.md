# Command Line Usage

The Dorpn compiler is a command line program named `dorpn`. You give 
it a `.dpn` source file, and it turns that file into something your 
computer can run. This page describes how to call the compiler, what 
each option does, and what files it produces.

By default Dorpn compiles to a native executable. It does this in 
steps: first it reads and checks your program, then it translates it 
to C code, and finally it hands that C code to a C compiler together 
with the Dorpn runtime library. The C compiler is detected 
automatically: `clang` first, then `gcc`, then `cc`. Set the 
`DORPN_CC` environment variable to choose one yourself. The result is a program that 
runs directly, with no interpreter involved. Dorpn can also translate 
your program to JavaScript instead, which is described further down.

---

## Basic Usage

```text
dorpn <file.dpn> [options]
```

Since v0.4.4, options can also be placed before the file name. They 
can be combined in any order.

```text
dorpn hello.dpn                # compile only
dorpn hello.dpn --run          # compile and run immediately
dorpn hello.dpn -r -t          # compile, run, and show compile time
```

When you compile without `--run`, Dorpn prints where the executable 
was written and how to start it:

```text
✓ Generated C code: hello.c
✓ Compiled: hello
Run with: ./hello
Or: dorpn hello.dpn --run
```

Calling `dorpn` with no arguments prints the help text.

---

## Options

| Short | Long | Description |
|-------|------|-------------|
| `-r` | `--run` | Compile and run immediately |
| `-k` | `--keep-c` | Keep the generated C file |
| `-V` | `--verbose` | Show detailed compilation steps |
| `-v` | `--version` | Show version information |
| `-h` | `--help` | Show the help message |
| `-t` | `--time` | Show how long compilation took |
| | `--out <path>` | Choose the output file |
| `-js` | `--Javs` | Compile to JavaScript instead of C |
| | `--upgrade` | Upgrade Dorpn to the latest version |

If you pass an option that Dorpn does not know, it prints 
`Unknown option` together with a hint to use `--help`, and exits with 
code 1.

---

## Running a Program

The `--run` option compiles the program and starts it straight away. 
A separator line is printed first so you can tell compiler messages 
apart from your program's own output.

```text
$ dorpn hello.dpn --run
────────────────────────────────────────
Hello, Dorpn!
```

If your program ends with a non-zero exit code, for example through 
`error_out(2)` or `panic()`, Dorpn reports it after the program 
finishes:

```text
Program exited with code 2
```

The `dorpn` process itself exits with the code your program returned, 
so `--run` can be used directly in scripts and pipelines.

---

## Keeping the C File

Normally the generated C file is deleted once the executable has been 
built. Pass `--keep-c` if you want to keep it, which is useful for 
inspecting exactly what Dorpn generated for your code.

```text
dorpn hello.dpn -k
```

The C file is written next to your source file, with the same name and 
a `.c` extension. The `--verbose` option also keeps the C file. An 
existing `.c` file that you wrote yourself is never overwritten.

---

## Choosing the Output Path

By default the executable is created next to the source file, with the 
same name and no extension. `hello.dpn` produces `hello`. Use `--out` 
to pick a different path:

```text
dorpn hello.dpn --out build/hello
```

`--out` applies to the native executable. It does not change where 
JavaScript output is written.

---

## Compiling to JavaScript

With `-js`, Dorpn translates your program to JavaScript instead of C. 
The `.js` file is written next to the source file, and no C compiler 
is needed.

```text
dorpn hello.dpn -js            # writes hello.js
dorpn hello.dpn -js -r         # writes hello.js and runs it with node
```

Without `--run`, Dorpn tells you the command to start the program:

```text
✓ Generated Js code: hello.js
Run with: node hello.js
```

Running the result requires [Node.js](https://nodejs.org) to be 
installed. Some built-in features rely on a small runtime file, 
`dorpn_runtime.js`, and the generated file loads it from the path it 
was given at compile time.

---

## Verbose Output

`--verbose` prints every stage of compilation: lexing, parsing, 
semantic analysis, C generation and the exact command used to call 
`clang`. It also shows the first tokens found in your file. This is 
mainly useful when you are debugging the compiler itself or a build 
that behaves unexpectedly.

```text
dorpn hello.dpn -V
```

---

## Timing

`--time` adds a final line that reports how long the whole compilation 
took:

```text
⏱ Compilation finished in 0.179 seconds.
```

---

## Version and Help

```text
dorpn --version                # Dorpn Compiler v0.4.4
dorpn --help                   # list of all options
```

`--version` and `--help` can be used without a source file.

---

## Upgrading

```text
dorpn --upgrade
```

This checks the latest release on GitHub and compares it to the 
version you have installed. On Windows, if a newer version exists, it 
downloads the installer and runs it silently. On other systems it only 
prints the link to the release page, so you can download the update by 
hand. If you are already on the 
newest version, it says so and exits. If the network is not reachable, 
it prints an error and the address of the releases page so you can 
download the update by hand.

---

## Requirements

| Target | What must be available |
|--------|------------------------|
| Native (default) | A C compiler (`clang`, `gcc` or `cc`, auto-detected in that order; override with `DORPN_CC`), and the Dorpn runtime files `dorpn_runtime.c` and `dorpn_runtime.h` |
| JavaScript (`-js`) | Node.js, only if you use `--run` |

Dorpn looks for the runtime files in this order and uses the first 
place where it finds both:

1. The folder named by the `DORPN_RUNTIME_DIR` environment variable
2. A `runtime_lib` folder in the current directory
3. A `src` folder in the current directory
4. The current directory itself
5. The folder where the `dorpn` binary itself is located

If none of them contains the runtime, the compiler stops with 
`Error: Dorpn runtime files not found!`.

If `DORPN_RUNTIME_DIR` is set, which is the case on Android, the 
executable is written to `/tmp` instead of next to the source file. 
Storage folders on Android are mounted in a way that does not allow 
programs to run from them, so a `/tmp` location is used to make the 
result runnable.

---

## Exit Codes

The compiler itself exits with code `0` on success and `1` on any 
failure, including a missing file, an unknown option, a syntax or 
semantic error, or a failed C build.

```text
$ dorpn missing.dpn
Error: File 'missing.dpn' not found
```

Errors in your own program are explained on the [Errors](/Errors) page.
