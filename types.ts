
export type Level = '초등학생' | '중학생' | '고등학생';

export type AppState =
  | 'start'
  | 'interview'
  | 'mini-report-loading'
  | 'mini-report'
  | 'final-report-loading'
  | 'results';

export interface InterviewAnswer {
  question: string;
  answer: string;
}

// 미니 리포트 데이터 구조
export interface MiniReport {
  title: string;
  evaluationTitle: string;
  evaluationValue: string; // "★★★★☆" | "78점" | "B+"
  praiseTitle: string;
  praise: string;
  growthTipTitle: string;
  growthTip: string;
  buttonText: string;
  score: number; // 0-100점 사이의 실제 점수 (성장 그래프용)
}

// 종합 분석 리포트 데이터 구조
export interface RadarChartData {
  label: string;
  score: number;
}

export interface GrowthDataPoint {
  question: number;
  score: number;
}

export interface DetailedAnalysisItem {
  category: string;
  score: number;
  comment?: string; // 초등/중등용 한 줄 평가
  quote?: string; // 고등학생용 답변 인용
  analysis?: string; // 고등학생용 심층 분석
}

export interface DiagnosisAndGuide {
  profiling: string;
  utilization: {
    interviewStrategy: string;
    studentRecordTips: string;
  };
}

export interface Simulation {
  followUpQuestions: string[];
  logicEnhancement: string;
  answerExtensionGuide: string;
}


export interface ComprehensiveReport {
  // 공통
  title: string;
  detailedAnalysis: DetailedAnalysisItem[];
  radarChartData: RadarChartData[];
  growthGraphData: GrowthDataPoint[];
  growthGraphTitle?: string;
  
  // 초/중학생용
  overallScore?: number;
  overallGrade?: string;
  persona?: string; // "열정적인 이야기꾼"
  finalCommentTitle?: string;
  finalComment?: string;

  // 고등학생용
  overallTier?: string; // 예: "숙련 단계", "심화 역량 보유"
  strengthKeywords?: string[];
  diagnosisAndGuide?: DiagnosisAndGuide;
  simulation?: Simulation;
  futureStrategy?: string;
}
