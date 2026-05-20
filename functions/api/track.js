// POST /api/track  { id: string }
// 핫딜 클릭 수를 KV에 기록합니다.
export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const body = await request.json();
    const id = body?.id;

    if (!id) return json({ ok: false }, 400);
    if (!env.CLICK_COUNTS) return json({ ok: false, error: 'KV not bound' }, 503);

    const raw = await env.CLICK_COUNTS.get('all') || '{}';
    const counts = JSON.parse(raw);
    counts[id] = (counts[id] || 0) + 1;
    await env.CLICK_COUNTS.put('all', JSON.stringify(counts));

    return json({ ok: true, count: counts[id] });
  } catch {
    return json({ ok: true });
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
