const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const today = new Date().toISOString().split('T')[0];
const savePath = `src/content/posts/${today}-spring-songpa.md`;

if (fs.existsSync(savePath)) {
  fs.unlinkSync(savePath);
  console.log('기존 파일 삭제 후 재생성');
}

const prompt = `Write a Korean blog post for Songpa-gu residents about April spring activities.

Output ONLY in this exact format, no extra text:
---
title: 4월엔 송파로! 봄 나들이 명소 완전 정복 가이드
date: ${today}
summary: 석촌호수 벚꽃부터 올림픽공원 봄 행사까지, 4월 송파구 나들이 총정리
category: 이벤트
tags: [봄, 나들이, 송파, 벚꽃, 4월]
source: https://www.songpa.go.kr
---

Write 1000+ characters in Korean about:
1. 석촌호수 벚꽃 명소
2. 올림픽공원 봄 나들이
3. 4월 송파구 추천 행사 및 장소 3곳
Use friendly blog tone. Include visiting tips and practical info.`;

const body = JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: '/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const text = json.candidates[0].content.parts[0].text;
      fs.writeFileSync(savePath, text.trim(), 'utf8');
      console.log('생성 완료:', savePath);
      console.log('--- 첫 8줄 미리보기 ---');
      console.log(text.split('\n').slice(0, 8).join('\n'));
    } catch (e) {
      console.error('파싱 오류:', e.message);
      console.error('응답:', data.substring(0, 300));
    }
  });
});

req.on('error', e => console.error('요청 오류:', e.message));
req.write(body);
req.end();
