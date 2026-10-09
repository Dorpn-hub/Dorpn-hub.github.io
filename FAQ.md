# Frequently Asked Questions

---

## Q: What platforms are supported by Dorpn?
**A:** Dorpn compiler binaries are available natively for Windows. Mobile editing is supported via a separate custom Android code editor app available in its dedicated repository.

---

## Q: Why is the Dorpn compiler source code closed?
**A:** The compiler source code remains closed-source until version 1.0 or until the language becomes self-hosted to ensure stability and unified documentation during early development.

---

## Q: How do I update my Dorpn installation on Windows?
**A:** Simply download the newest release binary from the official GitHub Releases page and replace your existing `dorpn` executable file.

---

## Q: What toolchain dependencies are needed before compiling?
**A:** Depending on your targeted compilation backend, your system must have:
* **C Backend**: A C compiler installed and added to your system `PATH` (`clang`, `gcc` or `cc`; auto-detected in that order, or set the `DORPN_CC` environment variable to choose one).
* **JavaScript Backend**: Node.js and npm installed to execute transpiled scripts.

```bash
# Verify C compiler installation
gcc --version

# Verify JavaScript runtime installation
node -v
```

---

## Q: How do I compile and run a Dorpn program?
**A:** Pass your `.dpn` file to the executable. Use `--run` to compile and execute immediately. 

```bash
# Compile and run
dorpn hello.dpn --run
```

---

## Q: What happens to intermediate C and JS files generated during build?
**A:** Intermediate C files are automatically deleted after compilation unless you pass the `--keep-c` flag. Intermediate JS files are always retained and must be manually removed.

```bash
# Preserve intermediate generated C code
dorpn program.dpn --keep-c
```

---

## Q: What are the differences between `tag`, `imm`, and `Const`?
**A:** `tag` declares mutable variables, `imm` creates runtime-initialized immutable variables, and `Const` defines strict compile-time constants.

```dpn
tag counter = 0
counter = counter + 1

imm username = ask("Enter name: ")
# username = "New_Name"  --> Compile-time error!

Const MAX_LIMIT = 100
```
For complete scoping details, see [Variables](Variables.md).

---

## Q: How do I handle program termination and runtime errors?
**A:** Use `panic("message")` to abort with an error, `finish()` to exit successfully with code 0, or `error_out(code)` to exit with a non-zero code.

```dpn
if age < 0:
    panic("Age cannot be negative")

if completed:
    finish()
```

---

## Q: How do I convert data between different types?
**A:** Dorpn does not support implicit type coercion. Use explicit conversion methods like `.asInt()`, `.asFloat()`, `.asString()`, `.asInt32()`, or `.asFloat32()`.

```dpn
tag input = "100"
tag count = input.asInt()
tag f_val = count.asFloat()
```
For details, see [Types](Types.md) and [Built-in Methods](Built-in-Methods.md).

---

## Q: What causes a C compiler error or `"node: command not found"`?
**A:** This means the C backend compiler or the Node.js runtime required for your targeted backend is not installed or not added to your system `PATH`. The C compiler is auto-detected (`clang` first, then `gcc`, then `cc`), or you can choose one with the `DORPN_CC` environment variable. Installing the missing dependency resolves the issue.

---

- If you encounter any issues, bugs, or questions that aren't covered in this FAQ, feel free to join our official [Discord server](https://discord.gg/9J2qabs3gu).You can share your queries, get help from our growing community, and stay updated on the latest development progress directly. 