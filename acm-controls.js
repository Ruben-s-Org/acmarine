(function () {
  function enhanceSelect(select) {
    if (select.dataset.acmEnhanced) return;
    select.dataset.acmEnhanced = '1';

    const wrap = document.createElement('div');
    wrap.className = 'acm-select';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'acm-select-toggle';
    toggle.setAttribute('aria-haspopup', 'listbox');
    toggle.setAttribute('aria-expanded', 'false');
    if (select.disabled) toggle.disabled = true;

    const label = document.createElement('span');
    label.className = 'acm-select-value';

    const chev = document.createElement('span');
    chev.className = 'acm-select-chevron';
    chev.setAttribute('aria-hidden', 'true');
    chev.innerHTML = '<svg viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    toggle.append(label, chev);

    const list = document.createElement('ul');
    list.className = 'acm-select-list';
    list.setAttribute('role', 'listbox');
    list.hidden = true;

    const options = Array.from(select.options);
    options.forEach((opt, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.dataset.value = opt.value;
      li.textContent = opt.textContent;
      li.id = `acm-opt-${(select.name || 'sel').replace(/[^a-z0-9]/gi, '-')}-${i}`;
      if (opt.selected) li.setAttribute('aria-selected', 'true');
      li.tabIndex = -1;
      list.appendChild(li);
    });

    const initial = options.find(o => o.selected) || options[0];
    if (initial) label.textContent = initial.textContent;
    else label.textContent = '';

    wrap.append(toggle, list);
    select.parentNode.insertBefore(wrap, select);
    select.classList.add('acm-select-native');

    function setValue(value, text) {
      select.value = value;
      label.textContent = text;
      Array.from(list.querySelectorAll('[role="option"]')).forEach(li => {
        li.setAttribute('aria-selected', li.dataset.value === value ? 'true' : 'false');
      });
      select.dispatchEvent(new Event('change', { bubbles: true }));
      select.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function open() {
      if (toggle.disabled) return;
      closeAllOthers(list);
      list.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      const sel = list.querySelector('[aria-selected="true"]') || list.firstElementChild;
      sel?.focus();
    }
    function close(returnFocus) {
      list.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (list.hidden) open();
      else close(true);
    });
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });

    list.addEventListener('click', (e) => {
      const li = e.target.closest('[role="option"]');
      if (!li) return;
      setValue(li.dataset.value, li.textContent);
      close(true);
    });

    list.addEventListener('keydown', (e) => {
      const items = Array.from(list.querySelectorAll('[role="option"]'));
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(idx + 1) % items.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1]?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const li = document.activeElement;
        if (li && li.dataset && 'value' in li.dataset) {
          setValue(li.dataset.value, li.textContent);
          close(true);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close(true);
      } else if (e.key === 'Tab') {
        close(false);
      } else if (/^[a-zA-Z0-9]$/.test(e.key)) {
        const ch = e.key.toLowerCase();
        const startIdx = (idx + 1) % items.length;
        for (let i = 0; i < items.length; i++) {
          const j = (startIdx + i) % items.length;
          if (items[j].textContent.trim().toLowerCase().startsWith(ch)) {
            items[j].focus();
            break;
          }
        }
      }
    });

    select.addEventListener('change', () => {
      const o = select.options[select.selectedIndex];
      if (!o) return;
      label.textContent = o.textContent;
      Array.from(list.querySelectorAll('[role="option"]')).forEach(li => {
        li.setAttribute('aria-selected', li.dataset.value === select.value ? 'true' : 'false');
      });
    });

    // Click outside
    document.addEventListener('click', (e) => {
      if (!list.hidden && !wrap.contains(e.target)) close(false);
    });
  }

  function closeAllOthers(except) {
    document.querySelectorAll('.acm-select-list').forEach(l => {
      if (l !== except && !l.hidden) {
        l.hidden = true;
        const t = l.previousElementSibling;
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function enhanceTypeahead(input, source) {
    if (input.dataset.acmEnhanced) return;
    input.dataset.acmEnhanced = '1';

    const wrap = document.createElement('div');
    wrap.className = 'acm-typeahead';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');

    const list = document.createElement('ul');
    list.className = 'acm-select-list acm-typeahead-list';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    wrap.appendChild(list);

    function render(q) {
      const norm = q.trim().toLowerCase();
      let items = source();
      if (norm) items = items.filter(v => v.toLowerCase().includes(norm)).slice(0, 8);
      else items = items.slice(0, 8);
      if (items.length === 0) { list.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
      list.innerHTML = items.map(v => `<li role="option" data-value="${v.replace(/"/g, '&quot;')}" tabindex="-1">${v.replace(/</g,'&lt;')}</li>`).join('');
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    input.addEventListener('focus', () => render(input.value));
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', (e) => {
      const items = Array.from(list.querySelectorAll('[role="option"]'));
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (list.hidden) render(input.value);
        items[(idx + 1) % items.length]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length]?.focus();
      } else if (e.key === 'Escape') {
        list.hidden = true;
        input.setAttribute('aria-expanded', 'false');
      }
    });
    list.addEventListener('click', (e) => {
      const li = e.target.closest('[role="option"]');
      if (!li) return;
      input.value = li.dataset.value;
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.focus();
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    list.addEventListener('keydown', (e) => {
      const items = Array.from(list.querySelectorAll('[role="option"]'));
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const li = document.activeElement;
        if (li && li.dataset && 'value' in li.dataset) {
          input.value = li.dataset.value;
          list.hidden = true;
          input.setAttribute('aria-expanded', 'false');
          input.focus();
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else if (e.key === 'Escape') {
        list.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        input.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (!list.hidden && !wrap.contains(e.target)) {
        list.hidden = true;
        input.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function init() {
    document.querySelectorAll('select').forEach(enhanceSelect);
    // Builder typeahead on fleet page
    const builders = document.querySelector('input[name="builder"]');
    if (builders) {
      const dl = document.getElementById('builders-list');
      enhanceTypeahead(builders, () => {
        if (!dl) return [];
        return Array.from(dl.options).map(o => o.value).filter(Boolean);
      });
    }
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for late-added selects (e.g., dialogs)
  window.acmEnhanceAll = () => document.querySelectorAll('select:not([data-acm-enhanced])').forEach(enhanceSelect);
})();
