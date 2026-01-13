import { useState, useRef, useCallback } from 'react';
import TFLiteService, { CONFIDENCE_THRESHOLD, STABILITY_FRAMES } from '../services/TFLiteService';

interface DetectionResult {
  letter: string;
  confidence: number;
  translatedText: string;
}

export const useHandSignDetection = () => {
  const [translatedText, setTranslatedText] = useState<string>('');
  const [currentLetter, setCurrentLetter] = useState<string>('');
  const [currentConfidence, setCurrentConfidence] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Stability tracking
  const predictionBuffer = useRef<string[]>([]);
  const lastConfirmedLetter = useRef<string>('');

  const processFrame = useCallback(
    async (imageData: Uint8Array, width: number, height: number): Promise<void> => {
      if (isProcessing) return;

      setIsProcessing(true);

      try {
        const result = await TFLiteService.predict(imageData, width, height);

        if (result) {
          const { letter, confidence } = result;

          setCurrentLetter(letter);
          setCurrentConfidence(confidence);

          // Stability filtering logic (matching Python implementation)
          if (confidence > CONFIDENCE_THRESHOLD) {
            // Add to prediction buffer
            predictionBuffer.current.push(letter);

            // Keep buffer at STABILITY_FRAMES size
            if (predictionBuffer.current.length > STABILITY_FRAMES) {
              predictionBuffer.current.shift();
            }

            // Check if all predictions in buffer are the same
            if (
              predictionBuffer.current.length === STABILITY_FRAMES &&
              new Set(predictionBuffer.current).size === 1
            ) {
              const confirmedLetter = predictionBuffer.current[0];

              // Only add if different from last confirmed letter
              if (confirmedLetter !== lastConfirmedLetter.current) {
                setTranslatedText((prev) => prev + confirmedLetter);
                lastConfirmedLetter.current = confirmedLetter;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing frame:', error);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing]
  );

  const clearText = useCallback(() => {
    setTranslatedText('');
    predictionBuffer.current = [];
    lastConfirmedLetter.current = '';
  }, []);

  const deleteLastCharacter = useCallback(() => {
    setTranslatedText((prev) => prev.slice(0, -1));
  }, []);

  const addSpace = useCallback(() => {
    setTranslatedText((prev) => prev + ' ');
    lastConfirmedLetter.current = ' ';
  }, []);

  return {
    translatedText,
    currentLetter,
    currentConfidence,
    isProcessing,
    processFrame,
    clearText,
    deleteLastCharacter,
    addSpace,
  };
};
