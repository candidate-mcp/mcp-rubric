import React from 'react';
import { type Level } from '../types';
import { StarIcon, BookOpenIcon, GraduationCapIcon } from './IconComponents';

interface StartScreenProps {
  onStart: (level: Level) => void;
}

const levelData = {
  '초등학생': {
    icon: StarIcon,
    description: '발표의 기본기부터 탄탄하게! AI 코치가 자신감을 키워줘요.',
    color: 'text-yellow-400',
    buttonBg: 'bg-yellow-500/80 hover:bg-yellow-500',
    isAdvanced: false
  },
  '중학생': {
    icon: BookOpenIcon,
    description: '수행평가와 발표, 논리적인 스피치로 완벽 대비!',
    color: 'text-green-400',
    buttonBg: 'bg-green-500/80 hover:bg-green-500',
    isAdvanced: false
  },
  '고등학생': {
    icon: GraduationCapIcon,
    description: '대입, 논술, 프로젝트를 위한 고차원 분석. AI가 당신만의 압도적 경쟁력을 만듭니다.',
    color: 'text-blue-400',
    buttonBg: 'bg-blue-500/80 hover:bg-blue-500',
    isAdvanced: true
  }
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-slate-900 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-900 animate-[gradient-xy_15s_ease_infinite]"></div>
      </div>
      <style>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-size: 400% 400%;
            background-position: top-left;
          }
          50% {
            background-size: 400% 400%;
            background-position: bottom-right;
          }
        }
      `}</style>

      <div className="w-full max-w-5xl mx-auto text-center z-10">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mb-3 drop-shadow-lg">
          루브릭 AI 말하기 코치
        </h1>
        <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
          "체계적인 루브릭(평가 기준)으로 당신의 발표를 분석하고 코칭해 드려요."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['초등학생', '중학생', '고등학생'] as Level[]).map((level) => {
            const data = levelData[level];
            const Icon = data.icon;
            return (
              <div
                key={level}
                className="flex flex-col bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="flex-grow">
                    <div className="flex justify-center mb-5">
                       <div className={`p-4 rounded-full bg-slate-700/50`}>
                          <Icon className={`w-10 h-10 ${data.color}`} />
                       </div>
                    </div>
                  <div className="flex items-baseline justify-center mb-3">
                    <h4 className={`text-2xl font-bold ${data.color}`}>{level}</h4>
                    {data.isAdvanced && (
                      <span className="ml-2 bg-indigo-500 text-indigo-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">심화 과정</span>
                    )}
                  </div>
                  <p className="text-slate-300 text-center h-20">{data.description}</p>
                </div>
                <button
                  onClick={() => onStart(level)}
                  className={`${data.buttonBg} text-white font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-4`}
                >
                  연습시작
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-16 z-10 border-t border-slate-700/50 pt-8 w-full max-w-5xl">
          <p className="text-lg text-slate-300 mb-4">루브릭 AI 코치와 함께, 학생들의 말하기 성장을 완성하세요.</p>
          <a
            href="https://www.candidate.im/candidate-remote-consultation?utm_source=aistudio&utm_medium=display&utm_campaign=rubric&utm_content=cta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold py-3 px-8 rounded-xl text-lg transition-colors duration-300 shadow-lg"
          >
            교육기관용 도입 문의
          </a>
      </div>

    </div>
  );
};

export default StartScreen;