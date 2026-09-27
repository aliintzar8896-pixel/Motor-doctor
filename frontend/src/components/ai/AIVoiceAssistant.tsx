import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { InitialServiceFormData } from '../emergency/EmergencyRequestModal';
import { VehicleType, ServiceSpecialty } from '../../types';
import VoiceWaveform from './VoiceWaveform';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Car,
  Phone,
  User as UserIcon,
  MapPin,
  Clock,
  Wrench,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface AIVoiceAssistantProps {
  onOpenEmergencyModal: (prefillData: InitialServiceFormData) => void;
}

type ConversationStep =
  | 'GREETING'
  | 'ASK_NAME_PHONE'
  | 'ASK_NAME'
  | 'ASK_PHONE'
  | 'ASK_VEHICLE_NUM'
  | 'ASK_VEHICLE_MODEL'
  | 'ASK_PROBLEM'
  | 'ASK_LOCATION_TIME'
  | 'CONFIRMATION'
  | 'BOOKED';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isSpokenPrompt?: boolean;
}

export const AIVoiceAssistant: React.FC<AIVoiceAssistantProps> = ({
  onOpenEmergencyModal,
}) => {
  const { currentUser, userCoords, createRequest } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);

  const [currentStep, setCurrentStep] = useState<ConversationStep>('GREETING');
  const [collectedData, setCollectedData] = useState<InitialServiceFormData>({
    userName: currentUser?.name || '',
    userPhone: currentUser?.phone || '',
    vehicleNumber: currentUser?.vehicleNumber || '',
    vehicleModel: currentUser?.vehicleModel || '',
    vehicleType: 'sedan',
    issueType: 'battery',
    description: '',
    locationName: userCoords?.address || 'Near TMU Campus Gate 2, Delhi Road, Moradabad',
    landmark: '',
  });

  const [lastBookingId, setLastBookingId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Assalam Alaikum! Welcome to Motor Doctor. Main aapki kya madad kar sakti hoon?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<ConversationStep>(currentStep);
  const collectedDataRef = useRef<InitialServiceFormData>(collectedData);

  useEffect(() => {
    stepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    collectedDataRef.current = collectedData;
  }, [collectedData]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  // Speech Synthesis Helper
  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      // Look for natural female Hindi or Indian English voice
      const hindiVoice = voices.find(
        (v) =>
          v.lang.includes('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('kalpana')
      );
      const indianVoice = voices.find(
        (v) =>
          v.lang.includes('en-IN') &&
          (v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('veena'))
      );
      const fallbackFemale = voices.find(
        (v) =>
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('victoria')
      );

      if (hindiVoice) {
        utterance.voice = hindiVoice;
      } else if (indianVoice) {
        utterance.voice = indianVoice;
      } else if (fallbackFemale) {
        utterance.voice = fallbackFemale;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // Automatically start listening for user answer if assistant is open
        if (isOpen && !isListening) {
          startListeningSafe();
        }
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  // Setup Web Speech API Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          handleUserUtterance(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition setup error:', e);
      setHasSpeechSupport(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startListeningSafe = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      // recognition might already be active
    }
  };

  const stopListeningSafe = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListeningSafe();
    } else {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      startListeningSafe();
    }
  };

  // Add Assistant Message & Speak
  const addAIMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    speakText(text);
  };

  // Add User Message
  const addUserMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Intelligent text parser for vehicle details
  const extractPhone = (text: string): string | null => {
    const match = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
    return match ? match[0].replace(/[\s-]/g, '') : null;
  };

  const extractVehiclePlate = (text: string): string | null => {
    // Matches Indian format: UP 21 BK 4092, DL 03 AB 1234, etc.
    const normalized = text.toUpperCase().replace(/[\.\-]/g, ' ');
    const match = normalized.match(
      /\b([A-Z]{2}\s*\d{1,2}\s*[A-Z]{0,3}\s*\d{3,4})\b/
    );
    if (match) {
      return match[1].replace(/\s+/g, ' ').trim();
    }
    return null;
  };

  const categorizeIssue = (
    text: string
  ): { type: ServiceSpecialty; label: string } => {
    const lower = text.toLowerCase();
    if (
      lower.includes('battery') ||
      lower.includes('jumpstart') ||
      lower.includes('start nahi') ||
      lower.includes('cell') ||
      lower.includes('self')
    ) {
      return { type: 'battery', label: 'Dead Battery Jumpstart' };
    }
    if (
      lower.includes('puncture') ||
      lower.includes('tyre') ||
      lower.includes('tire') ||
      lower.includes('flat') ||
      lower.includes('hawa')
    ) {
      return { type: 'puncture', label: 'Flat Tyre & Puncture' };
    }
    if (
      lower.includes('engine') ||
      lower.includes('heat') ||
      lower.includes('dhuan') ||
      lower.includes('smoke') ||
      lower.includes('oil') ||
      lower.includes('coolant')
    ) {
      return { type: 'engine', label: 'Engine Overheating & Smoke' };
    }
    if (
      lower.includes('tow') ||
      lower.includes('crane') ||
      lower.includes('pull') ||
      lower.includes('accident') ||
      lower.includes('khinch')
    ) {
      return { type: 'towing', label: 'Hydraulic Flatbed Towing' };
    }
    if (
      lower.includes('brake') ||
      lower.includes('clutch') ||
      lower.includes('gear')
    ) {
      return { type: 'brake', label: 'Brake / Clutch Failure' };
    }
    if (
      lower.includes('fuel') ||
      lower.includes('petrol') ||
      lower.includes('diesel') ||
      lower.includes('oil khatam')
    ) {
      return { type: 'fuel', label: 'Emergency Fuel Delivery' };
    }
    return { type: 'battery', label: 'Roadside Breakdown Assistance' };
  };

  // Main Conversational State Machine
  const handleUserUtterance = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    addUserMessage(text);
    setTranscript('');
    stopListeningSafe();

    const lower = text.toLowerCase();
    const current = stepRef.current;
    const currentData = { ...collectedDataRef.current };

    // STEP 0: Initial Greeting Response
    if (current === 'GREETING') {
      if (
        lower.includes('kharab') ||
        lower.includes('breakdown') ||
        lower.includes('puncture') ||
        lower.includes('battery') ||
        lower.includes('help') ||
        lower.includes('madad') ||
        lower.includes('problem') ||
        lower.includes('vehicle') ||
        lower.includes('car') ||
        lower.includes('bike')
      ) {
        // Required exact prompt:
        // "Koi baat nahi! Main aapki madad karti hoon. Sabse pehle mujhe aapka poora naam aur contact number bata dijiye."
        setCurrentStep('ASK_NAME_PHONE');
        addAIMessage(
          'Koi baat nahi! Main aapki madad karti hoon. Sabse pehle mujhe aapka poora naam aur contact number bata dijiye.'
        );
      } else {
        addAIMessage(
          'Assalam Alaikum! Agar aapki gaadi highway par kharab ho gayi hai toh batayein, main turant mechanic dispatch kar dungi.'
        );
      }
      return;
    }

    // STEP 1: Full Name and Contact Number
    if (current === 'ASK_NAME_PHONE') {
      const detectedPhone = extractPhone(text);
      let nameCandidate = text;

      if (detectedPhone) {
        nameCandidate = text.replace(detectedPhone, '').trim();
      }

      // Filter out conversational words from name
      nameCandidate = nameCandidate
        .replace(
          /(mera naam|naam hai|my name is|i am|this is|call me|aur|number hai|phone)/gi,
          ''
        )
        .replace(/[,.-]/g, '')
        .trim();

      if (nameCandidate.length > 1) {
        currentData.userName = nameCandidate;
      }
      if (detectedPhone) {
        currentData.userPhone = detectedPhone;
      }

      setCollectedData(currentData);

      if (!currentData.userName && !currentData.userPhone) {
        addAIMessage('Kripya apna poora naam aur 10-digit mobile number bataiye.');
        return;
      }

      if (!currentData.userName) {
        setCurrentStep('ASK_NAME');
        addAIMessage('Shukriya! Kripya apna poora naam bhi bata dijiye.');
        return;
      }

      if (!currentData.userPhone) {
        setCurrentStep('ASK_PHONE');
        addAIMessage(
          `Shukriya ${currentData.userName} ji! Ab apna 10-digit mobile number bata dijiye taaki mechanic aapko call kar sake.`
        );
        return;
      }

      // Both name and phone collected -> Next: Vehicle Registration Number
      setCurrentStep('ASK_VEHICLE_NUM');
      addAIMessage(
        `Bahut khoob ${currentData.userName} ji! Aapki gaadi ka registration number kya hai? (Jaise UP 21 BK 4092 ya DL 3C AB 1234)`
      );
      return;
    }

    if (current === 'ASK_NAME') {
      const cleanName = text
        .replace(/(mera naam|my name is|i am)/gi, '')
        .trim();
      currentData.userName = cleanName || text;
      setCollectedData(currentData);

      if (!currentData.userPhone) {
        setCurrentStep('ASK_PHONE');
        addAIMessage('Shukriya! Ab apna contact number bata dijiye.');
      } else {
        setCurrentStep('ASK_VEHICLE_NUM');
        addAIMessage(
          `Dhanyawad ${currentData.userName} ji! Aapki gaadi ka registration number kya hai?`
        );
      }
      return;
    }

    if (current === 'ASK_PHONE') {
      const detectedPhone = extractPhone(text) || text.replace(/\D/g, '');
      if (detectedPhone.length >= 10) {
        currentData.userPhone = detectedPhone;
        setCollectedData(currentData);

        setCurrentStep('ASK_VEHICLE_NUM');
        addAIMessage(
          'Mobile number note ho gaya. Ab kripya apni gaadi ka registration number bata dijiye (Jaise UP 21 BK 4092).'
        );
      } else {
        addAIMessage('Kripya valid 10-digit mobile number share karein.');
      }
      return;
    }

    // STEP 3: Vehicle Registration Number
    if (current === 'ASK_VEHICLE_NUM') {
      const plate = extractVehiclePlate(text) || text.toUpperCase().trim();
      currentData.vehicleNumber = plate;
      setCollectedData(currentData);

      setCurrentStep('ASK_VEHICLE_MODEL');
      addAIMessage(
        `Vehicle number ${plate} record ho gaya hai. Aapki gaadi ka make aur model kya hai? (Jaise Hyundai Creta, Maruti Swift, ya koi aur)`
      );
      return;
    }

    // STEP 4: Vehicle Make & Model
    if (current === 'ASK_VEHICLE_MODEL') {
      const model = text.replace(/(meri gaadi|car hai|model is|make)/gi, '').trim();
      currentData.vehicleModel = model || 'Car';

      // Infer vehicle type
      if (
        lower.includes('bike') ||
        lower.includes('scooter') ||
        lower.includes('bullet') ||
        lower.includes('activa') ||
        lower.includes('motorcycle')
      ) {
        currentData.vehicleType = 'bike';
      } else if (
        lower.includes('suv') ||
        lower.includes('creta') ||
        lower.includes('scorpio') ||
        lower.includes('harrier') ||
        lower.includes('safari')
      ) {
        currentData.vehicleType = 'suv';
      } else if (
        lower.includes('truck') ||
        lower.includes('commercial') ||
        lower.includes('pickup')
      ) {
        currentData.vehicleType = 'commercial';
      } else {
        currentData.vehicleType = 'sedan';
      }

      setCollectedData(currentData);

      setCurrentStep('ASK_PROBLEM');
      addAIMessage(
        `${currentData.vehicleModel} note kar liya. Gaadi mein kya samasya ya problem aa rahi hai? (Jaise puncture, battery dead, engine heating, towing ya fuel khatam)`
      );
      return;
    }

    // STEP 5: Vehicle Problem
    if (current === 'ASK_PROBLEM') {
      const issue = categorizeIssue(text);
      currentData.issueType = issue.type;
      currentData.description = text;
      setCollectedData(currentData);

      setCurrentStep('ASK_LOCATION_TIME');
      addAIMessage(
        `Samasya: "${issue.label}" note ho gayi hai. Aapki current location ya landmark kya hai? Aur kya aapko turant immediate assistance chahiye?`
      );
      return;
    }

    // STEP 6: Service Location and Time
    if (current === 'ASK_LOCATION_TIME') {
      currentData.locationName = text || userCoords.address;
      setCollectedData(currentData);

      setCurrentStep('CONFIRMATION');
      // Format review and ask explicit confirmation
      const confirmationSpeech = `Aapki details hain: Naam - ${currentData.userName}, Mobile - ${currentData.userPhone}, Gaadi - ${currentData.vehicleModel} (${currentData.vehicleNumber}), Samasya - ${currentData.description || currentData.issueType}, Location - ${currentData.locationName}. Kya main yeh service request confirm karke mechanic dispatch kar doon?`;
      addAIMessage(confirmationSpeech);
      return;
    }

    // STEP 7: Confirmation
    if (current === 'CONFIRMATION') {
      if (
        lower.includes('haan') ||
        lower.includes('yes') ||
        lower.includes('confirm') ||
        lower.includes('kar do') ||
        lower.includes('theek hai') ||
        lower.includes('dispatch') ||
        lower.includes('ok') ||
        lower.includes('sure')
      ) {
        executeConfirmedBooking(currentData);
      } else if (
        lower.includes('nahi') ||
        lower.includes('no') ||
        lower.includes('change') ||
        lower.includes('edit')
      ) {
        addAIMessage(
          'Koi baat nahi! Aap neeche Form Preview me details edit kar sakte hain ya "Open Form" par click karke original form me check kar sakte hain.'
        );
      } else {
        addAIMessage(
          'Kripya "Haan / Confirm" bolein taaki main verified mechanic ko alert bhej sakoon, ya details check karein.'
        );
      }
      return;
    }

    // STEP 8: Post-booking
    if (current === 'BOOKED') {
      if (lower.includes('new') || lower.includes('dusri') || lower.includes('dobara')) {
        resetConversation();
      } else {
        addAIMessage(
          `Aapka request already confirmed hai (ID: ${lastBookingId}). Mechanic raste mein hai. Aap dashboard par live tracking dekh sakte hain.`
        );
      }
    }
  };

  // Submit Confirmed Service Request
  const executeConfirmedBooking = (formData: InitialServiceFormData) => {
    try {
      const newReq = createRequest({
        userName: formData.userName || 'Vehicle Owner',
        userPhone: formData.userPhone || '+91 9368121012',
        vehicleType: formData.vehicleType || 'sedan',
        vehicleModel: formData.vehicleModel || 'Car',
        vehicleNumber: formData.vehicleNumber || 'Unregistered',
        issueType: formData.issueType || 'battery',
        urgency: 'urgent',
        description: formData.description || 'Highway breakdown request',
        locationName: formData.locationName || userCoords.address,
        landmark: formData.landmark || '',
        paymentMethod: 'cash',
        paymentStatus: 'pay_on_delivery',
      });

      setLastBookingId(newReq.id);
      setCurrentStep('BOOKED');

      const successSpeech = `Aapki booking successfully ho gayi hai! Request ID ${newReq.id}. Hamare verified mechanic ko alert bhej diya gaya hai aur admin Intzar Ali ko confirmation email notification bhej di gayi hai.`;
      addAIMessage(successSpeech);
      toast.success(`Booking Confirmed! Request ID: ${newReq.id}`);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      toast.error('Booking submission failed. Please try again.');
      addAIMessage(
        'Maaf kijiye, booking process karne mein samasya aayi. Kripya manual form use karein.'
      );
    }
  };

  const resetConversation = () => {
    setCurrentStep('GREETING');
    setLastBookingId(null);
    setMessages([
      {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Assalam Alaikum! Welcome to Motor Doctor. Main aapki kya madad kar sakti hoon?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    addAIMessage('Assalam Alaikum! Welcome to Motor Doctor. Main aapki kya madad kar sakti hoon?');
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    handleUserUtterance(text);
  };

  // Open modal and initialize initial voice greeting on first open
  const handleOpenAssistant = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (messages.length === 1 && currentStep === 'GREETING') {
      speakText(messages[0].text);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Matches Motor Doctor dark cyber theme) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xl backdrop-blur-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Voice Doctor • Bol kar book karein</span>
          </div>

          <button
            onClick={handleOpenAssistant}
            aria-label="Open Motor Doctor AI Voice Assistant"
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-red-600 via-amber-600 to-amber-400 text-white shadow-2xl shadow-red-600/40 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20"
          >
            {/* Animated Pulse Rings */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 to-amber-500 opacity-60 blur-sm group-hover:opacity-100 transition-opacity animate-pulse"></span>

            <div className="relative flex items-center justify-center">
              <Mic className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform" />
            </div>

            {/* Online Indicator Badge */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </button>
        </div>
      )}

      {/* Floating Assistant Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out ${
            isMinimized
              ? 'bottom-6 right-6 w-72'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] max-h-[85vh] h-[640px]'
          } flex flex-col rounded-3xl glass-panel border border-amber-500/30 shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-2xl`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-slate-900/90 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                <Mic className="w-5 h-5" />
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white tracking-tight">
                    Motor Doctor AI
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase">
                    Voice Assistant
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isListening
                        ? 'bg-red-500 animate-ping'
                        : isSpeaking
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span>
                    {isListening
                      ? 'Listening to you...'
                      : isSpeaking
                      ? 'AI Speaking (Female Voice)...'
                      : 'Multilingual Voice Ready'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Mute/Unmute Voice Audio */}
              <button
                onClick={() => {
                  if (!isMuted && isSpeaking) {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                  }
                  setIsMuted(!isMuted);
                }}
                title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                )}
              </button>

              {/* Minimize */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isMinimized ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Close */}
              <button
                onClick={() => {
                  stopListeningSafe();
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Audio Waveform Bar Indicator */}
              <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <VoiceWaveform
                    isActive={isListening}
                    isSpeaking={isSpeaking}
                    color={isListening ? 'red' : isSpeaking ? 'amber' : 'emerald'}
                    size="sm"
                  />
                  <span className="text-[11px] font-semibold text-slate-300">
                    {isListening
                      ? 'Listening... Speak now'
                      : isSpeaking
                      ? 'Speaking in Hindi / English...'
                      : 'Hindi • Hinglish • English Supported'}
                  </span>
                </div>

                <button
                  onClick={resetConversation}
                  title="Restart Conversation"
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-400 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restart</span>
                </button>
              </div>

              {/* Chat Message List */}
              <div
                ref={chatScrollRef}
                className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-semibold shadow-md rounded-tr-none'
                          : 'bg-slate-900 border border-slate-700/80 text-slate-100 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}

                {/* Real-time Interim Voice Transcript */}
                {isListening && transcript && (
                  <div className="flex flex-col items-end">
                    <div className="max-w-[85%] rounded-2xl p-2.5 bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs italic animate-pulse">
                      "{transcript}..."
                    </div>
                  </div>
                )}

                {/* Live Form Sync Review Card (When user provides details) */}
                {(collectedData.userName ||
                  collectedData.userPhone ||
                  collectedData.vehicleNumber) && (
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-lg space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Live Form Auto-Sync (Connected to Original Form)</span>
                      </div>
                      <button
                        onClick={() => onOpenEmergencyModal(collectedData)}
                        className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline"
                      >
                        <span>Open Full Form</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">
                          Customer Name
                        </span>
                        <span className="text-white font-semibold">
                          {collectedData.userName || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">
                          Phone Number
                        </span>
                        <span className="text-white font-semibold">
                          {collectedData.userPhone || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">
                          Vehicle Plate
                        </span>
                        <span className="text-amber-400 font-bold font-mono">
                          {collectedData.vehicleNumber || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">
                          Vehicle Model
                        </span>
                        <span className="text-white font-semibold">
                          {collectedData.vehicleModel || '—'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">
                          Problem / Issue
                        </span>
                        <span className="text-red-400 font-medium">
                          {collectedData.description || collectedData.issueType || 'Breakdown'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">
                          Breakdown Location
                        </span>
                        <span className="text-slate-200">
                          {collectedData.locationName || 'Highway Corridor'}
                        </span>
                      </div>
                    </div>

                    {/* Explicit Confirmation Action Button */}
                    {currentStep === 'CONFIRMATION' && (
                      <div className="pt-2 border-t border-slate-800 flex gap-2">
                        <button
                          type="button"
                          onClick={() => executeConfirmedBooking(collectedData)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm & Dispatch Mechanic</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEmergencyModal(collectedData)}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    )}

                    {currentStep === 'BOOKED' && lastBookingId && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-bold text-xs">
                        ✅ Dispatched Successfully! ID: {lastBookingId}
                        <div className="text-[10px] font-normal text-emerald-200 mt-0.5">
                          Admin notification sent to aliintzar8896@gmail.com
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-4 py-1.5 bg-slate-950/60 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                {currentStep === 'GREETING' && (
                  <>
                    <button
                      onClick={() => handleUserUtterance('Meri vehicle kharab ho gayi hai.')}
                      className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
                    >
                      "Meri vehicle kharab ho gayi hai."
                    </button>
                    <button
                      onClick={() => handleUserUtterance('Car puncture ho gayi hai.')}
                      className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
                    >
                      "Car puncture ho gayi hai."
                    </button>
                  </>
                )}

                {currentStep === 'CONFIRMATION' && (
                  <>
                    <button
                      onClick={() => handleUserUtterance('Haan confirm kar do')}
                      className="px-3 py-1 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500 whitespace-nowrap font-bold transition-colors"
                    >
                      "Haan, confirm kar do"
                    </button>
                    <button
                      onClick={() => onOpenEmergencyModal(collectedData)}
                      className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
                    >
                      "Review in Original Form"
                    </button>
                  </>
                )}

                {currentStep === 'ASK_LOCATION_TIME' && (
                  <button
                    onClick={() =>
                      handleUserUtterance(
                        'Near TMU Campus Gate 2, Delhi Road, Moradabad. Urgent help chahiye.'
                      )
                    }
                    className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
                  >
                    📍 Use TMU Campus Gate 2 Landmark
                  </button>
                )}
              </div>

              {/* Bottom Control Bar: Big Mic + Text Input Fallback */}
              <div className="p-3 bg-slate-900 border-t border-slate-800">
                <form
                  onSubmit={handleTextSubmit}
                  className="flex items-center gap-2"
                >
                  {/* Microphone Action Button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`relative p-3 rounded-2xl flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
                        : 'bg-gradient-to-r from-red-600 to-amber-500 text-white hover:opacity-90 shadow-md'
                    }`}
                    title={isListening ? 'Stop Listening' : 'Speak into Microphone'}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5 animate-pulse" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>

                  {/* Fallback Text Input */}
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      isListening
                        ? 'Listening to your voice...'
                        : 'Bol kar ya type karke batayein...'
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIVoiceAssistant;
