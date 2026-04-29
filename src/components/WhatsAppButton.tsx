import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WHATSAPP_URL = 'https://api.whatsapp.com/send?phone=351936150690';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className}>
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.054 9.378L1.056 31.2l6.06-1.94A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0Zm9.302 22.594c-.388 1.094-1.936 2.004-3.15 2.268-.832.178-1.916.32-5.572-1.198-4.676-1.94-7.688-6.682-7.924-6.992-.226-.31-1.9-2.528-1.9-4.822s1.2-3.424 1.626-3.892c.388-.426 1.024-.64 1.634-.64.198 0 .376.02.536.036.426.018.64.044.92.714.35.838 1.2 2.92 1.304 3.134.106.214.212.498.072.798-.13.31-.248.448-.46.69-.214.244-.416.432-.628.696-.194.226-.414.468-.172.896.242.426 1.076 1.776 2.312 2.878 1.592 1.42 2.882 1.878 3.358 2.068.354.142.774.106 1.028-.162.32-.34.716-.904 1.118-1.46.284-.396.644-.446 1.032-.302.394.136 2.472 1.166 2.898 1.378.426.214.708.32.812.498.102.178.102 1.026-.286 2.12Z" />
  </svg>
);

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="whatsapp-widget" id="whatsapp-widget">
      {/* Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="whatsapp-popup"
          >
            {/* Header */}
            <div className="whatsapp-popup-header">
              <div className="whatsapp-popup-header-avatar">
                <WhatsAppIcon className="w-5 h-5" />
              </div>
              <div className="whatsapp-popup-header-info">
                <span className="whatsapp-popup-header-name">Dra. Alexandra Vasconcelos</span>
                <span className="whatsapp-popup-header-subtitle">Envie-me as suas questões e dúvidas.</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="whatsapp-popup-close"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat bubble link */}
            <div className="whatsapp-popup-body">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-chat-bubble"
              >
                <div className="whatsapp-chat-bubble-icon">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <span className="whatsapp-chat-bubble-name">Dra. Alexandra Vasconcelos</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="whatsapp-chat-bubble-arrow">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(prev => !prev)}
        className={`whatsapp-fab ${isOpen ? 'whatsapp-fab--active' : ''}`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? 'Fechar WhatsApp' : 'Abrir WhatsApp'}
        id="whatsapp-fab"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="whatsapp-fab-icon"
            >
              <X className="w-7 h-7" />
            </motion.span>
          ) : (
            <motion.span
              key="whatsapp"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="whatsapp-fab-icon"
            >
              <WhatsAppIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
