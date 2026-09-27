const Router = (() => {
  const container = document.getElementById('screen-container');
  let current = null;

  const screens = {};

  return {
    register(name, renderFn) { screens[name] = renderFn; },

    async go(name, data = {}) {
      if (current) {
        current.classList.add('animate-out');
        await delay(250);
        current.remove();
        current = null;
      }

      State.set({ phase: name });
      const renderFn = screens[name];
      if (!renderFn) { console.error('No screen:', name); return; }

      const wrapper = el('div', { class: 'animate-in' });
      wrapper.appendChild(renderFn(data));
      container.appendChild(wrapper);
      current = wrapper;
    },
  };
})();
