import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const types = readFileSync(new URL("../src/types.ts", import.meta.url), "utf8");
const contract = readFileSync(new URL("../src/contract.ts", import.meta.url), "utf8");
const client = readFileSync(new URL("../src/client.ts", import.meta.url), "utf8");

for (const status of ["submitted", "simulated", "requires_approval", "approved", "broadcast", "settled", "failed"]) {
  assert.match(types, new RegExp(`\"${status}\"`));
  assert.match(contract, new RegExp(`\"${status}\"`));
}

for (const event of ["wallet.created", "transaction.simulated", "reconciliation.report_updated", "audit.event_recorded"]) {
  assert.match(types, new RegExp(`\"${event.replace(".", "\\.")}\"`));
  assert.match(contract, new RegExp(`\"${event.replace(".", "\\.")}\"`));
}

assert.match(types, /interface ReconciliationReport/);
assert.match(client, /getReconciliationReport/);

console.log("SDK contract alignment checks passed");
