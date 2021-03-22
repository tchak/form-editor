import { useRef, RefObject } from 'react';

export function useFocus(): [RefObject<HTMLInputElement>, () => void] {
  const ref = useRef<HTMLInputElement>(null);
  return [ref, () => ref.current?.focus()];
}
