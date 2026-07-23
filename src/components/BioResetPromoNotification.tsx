import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, Sparkles, ArrowRight, ShieldCheck, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import bioResetCapa from "../assets/images/BioReset_setembro/Capa.png";
import bioResetPost from "../assets/images/BioReset_setembro/Post.png";
import bioResetStorie from "../assets/images/BioReset_setembro/Storie.png";

type DisplayMode = "hidden" | "modal" | "minimized" | "sticky-footer";

const PROMO_SESSION_KEY = "bioreset_promo_session_v1";
const TARGET_COURSE_URL = "https://www.draalexandravasconcelos.pt/cursos/bioreset";
const REAPPEAR_INTERVAL_MS = 45000; // Tempo em ms (45s) para reexibir o nonmodal pequeno

export const BioResetPromoNotification: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("hidden");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Monitor viewport size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };

    checkMobile();

    const handleResize = () => {
      const mobile = checkMobile();
      setDisplayMode((currentMode) => {
        if (mobile && currentMode === "minimized") {
          return "sticky-footer";
        }
        if (!mobile && currentMode === "sticky-footer") {
          return "minimized";
        }
        return currentMode;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle initial load event + delay timing strictly per requirements
  useEffect(() => {
    // Check if promo has already been presented during this user session
    const hasBeenShown = sessionStorage.getItem(PROMO_SESSION_KEY);
    if (hasBeenShown) {
      return;
    }

    const scheduleNotificationTrigger = () => {
      // Delay of 3000ms (within 2500ms - 3500ms range) AFTER window load / DOM complete
      timerRef.current = setTimeout(() => {
        sessionStorage.setItem(PROMO_SESSION_KEY, "true");
        setDisplayMode("modal");
      }, 3000);
    };

    // Escutar o evento window.onload ou verificar se o DOM já está completamente carregado
    if (document.readyState === "complete") {
      scheduleNotificationTrigger();
    } else {
      const handleLoad = () => {
        scheduleNotificationTrigger();
        window.removeEventListener("load", handleLoad);
      };
      window.addEventListener("load", handleLoad);

      return () => {
        window.removeEventListener("load", handleLoad);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, []);

  // Função para reexibir o nonmodal pequeno de X em X tempo quando estiver escondido
  useEffect(() => {
    if (displayMode !== "hidden") return;

    const reappearTimer = setTimeout(() => {
      setDisplayMode(isMobile ? "sticky-footer" : "minimized");
    }, REAPPEAR_INTERVAL_MS);

    return () => clearTimeout(reappearTimer);
  }, [displayMode, isMobile]);

  const handleCloseModal = () => {
    setDisplayMode(isMobile ? "sticky-footer" : "minimized");
  };

  const handleOpenModal = () => {
    setDisplayMode("modal");
  };

  const handleClosePermanently = () => {
    setDisplayMode("hidden");
  };

  if (displayMode === "hidden") return null;

  return (
    <AnimatePresence>
      {/* ─── MODAL CENTRAL (DESKTOP E MOBILE) ─── */}
      {displayMode === "modal" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 bg-primary/70 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-surface border border-surface-border rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-promo-title"
          >
            {/* Top Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-primary/60 hover:bg-primary text-white backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 shadow-lg border border-white/20"
              aria-label="Minimizar promoção"
              title="Minimizar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Image Header */}
            <div className={`relative w-full overflow-hidden bg-primary ${isMobile ? "aspect-[4/5] max-h-[40vh]" : "h-48 sm:h-56"}`}>
              <img
                src={isMobile ? bioResetStorie : bioResetCapa}
                alt="BioReset 14 Dias"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-primary/40" />
              
              {/* Badge
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                7.ª Edição Especial
              </div> */}
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="space-y-2">
                <h2
                  id="modal-promo-title"
                  className="text-2xl sm:text-3xl font-extrabold text-site-text tracking-tight flex items-center gap-2"
                >
                  BioReset®️ 14 Dias
                </h2>
                
                {/* Trecho com fundo --color-primary conforme pedido */}
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-primary px-3.5 py-1.5 rounded-full border border-primary/20 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-secondary-light" />
                  <span>7.ª Edição Especial de Outono 🍂</span>
                </div>
              </div>

              <p className="text-site-text-muted text-base leading-relaxed font-normal">
                Prepare o seu corpo para a nova estação e recupere a sua vitalidade, com a orientação da Dra. Alexandra Vasconcelos. Vagas limitadas — esgotam sempre.
              </p>

              {/* Destaques do Curso */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs font-medium text-site-text bg-surface-muted p-2.5 rounded-xl border border-surface-border">
                  <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
                  <span>Acompanhamento Diário</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-site-text bg-surface-muted p-2.5 rounded-xl border border-surface-border">
                  <Sparkles className="w-4 h-4 text-secondary shrink-0" />
                  <span>4 Sessões Online de Apoio</span>
                </div>
              </div>

              {/* Call-to-Action */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={TARGET_COURSE_URL}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-extrabold text-sm px-6 py-4 rounded-2xl shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 text-center uppercase tracking-wider"
                >
                  <span>QUERO GARANTIR A MINHA VAGA</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── DESKTOP MINIMIZED WIDGET (NON-MODAL PERSISTENTE) ─── */}
      {!isMobile && displayMode === "minimized" && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.8 }}
          className="fixed bottom-6 left-6 z-40 max-w-xs"
        >
          <div className="relative group bg-surface border border-surface-border shadow-xl rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            {/* Click area to open modal */}
            <div
              onClick={handleOpenModal}
              className="flex items-center gap-3 flex-1 min-w-0"
              title="Clique para expandir a promoção"
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-surface-border">
                <img
                  src={bioResetPost}
                  alt="BioReset Promo"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface animate-pulse" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-secondary uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  BioReset®️ 14 Dias
                </div>
                <h4 className="text-xs font-bold text-site-text truncate">
                  7.ª Edição Especial de Outono 🍂
                </h4>
                <p className="text-[10px] text-site-text-muted flex items-center gap-1 mt-0.5">
                  <span>Clique para ver</span>
                  <Maximize2 className="w-2.5 h-2.5 text-secondary" />
                </p>
              </div>
            </div>

            {/* Close Button for Minimized Widget */}
            <button
              onClick={handleClosePermanently}
              className="w-6 h-6 rounded-full hover:bg-surface-muted text-site-text-muted hover:text-site-text flex items-center justify-center shrink-0 transition-colors"
              aria-label="Fechar promoção"
              title="Fechar promoção"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ─── MOBILE STICKY FOOTER (BARRA FIXA SEM MODAIS - ANTI INTERSTITIAL) ─── */}
      {isMobile && displayMode === "sticky-footer" && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="fixed bottom-0 left-0 right-0 z-40 max-h-[20vh] bg-surface/98 backdrop-blur-xl border-t border-surface-border shadow-[0_-8px_30px_rgba(0,0,0,0.2)] p-3 pl-3.5 pr-20 sm:pr-24 flex items-center justify-between gap-2.5 overflow-hidden pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          role="region"
          aria-label="Notificação Promocional BioReset"
        >
          {/* Thumbnail & Title/Info */}
          <div 
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
            onClick={handleOpenModal}
          >
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-surface-border bg-primary">
              <img
                src={bioResetStorie}
                alt="BioReset"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0" />
                <h3 className="text-xs font-bold text-site-text truncate leading-tight">
                  BioReset®️ 14 Dias
                </h3>
              </div>
              <p className="text-[11px] text-site-text-muted truncate mt-0.5">
                7.ª Edição Especial de Outono 🍂
              </p>
            </div>
          </div>

          {/* CTA Button & Permanent Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={TARGET_COURSE_URL}
              className="bg-secondary hover:bg-secondary/90 text-white font-extrabold text-[11px] px-3.5 py-2.5 rounded-xl shadow-md uppercase tracking-wider transition-transform active:scale-95 text-center whitespace-nowrap"
            >
              GARANTIR VAGA
            </a>

            <button
              onClick={handleClosePermanently}
              className="w-8 h-8 rounded-full bg-surface-muted text-site-text-muted hover:text-site-text flex items-center justify-center transition-colors shrink-0"
              aria-label="Fechar notificação promocional"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
