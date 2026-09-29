import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, CheckCircle2, ArrowRight, ArrowUpRight, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useViewportAnchor } from "../hooks/useViewportAnchor";

type DisplayMode = "hidden" | "modal" | "minimized" | "sticky-footer";

const PROMO_SESSION_KEY = "biorressonancia_promo_session_v1";
const TARGET_COURSE_URL = "/cursos/curso-intensivo-de-biorressonancia-pack-modulos-1-e-2";
const COURSE_IMAGE_URL = "https://mrlfgpdsoockzfdcrvwi.supabase.co/storage/v1/object/public/media/courses/61x9tou3eum_1789680473806.webp";
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
    const hasBeenShown = sessionStorage.getItem(PROMO_SESSION_KEY);
    if (hasBeenShown) {
      return;
    }

    const scheduleNotificationTrigger = () => {
      timerRef.current = setTimeout(() => {
        sessionStorage.setItem(PROMO_SESSION_KEY, "true");
        setDisplayMode("modal");
      }, 1500);
    };

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

  // Reexibir o widget pequeno se estiver hidden
  useEffect(() => {
    if (displayMode !== "hidden") return;

    const reappearTimer = setTimeout(() => {
      setDisplayMode(isMobile ? "sticky-footer" : "minimized");
    }, REAPPEAR_INTERVAL_MS);

    return () => clearTimeout(reappearTimer);
  }, [displayMode, isMobile]);

  // Monitorização da Page Visibility API
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setDisplayMode((current) => {
          if (current === "modal") {
            return isMobile ? "sticky-footer" : "minimized";
          }
          return current;
        });
      }
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        handleVisibility();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [isMobile]);

  // Bloqueia o scroll da página quando modal está aberto
  const isModalOpen = displayMode === "modal";
  useBodyScrollLock(isModalOpen);

  const modalLayerRef = useViewportAnchor<HTMLDivElement>(isModalOpen);

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

  return createPortal(
    <AnimatePresence>
      {/* ─── MODAL CENTRAL (DESKTOP E MOBILE) ─── */}
      {isModalOpen && (
        <div
          ref={modalLayerRef}
          className="viewport-layer z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="absolute inset-0 bg-primary/75 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-surface border border-surface-border rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90dvh] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-promo-title"
          >
            {/* Top Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-primary/70 hover:bg-primary text-white backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 shadow-lg border border-white/20"
              aria-label="Minimizar promoção"
              title="Minimizar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Image Header */}
            <div className="relative h-44 sm:h-52 w-full shrink-0 overflow-hidden bg-primary">
              <img
                src={COURSE_IMAGE_URL}
                alt="Curso Intensivo de Biorressonância"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-primary/40" />
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
              <div className="space-y-1.5">
                <h2
                  id="modal-promo-title"
                  className="text-2xl sm:text-3xl font-extrabold text-site-text tracking-tight"
                >
                  Curso Intensivo de Biorressonância
                </h2>
                
                <p className="text-sm sm:text-base font-bold text-secondary">
                  Aplicada à Prática Clínica — Módulos 1 + 2
                </p>
              </div>

              <p className="text-site-text-muted text-sm sm:text-base leading-relaxed font-normal">
                Uma formação completa, dos fundamentos à aplicação prática, para profissionais de saúde que pretendem compreender e aprofundar a Biorressonância e integrar uma abordagem mais estruturada e individualizada na sua prática clínica.
              </p>

              {/* Destaques / Pontos Fortes */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-site-text bg-surface-muted/60 p-3 rounded-xl border border-surface-border">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span><strong>Formação completa:</strong> 6 dias de formação, divididos em dois módulos complementares — online e presencial.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-site-text bg-surface-muted/60 p-3 rounded-xl border border-surface-border">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span><strong>Dos fundamentos à prática:</strong> avaliação, testagem, interpretação, definição de prioridades e personalização da abordagem.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-site-text bg-surface-muted/60 p-3 rounded-xl border border-surface-border">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span><strong>Não é necessário possuir equipamento:</strong> a formação é adequada tanto para quem já trabalha com Biorressonância como para quem pretende começar.</span>
                </div>
              </div>

              {/* Datas dos Módulos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-site-text bg-surface-muted p-3 rounded-xl border border-surface-border">
                  <Calendar className="w-4 h-4 text-secondary shrink-0" />
                  <span>Módulo 1: 14, 15 e 16 NOV 2026 | Online</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-site-text bg-surface-muted p-3 rounded-xl border border-surface-border">
                  <Calendar className="w-4 h-4 text-secondary shrink-0" />
                  <span>Módulo 2: 23, 24 e 25 JAN 2027 | Presencial - Lisboa</span>
                </div>
              </div>

              {/* Call-to-Action */}
              <div className="pt-2">
                <a
                  href={TARGET_COURSE_URL}
                  className="w-full inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-extrabold text-sm px-6 py-4 rounded-2xl shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 text-center uppercase tracking-wider"
                >
                  <span>CONHEÇA A FORMAÇÃO</span>
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
          className="fixed bottom-6 left-6 z-40 max-w-sm"
        >
          <div className="relative group bg-surface border border-surface-border shadow-xl rounded-2xl p-3.5 flex items-center gap-3 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            {/* Click area to open modal */}
            <div
              onClick={handleOpenModal}
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              title="Clique para expandir a formação"
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-surface-border bg-primary">
                <img
                  src={COURSE_IMAGE_URL}
                  alt="Curso Biorressonância"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface animate-pulse" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-site-text uppercase tracking-wide truncate">
                  CURSO INTENSIVO DE BIORRESSONÂNCIA
                </h4>
                <p className="text-[11px] text-site-text-muted truncate mt-0.5">
                  Formação Completa · Módulos 1 + 2
                </p>
                <a
                  href={TARGET_COURSE_URL}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-bold text-secondary hover:text-secondary/80 flex items-center gap-1 mt-1"
                >
                  <span>Conheça o programa</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Close Button for Minimized Widget */}
            <button
              onClick={handleClosePermanently}
              className="w-6 h-6 rounded-full hover:bg-surface-muted text-site-text-muted hover:text-site-text flex items-center justify-center shrink-0 transition-colors"
              aria-label="Fechar promoção"
              title="Fechar"
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
          className="fixed bottom-0 left-0 right-0 z-40 max-h-[22vh] bg-surface/98 backdrop-blur-xl border-t border-surface-border shadow-[0_-8px_30px_rgba(0,0,0,0.2)] p-3 pl-3.5 pr-3 flex items-center justify-between gap-2.5 overflow-hidden pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          role="region"
          aria-label="Notificação Promocional Biorressonância"
        >
          {/* Thumbnail & Title/Info */}
          <div 
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
            onClick={handleOpenModal}
          >
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-surface-border bg-primary">
              <img
                src={COURSE_IMAGE_URL}
                alt="Curso Biorressonância"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-site-text uppercase truncate leading-tight">
                CURSO INTENSIVO DE BIORRESSONÂNCIA
              </h3>
              <p className="text-[11px] text-site-text-muted truncate mt-0.5">
                Formação Completa · Módulos 1 + 2
              </p>
            </div>
          </div>

          {/* CTA Button & Permanent Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={TARGET_COURSE_URL}
              className="inline-flex items-center gap-1 bg-secondary hover:bg-secondary/90 text-white font-bold text-[11px] px-3 py-2 rounded-xl shadow-md uppercase tracking-wider transition-transform active:scale-95 text-center whitespace-nowrap"
            >
              <span>Conheça o programa</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleClosePermanently}
              className="w-7 h-7 rounded-full bg-surface-muted text-site-text-muted hover:text-site-text flex items-center justify-center transition-colors shrink-0"
              aria-label="Fechar notificação"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
