### Assignment Questions Answers

1. **What is the difference between var, let, and const?**  
   - `var`: Function scoped, can be re-declared and updated, hoisted with undefined value.  
   - `let`: Block scoped, can be updated but not re-declared in the same scope, not hoisted.  
   - `const`: Block scoped, cannot be updated or re-declared, must be initialized at declaration.

2. **What is the spread operator (...)?**  
   The spread operator (...) expands arrays or objects into individual elements. It is used for copying, merging arrays/objects, or passing arguments to functions.  
   Example: `const newArr = [...oldArr, 4, 5];`

3. **What is the difference between map(), filter(), and forEach()?**  
   - `map()`: Creates a new array by transforming each element.  
   - `filter()`: Creates a new array with elements that pass a condition.  
   - `forEach()`: Runs a function on each element but returns nothing (undefined).

4. **What is an arrow function?**  
   Arrow function is a shorter way to write functions: `() => {}`. It does not have its own `this`, no `arguments` object, and cannot be used as a constructor.  
   Example: `const add = (a, b) => a + b;`

5. **What are template literals?**  
   Template literals are strings written with backticks (``) that allow multi-line text and variable embedding using ${expression}.  
   Example: `Hello ${name}! Your age is ${age}.`