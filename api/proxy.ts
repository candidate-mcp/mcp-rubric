// Vercel Serverless Function handler
export default async function handler(req: any, res: any) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // API 키 확인
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is not set');
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'GEMINI_API_KEY environment variable is missing'
    });
  }

  // URL에서 경로 추출
  // rewrite를 통해 /api-proxy/...가 /api/proxy?path=/...로 변환됨
  const path = req.query?.path || req.url?.replace('/api/proxy', '').replace('/api-proxy', '') || '';
  
  if (!path || path === '') {
    return res.status(400).json({ error: 'Invalid path', query: req.query, url: req.url });
  }

  // Gemini API URL 구성
  const targetUrl = `https://generativelanguage.googleapis.com${path}?key=${apiKey}`;

  try {
    // 요청 본문 처리
    let body: string | undefined;
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      body = JSON.stringify(req.body);
    }

    // Gemini API로 프록시 요청
    const response = await fetch(targetUrl, {
      method: req.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    // 응답 데이터 가져오기
    const data = await response.json();

    // 상태 코드와 함께 응답 반환
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Proxy request failed:', error);
    return res.status(500).json({ 
      error: 'Proxy request failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

