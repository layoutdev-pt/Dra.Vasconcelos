import { useEffect } from 'react';

/**
 * Bloqueia o scroll da página enquanto um modal está aberto.
 *
 * `document.body.style.overflow = 'hidden'` não é fiável no Safari iOS
 * (o utilizador continua a arrastar a página por baixo do modal), por isso
 * fixamos o body na posição actual e repomos o scroll ao fechar.
 *
 * Usa um contador global para suportar vários modais em simultâneo.
 */

let lockCount = 0;
let savedScrollY = 0;
let savedStyles: { position: string; top: string; left: string; right: string; width: string; overflow: string; paddingRight: string } | null = null;

const applyLock = () => {
  const { body } = document;
  savedScrollY = window.scrollY || window.pageYOffset || 0;
  savedStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
  };

  // Compensa o desaparecimento da scrollbar (desktop) para não haver salto horizontal
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
};

const releaseLock = () => {
  const { body } = document;
  if (savedStyles) {
    body.style.position = savedStyles.position;
    body.style.top = savedStyles.top;
    body.style.left = savedStyles.left;
    body.style.right = savedStyles.right;
    body.style.width = savedStyles.width;
    body.style.overflow = savedStyles.overflow;
    body.style.paddingRight = savedStyles.paddingRight;
    savedStyles = null;
  }
  window.scrollTo(0, savedScrollY);
};

export const useBodyScrollLock = (active: boolean) => {
  useEffect(() => {
    if (!active) return;

    lockCount += 1;
    if (lockCount === 1) applyLock();

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) releaseLock();
    };
  }, [active]);
};
