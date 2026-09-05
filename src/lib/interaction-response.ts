/**
 * Reading text out of a Gemini Interactions API response.
 *
 * The trap this exists to avoid: **`output_text` is not a field in the REST
 * JSON.** It is a convenience property the official SDKs synthesise by joining
 * trailing text blocks. Reading `response.output_text` from a raw `fetch`
 * yields `undefined` on every single call — and because the surrounding code
 * treats "no text" as a soft failure, it fails quietly rather than loudly.
 *
 * The actual response is a `steps` timeline. Only `model_output` steps carry
 * the answer; `thought`, `user_input` and tool-call steps must be skipped, or
 * the model's private reasoning ends up in a product description.
 *
 * Pure and import-free so it can be tested without a network or a key.
 */

export interface InteractionResponse {
  steps?: {
    type?: string;
    content?: { type?: string; text?: string }[];
  }[];
}

export function outputTextOf(data: InteractionResponse): string {
  return (data.steps ?? [])
    .filter((s) => s.type === "model_output")
    .flatMap((s) => s.content ?? [])
    .filter((c) => c.type === "text" && typeof c.text === "string")
    .map((c) => c.text!)
    .join("")
    .trim();
}
