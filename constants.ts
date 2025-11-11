
import { Level } from './types';

export const QUESTIONS: Record<Level, string[]> = {
  '초등학생': [
    "자신을 가장 잘 나타내는 별명을 짓고, 왜 그렇게 생각하는지 이야기해주세요.",
    "최근에 누군가를 도와주었던 경험이 있나요? 그때 어떤 마음이 들었는지 설명해주세요.",
    "우리 반을 더 즐겁게 만들기 위한 규칙을 하나 만든다면, 어떤 규칙을 만들고 싶나요?",
    "'진정한 친구'란 무엇이라고 생각하나요? 자신의 생각을 예를 들어 설명해주세요.",
    "10년 뒤 나는 어떤 모습일지 상상해서 이야기하고, 그 꿈을 이루기 위해 지금부터 어떤 노력을 할 수 있을지 구체적으로 말해보세요."
  ],
  '중학생': [
    "자신의 가장 큰 장점은 무엇이며, 그 장점을 발견하게 된 계기가 된 경험이 있다면 말해주세요.",
    "중학교 생활 중 가장 도전적이었던 과제나 활동은 무엇이며, 그 과정을 통해 무엇을 배웠나요?",
    "학교에서 교복을 꼭 입어야 할까요? 교복 착용에 대한 자신의 생각과 그 이유를 논리적으로 말해주세요.",
    "SNS(소셜 미디어)를 현명하게 사용한다는 것은 무엇을 의미할까요? 자신의 생각을 구체적인 사례를 들어 설명해보세요.",
    "AI(인공지능)가 미래 사회에 꼭 필요한 기술이라고 생각하나요? AI의 긍정적 역할과 우리가 경계해야 할 점에 대해 자신의 견해를 주장해보세요."
  ],
  '고등학생': [
    "자신의 진로 희망과 관련하여, 스스로 역량을 키우기 위해 노력했던 가장 의미 있는 탐구 활동 경험을 구체적으로 설명해주세요.",
    "팀 프로젝트에서 다른 의견을 가진 팀원과 갈등이 발생했을 때, 어떻게 소통하여 문제를 해결했으며 그 과정에서 자신의 역할은 무엇이었나요?",
    "현대 사회의 리더가 갖춰야 할 가장 중요한 덕목은 무엇이라고 생각하는지, 역사적 또는 현대 인물의 사례를 들어 자신의 주장을 뒷받침하세요.",
    "최근 우리 사회의 중요한 이슈(예: 기후 변화, 가짜 뉴스, 저출산 등) 중 하나를 선택하여, 문제의 핵심 원인을 분석하고 실현 가능한 해결 방안을 제시해보세요.",
    "'결과의 평등'과 '기회의 평등' 중 우리 사회가 어떤 가치를 더 우선해야 한다고 생각하는지, 구체적인 사회 제도나 정책을 예로 들어 자신의 견해를 논리적으로 펼쳐보세요."
  ]
};

