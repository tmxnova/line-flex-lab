/**
 * Small adapter for LINE's official authenticated Flex validation/render
 * API. It calls LINE's actual renderer/validator. It is NOT an offline validator,
 * and does not contain or reproduce LINE's private server implementation.
 * Use from an authorized, same-origin browser integration; localhost cannot
 * borrow a session from developers.line.biz. No cookies/tokens are included.
 */
export async function validateAndRender(flex, { fetchImpl = globalThis.fetch } = {}) {
  const response = await fetchImpl('/api/v1/fx/render', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify(flex),
  });
  const rawBody = await response.text();
  if (response.ok) return { ok: true, status: response.status, html: rawBody };
  let error;
  try { error = JSON.parse(rawBody); } catch { error = null; }
  return { ok: false, status: response.status, error, rawBody };
}

/** Syntax only: a successful result does NOT mean LINE accepts the message. */
export function parseJsonOffline(text) {
  try { return { ok: true, value: JSON.parse(text) }; }
  catch (error) { return { ok: false, error: error.message }; }
}

/** Exact mapping used by the original frontend to display API errors. */
export function toEditorMessages(details) {
  return details.map((e) => ({ path: e.property, text: e.message }));
}
