'use client';

interface ConfirmTimerModalProps {
  onConfirm: () => void;
}

export default function ConfirmTimerModal({ onConfirm }: ConfirmTimerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--modal-bg-color-1)] backdrop-blur-sm" />
      <div className="relative bg-[var(--bg-color-2)] rounded-2xl shadow-2xl w-[95%] sm:w-[90%] max-w-md p-5 sm:p-8 animate-fade-in-up text-center">
        <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 animate-pulse-custom">⏲️</div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[var(--text-color-1)]">Time's Up!</h2>
        <p className="text-base sm:text-lg mb-4 sm:mb-6 text-[var(--text-color-2)]">타이머가 종료되었습니다</p>
        <button
          onClick={onConfirm}
          className="px-8 sm:px-12 py-2.5 sm:py-3 bg-gradient-to-r from-[var(--bg-color-5)] to-[#F7B628] text-white rounded-full font-semibold text-base sm:text-lg shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
        >
          확인
        </button>
      </div>
    </div>
  );
}
