
import { useState, useCallback, useEffect, useRef } from 'react';

export const useSpeechSynthesis = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
        }

        // Cleanup function to cancel speech synthesis when the component unmounts
        return () => {
            if (synthRef.current && synthRef.current.speaking) {
                synthRef.current.cancel();
            }
        };
    }, []);

    const speak = useCallback((text: string) => {
        if (synthRef.current && text) {
            // Cancel any ongoing speech before starting a new one
            if (synthRef.current.speaking) {
                synthRef.current.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.volume = 1;
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (event) => {
                console.error('SpeechSynthesis Error', event);
                setIsSpeaking(false);
            };
            
            synthRef.current.speak(utterance);
        }
    }, []);

    return { isSpeaking, speak, hasSynthesisSupport: typeof window !== 'undefined' && 'speechSynthesis' in window };
};
