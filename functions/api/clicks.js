// GET /api/clicks
// 전체 핫딜 클릭 수를 반환합니다. { deal_id: count, ... }
export async function onRequestGet(context) {
  try {
    const { env } = context;
    if (!env.CLICK_COUNTS) return json({});

    const raw = await env.CLICK_COUNTS.get('all') || '{}';
    return json(JSON.parse(raw));
  } catch {
    return json({});
  }
}

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
