type Props = Record<string, string | number | boolean | EventListener | undefined>;

/**
 * Minimal element factory. `on<Event>` keys become listeners, `class`/`text`
 * are special-cased, everything else is an attribute.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === false) continue;
    if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'class') {
      node.className = String(value);
    } else if (key === 'text') {
      node.textContent = String(value);
    } else {
      node.setAttribute(key, value === true ? '' : String(value));
    }
  }

  node.append(...children);
  return node;
}

export function must<T extends Element>(selector: string): T {
  const found = document.querySelector<T>(selector);
  if (!found) throw new Error(`Missing required element: ${selector}`);
  return found;
}

export function copyToClipboard(text: string, button: HTMLButtonElement): void {
  const done = () => {
    const original = button.textContent;
    button.textContent = 'Copied';
    window.setTimeout(() => {
      button.textContent = original;
    }, 1200);
  };

  navigator.clipboard?.writeText(text).then(done, () => {
    // Clipboard API needs a secure context; fall back to a selection copy.
    const scratch = el('textarea', { class: 'sr-only' });
    scratch.value = text;
    document.body.append(scratch);
    scratch.select();
    document.execCommand('copy');
    scratch.remove();
    done();
  });
}
