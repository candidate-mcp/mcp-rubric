
import React, { useState, useRef } from 'react';
import { type Level, type ComprehensiveReport, RadarChartData, GrowthDataPoint, DetailedAnalysisItem } from '../types';
import { BrainCircuitIcon, ChevronDownIcon } from './IconComponents';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

// --- Reusable Chart Components ---

const RadarChart: React.FC<{ data: RadarChartData[] }> = ({ data }) => {
  const size = 300;
  const center = size / 2;
  const numLevels = 5;
  const angleSlice = (Math.PI * 2) / data.length;

  const points = data.map((item, i) => {
    const value = item.score / 100;
    const x = center + center * value * 0.8 * Math.cos(angleSlice * i - Math.PI / 2);
    const y = center + center * value * 0.8 * Math.sin(angleSlice * i - Math.PI / 2);
    return `${x},${y}`;
  }).join(' ');

  const getLabelLines = (label: string): string[] => {
    if (label.includes(' ')) {
      return label.split(' ');
    }
    if (label.length > 5 && !label.includes(' ')) { 
      const mid = Math.ceil(label.length / 2);
      return [label.slice(0, mid), label.slice(mid)];
    }
    return [label];
  };

  return (
    <svg width="100%" height="100%" viewBox={`-40 -40 380 380`}>
      <g>
        {[...Array(numLevels)].map((_, levelIndex) => {
          const radius = (center * 0.8 / numLevels) * (levelIndex + 1);
          const levelPoints = data.map((_, i) => {
            const x = center + radius * Math.cos(angleSlice * i - Math.PI / 2);
            const y = center + radius * Math.sin(angleSlice * i - Math.PI / 2);
            return `${x},${y}`;
          }).join(' ');
          return <polygon key={levelIndex} points={levelPoints} fill="none" stroke="#475569" strokeWidth="1" />;
        })}
        
        {data.map((_, i) => {
          const x = center + center * 0.8 * Math.cos(angleSlice * i - Math.PI / 2);
          const y = center + center * 0.8 * Math.sin(angleSlice * i - Math.PI / 2);
          return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#475569" strokeWidth="1" />;
        })}
        
        <polygon points={points} fill="rgba(34, 211, 238, 0.4)" stroke="#22d3ee" strokeWidth="2" />
        
        {data.map((item, i) => {
          const x = center + center * 1.05 * Math.cos(angleSlice * i - Math.PI / 2);
          const y = center + center * 1.05 * Math.sin(angleSlice * i - Math.PI / 2);
          
          const labelLines = getLabelLines(item.label);

          return (
            <text key={i} x={x} y={y} fill="#cbd5e1" fontSize="12" textAnchor="middle" dominantBaseline="central">
              {labelLines.map((line, index) => (
                <tspan key={index} x={x} dy={index > 0 ? '1.2em' : '0'}>
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}
      </g>
    </svg>
  );
};


const GrowthGraph: React.FC<{ data: GrowthDataPoint[], title: string }> = ({ data, title }) => {
  const width = 400;
  const height = 200;
  const padding = 40;

  const points = data.map(p => {
    const x = padding + (p.question - 1) * (width - 2 * padding) / (data.length - 1 || 1);
    const y = height - padding - (p.score / 100) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="bg-slate-800 p-4 rounded-lg">
      <h4 className="text-center font-semibold text-slate-300 mb-2">{title}</h4>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748b" />
        <text x={padding - 10} y={padding} fill="#94a3b8" fontSize="10" textAnchor="end">100</text>
        <text x={padding - 10} y={height-padding} fill="#94a3b8" fontSize="10" textAnchor="end">0</text>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748b" />
        {data.map(p => {
           const x = padding + (p.question - 1) * (width - 2 * padding) / (data.length - 1 || 1);
           return <text key={p.question} x={x} y={height-padding+15} fill="#94a3b8" fontSize="10" textAnchor="middle">{p.question}번</text>
        })}

        <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="2" />
        {data.map(p => {
          const x = padding + (p.question - 1) * (width - 2 * padding) / (data.length - 1 || 1);
          const y = height - padding - (p.score / 100) * (height - 2 * padding);
          return <circle key={p.question} cx={x} cy={y} r="3" fill="#22d3ee" />;
        })}
      </svg>
    </div>
  )
};

// --- High School Report Specific Components ---
const AnalysisItem: React.FC<{ item: DetailedAnalysisItem, isOpen: boolean, onToggle: () => void }> = ({ item, isOpen, onToggle }) => {
    return (
      <div className="bg-slate-800/70 rounded-lg border border-slate-700 overflow-hidden">
        <button onClick={onToggle} className="w-full flex justify-between items-center p-4 text-left">
          <span className="font-bold text-xl text-slate-200">{item.category}: <span className="text-cyan-300">{item.score}점</span></span>
          <ChevronDownIcon className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
            <div className="p-4 pt-0 border-t border-slate-700/50">
              {item.quote && <blockquote className="border-l-4 border-slate-600 pl-4 my-3 text-slate-400 italic">"{item.quote}"</blockquote>}
              {item.analysis && <p className="text-slate-300 mt-2 leading-relaxed">{item.analysis}</p>}
            </div>
        </div>
      </div>
    );
};

// --- Main Component ---
interface ResultsScreenProps {
  report: ComprehensiveReport | null;
  level: Level;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ report, level, onRestart }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [openToggles, setOpenToggles] = useState<Record<string, boolean>>({});
  const resultsContentRef = useRef<HTMLDivElement>(null);

  const handleToggle = (category: string) => {
    setOpenToggles(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleSaveAsPdf = async () => {
    if (!resultsContentRef.current || !window.html2canvas || !window.jspdf) {
        console.error("PDF generation library not found.");
        alert("PDF를 생성하는 데 필요한 라이브러리를 로드하지 못했습니다. 페이지를 새로고침하고 다시 시도해 주세요.");
        return;
    }
    
    setIsSaving(true);
    const originalToggles = { ...openToggles }; // Save current state
    
    // Force all toggles to open for PDF generation
    const allOpenState = report?.detailedAnalysis.reduce((acc, item) => {
        acc[item.category] = true;
        return acc;
    }, {} as Record<string, boolean>) || {};
    setOpenToggles(allOpenState);

    // Give React time to re-render the DOM with toggles open
    setTimeout(async () => {
        try {
            const canvas = await window.html2canvas(resultsContentRef.current, {
                scale: 2, 
                backgroundColor: '#0f172a' // slate-900 background
            });
            const imgData = canvas.toDataURL('image/png');
            
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('AI-심층-역량-리포트.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("PDF를 생성하는 중 오류가 발생했습니다.");
        } finally {
            // Restore original toggle state and set saving to false
            setOpenToggles(originalToggles);
            setIsSaving(false);
        }
    }, 100); // 100ms delay to ensure DOM update
  };


  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <p className="text-xl text-red-400">리포트를 생성하는 데 실패했습니다.</p>
        <button onClick={onRestart} className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-full">
          다시 시작하기
        </button>
      </div>
    );
  }

  const renderElementarySchoolReport = () => (
    <>
      <div className="flex flex-col md:flex-row items-center justify-around bg-slate-800 p-6 rounded-2xl mb-8">
          <div className="text-center">
            <p className="text-slate-400">종합 점수</p>
            <p className="text-6xl font-bold text-cyan-400">{report.overallScore}<span className="text-3xl text-slate-300">점</span></p>
            <p className="text-2xl font-semibold text-yellow-400 mt-1">{report.overallGrade}</p>
          </div>
          <div className="text-center mt-4 md:mt-0">
            <p className="text-slate-400">나의 발표 스타일</p>
            <p className="text-3xl font-bold text-white bg-slate-700 px-4 py-2 rounded-lg mt-2">{report.persona}</p>
          </div>
      </div>
       <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl"><RadarChart data={report.radarChartData} /></div>
        <div className="bg-slate-800 p-6 rounded-2xl flex flex-col justify-center">
          <h3 className="text-xl font-bold text-white mb-3">세부 평가</h3>
          {report.detailedAnalysis.map(item => (
            <div key={item.category} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
              <span className="text-slate-300">{item.category}</span>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-white">{item.score}점</span>
                <p className="text-slate-400 text-sm">{item.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-3">{report.finalCommentTitle}</h3>
              <p className="text-slate-300 leading-relaxed">{report.finalComment}</p>
          </div>
          <GrowthGraph data={report.growthGraphData} title={report.growthGraphTitle || ''} />
      </div>
    </>
  );

  const renderMiddleSchoolReport = () => (
    <>
       <div className="flex flex-col md:flex-row items-center justify-around bg-slate-800 p-6 rounded-2xl mb-8">
          <div className="text-center">
            <p className="text-slate-400">종합 점수</p>
            <p className="text-6xl font-bold text-cyan-400">{report.overallScore}<span className="text-3xl text-slate-300">점</span></p>
            <p className="text-2xl font-semibold text-cyan-400 mt-1">{report.overallGrade}</p>
          </div>
          <div className="text-center mt-4 md:mt-0">
            <p className="text-slate-400">나의 스피치 페르소나</p>
            <p className="text-3xl font-bold text-white bg-slate-700 px-4 py-2 rounded-lg mt-2">{report.persona}</p>
          </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl"><RadarChart data={report.radarChartData} /></div>
        <div className="bg-slate-800 p-6 rounded-2xl">
           <h3 className="text-xl font-bold text-white mb-4">세부 역량 분석</h3>
           <div className="space-y-4">
           {report.detailedAnalysis.map(item => (
            <div key={item.category}>
               <div className="flex justify-between items-baseline mb-1">
                   <span className="text-slate-300">{item.category}</span>
                   <span className="font-bold text-lg text-white">{item.score}점</span>
               </div>
               <div className="w-full bg-slate-700 rounded-full h-2.5">
                   <div className="bg-cyan-400 h-2.5 rounded-full" style={{ width: `${item.score}%` }}></div>
               </div>
               <p className="text-slate-400 text-sm mt-1 text-right">{item.comment}</p>
            </div>
          ))}
          </div>
        </div>
      </div>
       <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-3">{report.finalCommentTitle}</h3>
              <p className="text-slate-300 leading-relaxed">{report.finalComment}</p>
          </div>
          <GrowthGraph data={report.growthGraphData} title={report.growthGraphTitle || ''} />
      </div>
    </>
  );

  const renderHighSchoolReport = () => {
    if (!report?.diagnosisAndGuide || !report?.simulation) return null; // Type guard
    return (
      <>
        <div className="text-center mb-8">
          <p className="text-2xl text-slate-300 mb-2">{report.overallTier}</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {report.strengthKeywords?.map(keyword => (
              <span key={keyword} className="bg-blue-500/20 text-blue-300 text-sm font-medium px-3 py-1 rounded-full">
                # {keyword}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl flex items-center justify-center">
             <RadarChart data={report.radarChartData} />
          </div>
          <div className="lg:col-span-3 bg-slate-800 p-6 rounded-2xl">
             <h3 className="text-xl font-bold text-white mb-4">심층 역량 분석</h3>
             <div className="space-y-3">
              {report.detailedAnalysis.map(item => (
                <AnalysisItem 
                  key={item.category} 
                  item={item} 
                  isOpen={!!openToggles[item.category]} 
                  onToggle={() => handleToggle(item.category)}
                />
              ))}
             </div>
          </div>
        </div>
        
        <div className="space-y-8 mb-8">
            <div className="bg-slate-800 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-3">종합 진단 및 활용 가이드</h3>
                <p className="text-slate-300 leading-relaxed mb-4">{report.diagnosisAndGuide.profiling}</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-cyan-300 mb-2">면접 전략</h4>
                        <p className="text-slate-400 text-sm">{report.diagnosisAndGuide.utilization.interviewStrategy}</p>
                    </div>
                     <div className="bg-slate-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-cyan-300 mb-2">학생부 기재 팁</h4>
                        <p className="text-slate-400 text-sm">{report.diagnosisAndGuide.utilization.studentRecordTips}</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
                 <h3 className="text-xl font-bold text-white mb-3">실전 면접 시뮬레이션</h3>
                 <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-cyan-300 mb-2">예상 꼬리 질문</h4>
                        <ul className="list-disc list-inside text-slate-300 space-y-1">
                            {report.simulation.followUpQuestions.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-cyan-300 mb-2">논리 강화 팁</h4>
                        <p className="text-slate-400">{report.simulation.logicEnhancement}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-cyan-300 mb-2">답변 확장 가이드</h4>
                        <p className="text-slate-400">{report.simulation.answerExtensionGuide}</p>
                    </div>
                 </div>
            </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-3">향후 학습 전략 제안</h3>
              <p className="text-slate-300 leading-relaxed">{report.futureStrategy}</p>
            </div>
            <GrowthGraph data={report.growthGraphData} title={report.growthGraphTitle || ''} />
        </div>
      </>
    );
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div ref={resultsContentRef} className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg mb-3">
             <BrainCircuitIcon className="w-7 h-7 text-cyan-400" />
             <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
               AI 심층 분석 리포트
             </h1>
          </div>
          <p className="text-slate-400">당신의 답변을 기반으로 생성된 종합 분석 결과입니다.</p>
        </header>

        <main>
          {level === '초등학생' && renderElementarySchoolReport()}
          {level === '중학생' && renderMiddleSchoolReport()}
          {level === '고등학생' && renderHighSchoolReport()}
        </main>
      </div>

      <footer className="mt-12 text-center">
        {level === '고등학생' && (
             <button
                onClick={handleSaveAsPdf}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors duration-300 shadow-lg mr-4 disabled:opacity-50"
             >
                {isSaving ? '저장 중...' : 'PDF로 저장하기'}
            </button>
        )}
        <button
          onClick={onRestart}
          className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold py-3 px-8 rounded-xl text-lg transition-colors duration-300 shadow-lg"
        >
          다시 시작하기
        </button>
        <p className="text-slate-500 text-sm mt-8">
            * 이 리포트는 AI가 생성한 것으로, 일부 부정확한 내용이 포함될 수 있습니다. 참고용으로만 활용해 주세요.
        </p>
      </footer>
    </div>
  );
};

export default ResultsScreen;
