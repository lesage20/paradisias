// import { mount } from "@vue/test-utils";
// import { test, expect } from "vitest";

// const user = { name: "ange", age: 24 };
// test("testing object", () => {
//   expect(user.name).toBe("ange");
//   expect(user.age).toBe(24);
// });

const arr = [1, 2, 3, 4];

function sumArray(arr) {
  return arr.reduce((sum, curr) => sum + curr, 0);
}

console.log(sumArray(arr)); // 10
console.log(arr); // [ 1, 2, 3, 4 ]
