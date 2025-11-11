
import React, { useState, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { MicrophoneIcon, StopIcon, XIcon } from './IconComponents';

interface InterviewScreenProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onComplete: (answer: string) => void;
  onExit: () => void;
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({ question, questionNumber, totalQuestions, onComplete, onExit }) => {
  
  const { isListening, transcript, startListening, stopListening, resetTranscript, hasRecognitionSupport } = useSpeechRecognition();
  const { speak, isSpeaking, hasSynthesisSupport } = useSpeechSynthesis();
  const [submitted, setSubmitted] = useState(false);
  const [textAnswer, setTextAnswer] = useState(''); // ADDED for text input fallback

  useEffect(() => {
    resetTranscript(); // Reset transcript for new question
    setTextAnswer(''); // Reset text answer for new question
    if (hasSynthesisSupport && question) {
      speak(question);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, hasSynthesisSupport]);

  // This effect ensures onComplete is called with the final transcript
  // after listening has stopped, preventing race conditions.
  useEffect(() => {
    if (submitted && !isListening && hasRecognitionSupport) {
      onComplete(transcript);
      setSubmitted(false); // Reset for next submission
    }
  }, [submitted, isListening, transcript, onComplete, hasRecognitionSupport]);


  const handleStartRecording = useCallback(() => {
    if (!isListening) {
      startListening();
    }
  }, [isListening, startListening]);

  const handleStopRecording = useCallback(() => {
    if (isListening) {
      stopListening();
    }
  }, [isListening, stopListening]);

  const handleSubmit = () => {
    if (hasRecognitionSupport) {
      if (isListening) {
        stopListening();
        setSubmitted(true); // Let the useEffect handle the submission
      } else {
        onComplete(transcript); // Submit immediately if not listening
      }
    } else {
      onComplete(textAnswer); // Submit with text answer if no speech recognition
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 sm:p-6 text-white">
      <div className="relative w-full max-w-3xl bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        <button onClick={onExit} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
        </button>

        <div className="text-center">
          <p className="text-cyan-400 font-semibold">질문 {questionNumber} / {totalQuestions}</p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">{question}</h2>
        </div>

        <div className="relative w-full h-40 bg-slate-900/50 rounded-lg p-4 overflow-y-auto border border-slate-700">
          {hasRecognitionSupport ? (
            <>
              <p className="text-slate-200 whitespace-pre-wrap">{transcript || '음성 녹음 버튼을 누르고 답변을 시작하세요.'}</p>
              {isListening && (
                 <div className="absolute top-2 right-2 flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-red-400 text-xs font-bold">REC</span>
                </div>
              )}
            </>
          ) : (
            <textarea
              className="w-full h-full bg-transparent text-slate-200 resize-none border-none focus:ring-0 p-0 placeholder-slate-400"
              placeholder="음성 인식을 지원하지 않는 브라우저입니다. 답변을 여기에 직접 입력해주세요."
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              aria-label="답변 입력란"
            />
          )}
        </div>

        {hasRecognitionSupport ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={isListening ? handleStopRecording : handleStartRecording}
              disabled={isSpeaking}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
                ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-500 hover:bg-cyan-600'}
                ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}
                transform hover:scale-105 shadow-lg`}
            >
              {isListening ? <StopIcon className="w-10 h-10 text-white" /> : <MicrophoneIcon className="w-10 h-10 text-white" />}
            </button>
          </div>
        ) : (
            <div className="h-24 flex items-center justify-center">
                <p className="text-yellow-400 text-center">이 브라우저는 음성 인식을 지원하지 않습니다.<br/>답변을 입력하고 '답변 완료'를 눌러주세요.</p>
            </div>
        )}
        
        {isSpeaking && <p className="text-yellow-400 text-center">질문을 읽고 있습니다. 잠시만 기다려주세요...</p>}

        <div className="flex justify-end items-center pt-4 border-t border-slate-700">
           <button 
            onClick={handleSubmit} 
            disabled={isSpeaking || (!hasRecognitionSupport && textAnswer.trim() === '')}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            답변 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewScreen;
