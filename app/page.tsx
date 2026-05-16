"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

type TimerMode = "work" | "shortBreak" | "longBreak";

const DEFAULT_DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function PomodoroPage() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [durations] = useState(DEFAULT_DURATIONS);

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeLeftRef = useRef(timeLeft);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      setTimeLeft(durations[newMode]);
      timeLeftRef.current = durations[newMode];
      setIsRunning(false);
    },
    [durations],
  );

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    audioRef.current?.play().catch(() => {});

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (mode === "work") {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);

      if (newSessionsCompleted % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      switchMode("work");
    }
  }, [mode, sessionsCompleted, switchMode]);

  useEffect(() => {
    onCompleteRef.current = handleTimerComplete;
  }, [handleTimerComplete]);

  useEffect(() => {
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzGH0fPTgjMGHWq+8OScTgwOUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQcxh9Hz04IzBh1qvvDknE4MDlCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC",
    );

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current === 0) {
        clearInterval(intervalRef.current!);
        onCompleteRef.current?.();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  const modeConfig = {
    work: {
      label: "Focus Time",
      color: "bg-[#D3968C]",
      textColor: "text-[#D3968C]",
    },
    shortBreak: {
      label: "Short Break",
      color: "bg-[#839958]",
      textColor: "text-[#839958]",
    },
    longBreak: {
      label: "Long Break",
      color: "bg-[#105666]",
      textColor: "text-[#105666]",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#105666] to-[#0d4552]">
      <div className="w-full max-w-md px-6">
        <div className="bg-[#F7F4D5] rounded-3xl shadow-2xl p-8">
          <div className="flex gap-2 mb-8">
            {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  mode === m
                    ? `${modeConfig[m].color} text-[#F7F4D5] shadow-lg`
                    : "bg-[#105666]/10 text-[#105666]/60 hover:bg-[#105666]/20"
                }`}>
                {modeConfig[m].label}
              </button>
            ))}
          </div>

          <div className="relative mb-8">
            <svg className="w-full h-auto -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#105666"
                strokeOpacity="0.15"
                strokeWidth="8"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                className={`${modeConfig[mode].textColor} transition-all duration-1000`}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-[#105666] tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={toggleTimer}
              className={`${modeConfig[mode].color} text-[#F7F4D5] p-6 rounded-full shadow-lg hover:scale-110 transition-transform`}>
              {isRunning ? <Pause size={32} /> : <Play size={32} />}
            </button>

            <button
              onClick={resetTimer}
              className="bg-[#105666]/20 text-[#105666] p-4 rounded-full hover:bg-[#105666]/30 transition-all">
              <RotateCcw size={24} />
            </button>
          </div>

          <div className="text-center">
            <p className="text-[#105666]/70 text-sm">Sessions completed</p>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < sessionsCompleted % 4
                      ? modeConfig.work.color
                      : "bg-[#105666]/20"
                  }`}
                />
              ))}
            </div>
            <p className="text-[#105666]/50 text-xs mt-1">
              {sessionsCompleted} total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
