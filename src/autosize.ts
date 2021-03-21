import { RefObject, useEffect, useRef } from 'react';

import { mesureInput } from './mesure-input';

type AutosizableHTMLElement = HTMLInputElement | HTMLTextAreaElement;

export function useAutosize<
  T extends AutosizableHTMLElement = HTMLInputElement
>(): RefObject<T> {
  const ref = useRef<T>(null);
  const element = ref.current;

  useEffect(() => {
    const input = element;
    const callback = () => input && autosizeElement(input);
    input?.addEventListener('input', callback);
    input?.addEventListener('keyup', callback);

    callback();
    return () => {
      input?.removeEventListener('input', callback);
      input?.removeEventListener('keyup', callback);
    };
  }, [element]);

  return ref;
}

function autosizeElement(element: AutosizableHTMLElement) {
  if ('rows' in element) {
    autosizeTextareaElement(element);
  } else {
    autosizeInputElement(element);
  }
}

function autosizeInputElement(input: HTMLInputElement) {
  const width = mesureInput(input);
  const zero = width === '0px';

  if (!zero) {
    input.style.width = `${parseInt(width) + 5}px`;
  } else {
    input.style.width = '10px';
  }
}

function autosizeTextareaElement(textarea: HTMLTextAreaElement) {
  const lines = textarea.value.split(/\r\n|\r|\n/).length;
  textarea.rows = lines;
}
