export const config = { runtime: "edge" };

export default function handler() {
  return new Response(
    JSON.stringify({ ok: true, ts: Date.now() }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
