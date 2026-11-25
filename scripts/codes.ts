/**
 * Access-code tool. Run by an adult. There is no admin page on purpose.
 *
 *   node scripts/codes.ts create 4        make four new codes
 *   node scripts/codes.ts off PL-....     switch one code off
 *   node scripts/codes.ts on PL-....      switch it back on
 *   node scripts/codes.ts check PL-....   show its count (never the code itself)
 *
 * New codes are printed ONCE. Only their hashes are saved, so a lost code
 * cannot be recovered: switch it off and make a new one.
 *
 * On a developer's computer this writes to .data/ledger.json. The live store
 * is added in Week 3.
 */

import { codeSecret, generateCode, hashCode, normalizeCode } from "../lib/server/codes.ts";
import { DEFAULT_ALLOWANCE, getLedger } from "../lib/server/ledger.ts";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

const [command, arg] = process.argv.slice(2);
const secret = codeSecret();
const ledger = getLedger();

function hashOf(input: string | undefined): string {
  const normalized = normalizeCode(input);
  if (!normalized) fail("That does not look like a PineLaunch code. It should look like PL-XXXX-XXXX-XXXX-XXXX.");
  return hashCode(normalized, secret);
}

switch (command) {
  case "create": {
    const count = arg === undefined ? 1 : Number(arg);
    if (!Number.isInteger(count) || count < 1 || count > 50) fail("Give a number of codes from 1 to 50, for example: create 4");
    console.log(`\nNew access codes (${DEFAULT_ALLOWANCE} AI requests each). They are shown only now.\n`);
    for (let i = 0; i < count; i++) {
      const code = generateCode();
      const made = await ledger.create(hashCode(normalizeCode(code)!, secret), DEFAULT_ALLOWANCE);
      if (!made) fail("A code collided with an existing one. Run the command again.");
      console.log("  " + code);
    }
    console.log("\nGive one code to each family. Do not write names next to codes in any shared place.\n");
    break;
  }
  case "off":
  case "on": {
    const done = await ledger.setActive(hashOf(arg), command === "on");
    if (!done) fail("No such code in the ledger.");
    console.log(`That code is now switched ${command}.`);
    break;
  }
  case "check": {
    const entry = await ledger.get(hashOf(arg));
    if (!entry) fail("No such code in the ledger.");
    console.log(`Used ${entry.used} of ${entry.allowance}. Switched ${entry.active ? "on" : "off"}.`);
    break;
  }
  default:
    fail("Use: create [how many] | off <code> | on <code> | check <code>");
}
