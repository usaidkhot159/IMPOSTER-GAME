// Accessibility utilities — keyboard traps, focus management, ARIA
const A11y = (() => {
  const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), [tabindex="0"]';

  return {
    // Trap focus inside a container (e.g. a modal card)
    trapFocus(container) {
      const nodes = [...container.querySelectorAll(FOCUSABLE)];
      if (!nodes.length) return;
      const first = nodes[0];
      const last  = nodes[nodes.length - 1];
      first.focus();
      container._trapHandler = (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
      };
      container.addEventListener('keydown', container._trapHandler);
    },

    // Release a previously trapped focus
    releaseFocus(container) {
      if (container._trapHandler) {
        container.removeEventListener('keydown', container._trapHandler);
        delete container._trapHandler;
      }
    },

    // Focus the first focusable element in a screen after transition
    focusFirst(screenEl) {
      requestAnimationFrame(() => {
        const first = screenEl.querySelector(FOCUSABLE);
        if (first) first.focus();
      });
    },

    // Announce a message to screen readers via an ARIA live region
    announce(message, politeness = 'polite') {
      let region = document.getElementById('aria-live-region');
      if (!region) {
        region = el('div', {
          id: 'aria-live-region',
          'aria-live': politeness,
          'aria-atomic': 'true',
          style: 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap'
        });
        document.body.appendChild(region);
      }
      region.setAttribute('aria-live', politeness);
      region.textContent = '';
      requestAnimationFrame(() => { region.textContent = message; });
    },
  };
})();
