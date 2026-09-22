import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * Garante que um elemento `position: fixed` fica mesmo colado ao ecrã do
 * utilizador (viewport) e não a meio da página.
 *
 * Porquê: basta que um antepassado (incluindo <html> ou <body>) tenha
 * `filter`, `backdrop-filter`, `transform`, `perspective` ou `will-change`
 * para deixar de ser o viewport a servir de referência ao `position: fixed`
 * e passar a ser esse antepassado — que tem a altura da página inteira.
 * É exactamente o que fazem as extensões/apps de modo escuro
 * (Dark Reader, Noir, etc.) ao aplicarem `filter: invert(...)` no <html>.
 *
 * Como: medimos o elemento depois de montado; se não estiver no canto
 * superior esquerdo do ecrã, corrigimos com um `translate` equivalente.
 * Em condições normais a correcção é zero e nada acontece.
 */
export const useViewportAnchor = <T extends HTMLElement>(active: boolean) => {
  const ref = useRef<T | null>(null);

  const correct = useCallback(() => {
    const node = ref.current;
    if (!node) return;

    // Mede sem a correcção anterior para obter a posição real de layout
    node.style.transform = 'none';
    const rect = node.getBoundingClientRect();
    const dx = -rect.left;
    const dy = -rect.top;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
  }, []);

  useLayoutEffect(() => {
    if (!active) return;

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(correct);
    };

    schedule();
    // Segunda passagem: algumas extensões só injectam o filtro depois do load
    const retry = setTimeout(schedule, 350);

    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    window.addEventListener('scroll', schedule, true);
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);

    // Reage a alterações de estilo no <html>/<body> feitas por extensões
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });

    const node = ref.current;
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(retry);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      window.removeEventListener('scroll', schedule, true);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', schedule);
      if (node) node.style.transform = '';
    };
  }, [active, correct]);

  return ref;
};
