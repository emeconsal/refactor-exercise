import { describe, expect, test } from "vitest";
import { invoices, plays, statement } from "./index";

describe("statement function", () => {
  test("calculates the correct statement for the sample invoice", () => {
    const expected =
      "Statement for BigCo\n" +
      " Hamlet: $650.00 (55 seats)\n" +
      " As You Like It: $580.00 (35 seats)\n" +
      " Othello: $500.00 (40 seats)\n" +
      "Amount owed is $1,730.00\n" +
      "You earned 47 credits\n";

    expect(statement(invoices[0], plays)).toBe(expected);
  });
});