const getMiniReportPrompt = (level: Level, question: string, answer: string): string => {
  const commonInstruction = `
You are an AI speaking coach. Your task is to provide a "mini-report" on a user's single answer.
Analyze the given question and answer based on the user's level.
Provide feedback in a concise, encouraging, and level-appropriate tone.
You MUST respond in a valid JSON format. Do not include any text outside the JSON object.
The JSON response should strictly follow this structure:
{
  "title": "string", // Report title
  "evaluationTitle": "string", // Title for the evaluation metric (e.g., "자신감 별점")
  "evaluationValue": "string", // The metric value (e.g., "★★★★☆" or "78점" or "B+")
  "praiseTitle": "string", // Title for the praise point (e.g., "👍 잘했어요!")
  "praise": "string", // One specific praise point.
  "growthTipTitle": "string", // Title for the growth tip (e.g., "💡 이렇게 해볼까?")
  "growthTip": "string", // One specific, actionable growth tip.
  "buttonText": "string", // Text for the "next" button.
  "score": "number" // An overall score for this single answer, from 0 to 100. This is for the growth graph later.
}
`;

  const levelSpecifics = {
    '초등학생': `
Concept: "칭찬하는 AI 친구"
Tone: Use easy and encouraging words. Feel like a friendly peer.
Evaluation: Use a 5-star rating (e.g., "★★★☆☆").
Example Praise: "씩씩하고 큰 목소리로 말하는 점이 정말 멋져요!"
Example Tip: "이야기할 때 '음...' 하는 부분을 조금만 줄이면, 더 똑 부러지게 들릴 거예요!"
JSON Example:
{
  "title": "1번 답변 분석 완료! 🧐",
  "evaluationTitle": "자신감 별점",
  "evaluationValue": "★★★★☆",
  "praiseTitle": "👍 잘했어요!",
  "praise": "자신의 별명을 재미있는 이유와 함께 설명해 주어서 귀에 쏙쏙 들어왔어요.",
  "growthTipTitle": "💡 이렇게 해볼까?",
  "growthTip": "조금만 더 천천히, 또박또박 말하면 친구들이 훨씬 더 잘 알아들을 거예요.",
  "buttonText": "좋아! 다음 질문으로 가기",
  "score": 85
}`,
    '중학생': `
Concept: "똑똑한 AI 분석가"
Tone: Use learning-related terms like 'logic', 'evidence', 'structure' but maintain a positive tone.
Evaluation: Use a numerical score out of 100 (e.g., "78점").
Example Praise: "주장을 뒷받침하기 위해 자신의 경험을 근거로 제시한 점이 매우 논리적입니다."
Example Tip: "주장을 먼저 말하고 이유를 설명하는 '두괄식'으로 구성하면 전달력이 2배 향상될 거예요."
JSON Example:
{
  "title": "2번 질문 분석 리포트",
  "evaluationTitle": "말하기 점수",
  "evaluationValue": "78점",
  "praiseTitle": "✅ 강점 분석",
  "praise": "자신의 장점을 구체적인 경험과 연결하여 객관적으로 분석하는 능력이 돋보입니다.",
  "growthTipTitle": "🎯 개선 제안",
  "growthTip": "답변의 시작 부분에 핵심 키워드를 먼저 제시하면 면접관의 집중도를 높일 수 있습니다.",
  "buttonText": "피드백 확인, 다음 질문으로",
  "score": 78
}`,
    '고등학생': `
Concept: "전문 AI 컨설턴트"
Tone: Use professional and analytical terms relevant to college admissions and academic evaluations.
Evaluation: Use a letter grade (e.g., "A-", "B+", "C").
Example Praise: "역사적 인물의 사례를 현대적 리더십과 연결하여, 주장의 설득력을 크게 높였습니다."
Example Tip: "제시한 주장에 대한 '예상 반론'을 먼저 언급하고 이를 재반박하는 논리를 추가하면, 사고의 깊이를 증명할 수 있습니다."
JSON Example:
{
  "title": "3번 문항 심층 분석 결과",
  "evaluationTitle": "비판적 사고력",
  "evaluationValue": "B+",
  "praiseTitle": "탁월한 점",
  "praise": "갈등 상황을 '문제'로 정의하고, 자신의 역할을 중심으로 해결 과정을 체계적으로 설명했습니다.",
  "growthTipTitle": "심화 전략",
  "growthTip": "해결 과정에서 다른 팀원의 기여도를 함께 언급하면 '협업 능력'까지 어필할 수 있습니다.",
  "buttonText": "피드백 확인, 다음 질문으로",
  "score": 88
}`
  };

  return `${commonInstruction}\n\n--- User Level & Request ---\nLevel: ${level}\n${levelSpecifics[level]}\n\n--- User's Answer ---\nQuestion: "${question}"\nAnswer: "${answer}"\n\nProvide the JSON output now.`;
};


