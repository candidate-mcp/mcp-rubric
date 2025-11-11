import React, { useState, useCallback, useMemo } from 'react';
import { type AppState, type InterviewAnswer, type Level, type MiniReport, type ComprehensiveReport } from './types';
import { getMiniReport, getComprehensiveReport } from './services/geminiService';
import { QUESTIONS } from './constants';
import StartScreen from './components/StartScreen';
import InterviewScreen from './components/InterviewScreen';
import ResultsScreen from './components/ResultsScreen';
import LoadingSpinner from './components/LoadingSpinner';
import MiniReportScreen from './components/MiniReportScreen';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('start');
  const [level, setLevel] = useState<Level>('고등학생');
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [miniReport, setMiniReport] = useState<MiniReport | null>(null);
  const [comprehensiveReport, setComprehensiveReport] = useState<ComprehensiveReport | null>(null);

  const questions = useMemo(() => QUESTIONS[level], [level]);

  const handleStart = (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setMiniReport(null);
    setComprehensiveReport(null);
    setAppState('interview');
  };

  const handleRestart = () => {
      setAppState('start');
  };

  const handleSingleAnswerComplete = useCallback(async (answer: string) => {
    setAppState('mini-report-loading');
    const question = questions[currentQuestionIndex];
    const newAnswer: InterviewAnswer = { question, answer };
    
    setAnswers(prevAnswers => [...prevAnswers, newAnswer]);

    const report = await getMiniReport(level, question, answer);
    setMiniReport(report);
    setAppState('mini-report');
  }, [questions, currentQuestionIndex, level]);

  const generateFinalReport = useCallback(async () => {
    setAppState('final-report-loading');
    // By passing the state updater function to setAnswers, we ensure we are using the most up-to-date answers array.
    setAnswers(currentAnswers => {
        getComprehensiveReport(level, currentAnswers).then(report => {
            setComprehensiveReport(report);
            setAppState('results');
        });
        return currentAnswers; // The state updater function must return the state.
    });
  }, [level]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAppState('interview');
    } else {
      generateFinalReport();
    }
  }, [currentQuestionIndex, questions.length, generateFinalReport]);


  const renderContent = () => {
    switch (appState) {
      case 'start':
        return <StartScreen onStart={handleStart} />;
      
      case 'interview':
        return <InterviewScreen 
                  question={questions[currentQuestionIndex]}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  onComplete={handleSingleAnswerComplete}
                  onExit={handleRestart}
               />;
      
      case 'mini-report-loading':
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
                <LoadingSpinner message="답변을 분석 중입니다..." />
            </div>
        );

      case 'mini-report':
        return <MiniReportScreen 
                  report={miniReport}
                  level={level}
                  onNext={handleNextQuestion}
                  isLastQuestion={currentQuestionIndex === questions.length - 1}
               />;

      case 'final-report-loading':
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
                <LoadingSpinner message="종합 리포트를 생성하고 있습니다. 잠시만 기다려 주세요..." />
            </div>
        );

      case 'results':
        return <ResultsScreen 
                  report={comprehensiveReport}
                  level={level}
                  onRestart={handleRestart} 
               />;
      
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return <div className="h-screen w-screen">{renderContent()}</div>;
};

export default App;