import { useState, useEffect, useCallback, useRef } from 'react';

interface MLWorkerMessage {
  type: string;
  data?: any;
  results?: any;
  error?: string;
  modelName?: string;
  message?: string;
}

interface MLWorkerHook {
  isReady: boolean;
  isProcessing: boolean;
  loadedModels: string[];
  error: string | null;
  results: any;
  processAcademicAnalysis: (data: any) => Promise<any>;
  processBehavioralAnalysis: (data: any) => Promise<any>;
  processCareerAnalysis: (data: any) => Promise<any>;
  loadModel: (modelName: string, modelUrl: string) => Promise<void>;
  getWorkerStatus: () => void;
}

export function useMLWorker(): MLWorkerHook {
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadedModels, setLoadedModels] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  
  const workerRef = useRef<Worker | null>(null);
  const pendingCallbacks = useRef<Map<string, (data: any) => void>>(new Map());

  useEffect(() => {
    // Initialize worker
    if (typeof Worker !== 'undefined') {
      workerRef.current = new Worker('/workers/tensorflow-worker.js');
      
      workerRef.current.onmessage = (e: MessageEvent<MLWorkerMessage>) => {
        const { type, data, results, error, modelName, message } = e.data;
        
        switch (type) {
          case 'TENSORFLOW_READY':
            setIsReady(true);
            setError(null);
            console.log('TensorFlow.js Worker initialized');
            break;
            
          case 'TENSORFLOW_ERROR':
            setError(error || 'TensorFlow initialization failed');
            setIsReady(false);
            break;
            
          case 'MODEL_LOADING':
            console.log(`Loading model: ${modelName}`);
            break;
            
          case 'MODEL_LOADED':
            setLoadedModels(prev => [...prev, modelName!]);
            console.log(`Model loaded: ${modelName}`);
            break;
            
          case 'MODEL_ERROR':
            setError(`Failed to load model: ${modelName} - ${error}`);
            break;
            
          case 'ACADEMIC_ANALYSIS_COMPLETE':
            setIsProcessing(false);
            setResults(results);
            const academicCallback = pendingCallbacks.current.get('academic');
            if (academicCallback) {
              academicCallback(results);
              pendingCallbacks.current.delete('academic');
            }
            break;
            
          case 'BEHAVIORAL_ANALYSIS_COMPLETE':
            setIsProcessing(false);
            setResults(results);
            const behavioralCallback = pendingCallbacks.current.get('behavioral');
            if (behavioralCallback) {
              behavioralCallback(results);
              pendingCallbacks.current.delete('behavioral');
            }
            break;
            
          case 'CAREER_ANALYSIS_COMPLETE':
            setIsProcessing(false);
            setResults(results);
            const careerCallback = pendingCallbacks.current.get('career');
            if (careerCallback) {
              careerCallback(results);
              pendingCallbacks.current.delete('career');
            }
            break;
            
          case 'ACADEMIC_ANALYSIS_ERROR':
          case 'BEHAVIORAL_ANALYSIS_ERROR':
          case 'CAREER_ANALYSIS_ERROR':
            setIsProcessing(false);
            setError(error || 'Analysis failed');
            break;
            
          case 'WORKER_STATUS':
            setLoadedModels(data.loadedModels);
            setIsReady(data.isInitialized);
            break;
            
          default:
            console.warn('Unknown worker message type:', type);
        }
      };
      
      workerRef.current.onerror = (error) => {
        setError(`Worker error: ${error.message}`);
        setIsReady(false);
      };
      
      // Initialize TensorFlow in worker
      workerRef.current.postMessage({ type: 'INITIALIZE_TENSORFLOW' });
    } else {
      setError('Web Workers not supported in this browser');
    }
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const processAcademicAnalysis = useCallback(async (data: any): Promise<any> => {
    if (!workerRef.current || !isReady) {
      throw new Error('Worker not ready');
    }
    
    return new Promise((resolve, reject) => {
      setIsProcessing(true);
      setError(null);
      
      pendingCallbacks.current.set('academic', resolve);
      
      workerRef.current!.postMessage({
        type: 'PROCESS_ACADEMIC_ANALYSIS',
        data
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (pendingCallbacks.current.has('academic')) {
          pendingCallbacks.current.delete('academic');
          setIsProcessing(false);
          reject(new Error('Academic analysis timeout'));
        }
      }, 30000);
    });
  }, [isReady]);

  const processBehavioralAnalysis = useCallback(async (data: any): Promise<any> => {
    if (!workerRef.current || !isReady) {
      throw new Error('Worker not ready');
    }
    
    return new Promise((resolve, reject) => {
      setIsProcessing(true);
      setError(null);
      
      pendingCallbacks.current.set('behavioral', resolve);
      
      workerRef.current!.postMessage({
        type: 'PROCESS_BEHAVIORAL_ANALYSIS',
        data
      });
      
      setTimeout(() => {
        if (pendingCallbacks.current.has('behavioral')) {
          pendingCallbacks.current.delete('behavioral');
          setIsProcessing(false);
          reject(new Error('Behavioral analysis timeout'));
        }
      }, 30000);
    });
  }, [isReady]);

  const processCareerAnalysis = useCallback(async (data: any): Promise<any> => {
    if (!workerRef.current || !isReady) {
      throw new Error('Worker not ready');
    }
    
    return new Promise((resolve, reject) => {
      setIsProcessing(true);
      setError(null);
      
      pendingCallbacks.current.set('career', resolve);
      
      workerRef.current!.postMessage({
        type: 'PROCESS_CAREER_ANALYSIS',
        data
      });
      
      setTimeout(() => {
        if (pendingCallbacks.current.has('career')) {
          pendingCallbacks.current.delete('career');
          setIsProcessing(false);
          reject(new Error('Career analysis timeout'));
        }
      }, 30000);
    });
  }, [isReady]);

  const loadModel = useCallback(async (modelName: string, modelUrl: string): Promise<void> => {
    if (!workerRef.current || !isReady) {
      throw new Error('Worker not ready');
    }
    
    workerRef.current.postMessage({
      type: 'LOAD_MODEL',
      data: { modelName, modelUrl }
    });
  }, [isReady]);

  const getWorkerStatus = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'GET_WORKER_STATUS' });
    }
  }, []);

  return {
    isReady,
    isProcessing,
    loadedModels,
    error,
    results,
    processAcademicAnalysis,
    processBehavioralAnalysis,
    processCareerAnalysis,
    loadModel,
    getWorkerStatus
  };
}