const getComprehensiveReportPrompt = (level: Level, userAnswersText: string): string => {
  const commonInstruction = `
You are an AI speaking coach. Your task is to provide a "Comprehensive Analysis Report" based on all 5 of the user's answers.
Analyze all answers holistically based on the user's level.
You MUST respond in a valid JSON format. Do not include any text outside the JSON object.
`;

  const levelSpecifics = {
    '초등학생': `
Concept: "칭찬 가득 최종 리포트" - Bright, colorful, with cute icons.
JSON Structure:
{
  "title": "AI 종합 분석 리포트",
  "overallScore": number (0-100),
  "overallGrade": string (e.g., "참 잘했어요!"),
  "persona": string (e.g., "씩씩한 모험가"),
  "radarChartData": [
    {"label": "씩씩하게 말하기", "score": number (0-100)},
    {"label": "재미있는 이야기", "score": number (0-100)},
    {"label": "내 생각 표현", "score": number (0-100)},
    {"label": "바른 자세", "score": number (0-100)},
    {"label": "귀 기울여 듣기", "score": number (0-100)} // This is a proxy for considering the question
  ],
  "detailedAnalysis": [
    {"category": "씩씩하게 말하기", "score": number, "comment": "string (one-sentence summary)"},
    //... other 4 categories
  ],
  "finalCommentTitle": "AI 친구의 최종 칭찬",
  "finalComment": "string (3-4 sentences summarizing strengths and one key improvement area, with encouragement)",
  "growthGraphTitle": "자신감 성장 그래프",
  "growthGraphData": [
    {"question": 1, "score": number},
    //... up to question 5
  ]
}`,
    '중학생': `
Concept: "데이터 중심 스마트 리포트" - Clean, modern, data-focused design.
JSON Structure:
{
  "title": "AI 종합 분석 리포트",
  "overallScore": number (0-100),
  "overallGrade": string (e.g., "A-"),
  "persona": string (e.g., "냉철한 논리 전략가"),
  "radarChartData": [
    {"label": "내용의 논리성", "score": number (0-100)},
    {"label": "표현의 명확성", "score": number (0-100)},
    {"label": "목소리 자신감", "score": number (0-100)},
    {"label": "발표 태도", "score": number (0-100)},
    {"label": "생각의 독창성", "score": number (0-100)}
  ],
  "detailedAnalysis": [
    {"category": "내용의 논리성", "score": number, "comment": "string (one-sentence summary)"},
    //... other 4 categories
  ],
  "finalCommentTitle": "AI 코치의 최종 분석",
  "finalComment": "string (3-4 sentences summarizing strengths, one key improvement, and how to practice)",
  "growthGraphTitle": "논리력 성장 그래프",
  "growthGraphData": [
    {"question": 1, "score": number},
    //... up to question 5
  ]
}`,
    '고등학생': `
Concept: "전문 입시 컨설팅 리포트" - Professional, trustworthy, academic report style. Provide in-depth, actionable advice.
JSON Structure:
{
  "title": "AI 심층 역량 분석 리포트",
  "overallTier": "string (e.g., '심화 역량 보유', '균형 잡힌 성장', '잠재력 발현 중')",
  "strengthKeywords": ["string", "string", "string"],
  "radarChartData": [
    {"label": "문제 해결 역량", "score": number (0-100)},
    {"label": "비판적 사고력", "score": number (0-100)},
    {"label": "전공 적합성", "score": number (0-100)},
    {"label": "의사소통 능력", "score": number (0-100)},
    {"label": "리더십과 협업", "score": number (0-100)}
  ],
  "detailedAnalysis": [
    {
      "category": "문제 해결 역량", "score": number, 
      "quote": "string (User's most relevant answer quote for this category)",
      "analysis": "string (In-depth analysis of the quote and user's ability in this category)"
    }
    //... other 4 categories with quote and analysis
  ],
  "diagnosisAndGuide": {
    "profiling": "string (A comprehensive diagnosis of the student's speaking style and thinking process, as a paragraph)",
    "utilization": {
      "interviewStrategy": "string (Actionable advice on how to use this analysis for college admission interviews)",
      "studentRecordTips": "string (Tips on how to reflect these strengths in the student's official school records or portfolio)"
    }
  },
  "simulation": {
    "followUpQuestions": [
        "string (A sharp, probing follow-up question based on the user's answers)",
        "string (Another one)",
        "string (And a third one)"
    ],
    "logicEnhancement": "string (A tip on how to make the user's arguments more robust, e.g., by citing data or papers)",
    "answerExtensionGuide": "string (A guide on how to connect the user's answer to their desired major for deeper relevance)"
  },
  "futureStrategy": "string (Recommend a concrete next step, like a specific book to read or a topic to research)",
  "growthGraphTitle": "논리력과 전달력 성장 추이",
  "growthGraphData": [
    {"question": 1, "score": number},
    //... up to question 5
  ]
}`
  };

  return `${commonInstruction}\n\n--- User Level & Request ---\nLevel: ${level}\n${levelSpecifics[level]}\n\n--- User's 5 Answers ---\n${userAnswersText}\n\nProvide the JSON output now.`;
};


export { getMiniReportPrompt, getComprehensiveReportPrompt };
