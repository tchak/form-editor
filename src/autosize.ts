import { RefObject, useEffect, useRef } from 'react';

import { mesureInput } from './mesure-input';

type AutosizableHTMLElement = HTMLInputElement | HTMLTextAreaElement;

export function useAutosize<
  T extends AutosizableHTMLElement = HTMLInputElement
>(defaultSize?: number): RefObject<T> {
  const ref = useRef<T>(null);
  const element = ref.current;

  useEffect(() => {
    const input = element;
    const callback = () => input && autosizeElement(input, defaultSize);
    input?.addEventListener('input', callback);
    input?.addEventListener('keyup', callback);

    callback();
    return () => {
      input?.removeEventListener('input', callback);
      input?.removeEventListener('keyup', callback);
    };
  }, [element, defaultSize]);

  return ref;
}

function autosizeElement(
  element: AutosizableHTMLElement,
  defaultSize?: number
) {
  if ('rows' in element) {
    autosizeTextareaElement(element);
  } else {
    autosizeInputElement(element, defaultSize);
  }
}

function autosizeInputElement(input: HTMLInputElement, defaultSize = 50) {
  const width = mesureInput(input);
  const zero = width === '0px';

  if (!zero) {
    input.style.width = `${parseInt(width) + 5}px`;
  } else {
    input.style.width = `${defaultSize}px`;
  }
}

function autosizeTextareaElement(textarea: HTMLTextAreaElement) {
  const lines = textarea.value.split(/\r\n|\r|\n/).length;
  textarea.rows = lines;
}
