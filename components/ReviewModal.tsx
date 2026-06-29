"use client";
import { useState } from "react";
import { Star, X, CheckCircle } from "lucide-react";

interface Props {
  credits: number;
  onClose: () => void;
}

export function ReviewModal({ credits, onClose }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    // In production: send to analytics/database
    setSubmitted(true);
    setTimeout(onClose, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Tack för ditt omdöme!</h2>
            <p className="text-sm text-gray-500">Det hjälper oss att bli bättre.</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-[#1a56a0] to-[#0c447c] px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg mb-0.5">Tack för ditt köp! 🎉</h2>
                  <p className="text-sm text-white/75">{credits} uppladdningar har lagts till på ditt konto.</p>
                </div>
                <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                Hur nöjd är du med Hyresrättskollen?
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-2 mb-5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-9 w-9 transition-colors ${
                        star <= (hover || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {rating >= 4 ? "Vad uppskattar du mest?" : "Hur kan vi bli bättre?"} (valfritt)
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder={rating >= 4 ? "Berätta gärna vad du gillar..." : "Dela dina tankar med oss..."}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 text-sm text-gray-500 hover:text-gray-700 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  Hoppa över
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="flex-1 bg-[#1a56a0] hover:bg-[#0c447c] disabled:opacity-40 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Skicka omdöme
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
