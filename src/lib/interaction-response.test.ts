/**
 * Guards the one thing about the Gemini REST shape that is easy to get wrong
 * and fails silently: `output_text` does not exist in the JSON.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { outputTextOf } from "./interaction-response";

test("reads text out of a model_output step", () => {
  // Shape taken from the API docs, not invented.
  const res = {
    id: "v1_Chd",
    steps: [
      { type: "user_input", content: [{ type: "text", text: "write a description" }] },
      { type: "model_output", content: [{ type: "text", text: "A compact all-in-one." }] },
    ],
  };
  assert.equal(outputTextOf(res), "A compact all-in-one.");
});

test("never returns the model's private reasoning", () => {
  const res = {
    steps: [
      { type: "thought", content: [{ type: "text", text: "The user probably wants..." }] },
      { type: "model_output", content: [{ type: "text", text: "Prints 22 ppm." }] },
    ],
  };
  const out = outputTextOf(res);
  assert.equal(out, "Prints 22 ppm.");
  assert.ok(!out.includes("probably"), "a thought step leaked into the copy");
});

test("joins several text blocks in one step", () => {
  const res = {
    steps: [{ type: "model_output", content: [
      { type: "text", text: "Fast, " },
      { type: "text", text: "quiet, " },
      { type: "text", text: "cheap to run." },
    ] }],
  };
  assert.equal(outputTextOf(res), "Fast, quiet, cheap to run.");
});

test("ignores non-text content rather than crashing", () => {
  const res = {
    steps: [{ type: "model_output", content: [
      { type: "image", mime_type: "image/png" },
      { type: "text", text: "Here it is." },
    ] }],
  };
  assert.equal(outputTextOf(res), "Here it is.");
});

test("an output_text-shaped response yields nothing, which is the bug this catches", () => {
  // If someone 'fixes' this by reading output_text, this test tells them the
  // SDK property is not in the wire format.
  assert.equal(outputTextOf({ } as never), "");
  assert.equal(outputTextOf({ steps: [] }), "");
});
