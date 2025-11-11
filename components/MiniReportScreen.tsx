import React from 'react';
import { type Level, type MiniReport } from '../types';

interface MiniReportScreenProps {
  report: MiniReport | null;
  level: Level;
  onNext: () => void;
  isLastQuestion: boolean;
}

const levelStyles = {
    '초등학생': {
        cardBg: 'bg-yellow-100',
        titleColor: 'text-yellow-800',
        textColor: 'text-yellow-900',
        praiseTitleBg: 'bg-yellow-200',
        tipTitleBg: 'bg-yellow-200',
        buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
        evalBg: 'bg-yellow-400'
    },
    '중학생': {
        cardBg: 'bg-slate-800',
        titleColor: 'text-cyan-300',
        textColor: 'text-slate-200',
        praiseTitleBg: 'bg-green-900/50',
        tipTitleBg: 'bg-yellow-900/50',
        buttonBg: 'bg-cyan-500 hover:bg-cyan-600',
        evalBg: 'bg-cyan-700'
    },
    '고등학생': {
        cardBg: 'bg-slate-800 border border-slate-700',
        titleColor: 'text-white',
        textColor: 'text-slate-300',
        praiseTitleBg: 'bg-slate-700',
        tipTitleBg: 'bg-slate-700',
        buttonBg: 'bg-blue-600 hover:bg-blue-700',
        evalBg: 'bg-blue-800'
    }
}

const MiniReportScreen: React.FC<MiniReportScreenProps> = ({ report, level, onNext, isLastQuestion }) => {
  const styles = levelStyles[level];

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <p className="text-xl text-red-400">피드백을 불러오는 데 실패했습니다.</p>
        <button onClick={onNext} className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-full">
          {isLastQuestion ? 'AI 종합 분석 리포트 보기' : '다음 질문으로'}
        </button>
      </div>
    );
  }

  const buttonText = isLastQuestion ? 'AI 종합 분석 리포트 보기' : report.buttonText;

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-6 ${level === '초등학생' ? 'bg-yellow-50' : 'bg-slate-900'}`}>
        <div className={`w-full max-w-2xl rounded-2xl shadow-2xl p-8 space-y-6 ${styles.cardBg}`}>
            <h2 className={`text-3xl font-bold text-center ${styles.titleColor}`}>{report.title}</h2>
            
            <div className={`text-center p-4 rounded-lg ${styles.evalBg}`}>
                <p className={`text-sm font-semibold opacity-80 ${styles.textColor}`}>{report.evaluationTitle}</p>
                <p className={`text-4xl font-bold ${styles.titleColor}`}>{report.evaluationValue}</p>
            </div>

            <div className="space-y-4">
                <div className={`p-4 rounded-lg ${styles.praiseTitleBg}`}>
                    <h3 className={`font-bold text-lg ${styles.titleColor}`}>{report.praiseTitle}</h3>
                    <p className={`mt-1 ${styles.textColor}`}>{report.praise}</p>
                </div>
                 <div className={`p-4 rounded-lg ${styles.tipTitleBg}`}>
                    <h3 className={`font-bold text-lg ${styles.titleColor}`}>{report.growthTipTitle}</h3>
                    <p className={`mt-1 ${styles.textColor}`}>{report.growthTip}</p>
                </div>
            </div>

            <div className="pt-6 text-center">
                 <button 
                    onClick={onNext}
                    className={`w-full py-4 text-white font-bold text-xl rounded-xl transition-transform transform hover:scale-105 shadow-lg ${styles.buttonBg}`}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    </div>
  );
};

export default MiniReportScreen;
