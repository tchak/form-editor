import { useState, useRef, RefObject } from 'react';
import { useHover, useFocusWithin } from '@react-aria/interactions';

export function useFocus(): [RefObject<HTMLInputElement>, () => void] {
  const ref = useRef<HTMLInputElement>(null);
  return [ref, () => ref.current?.focus()];
}

export function useHoverOrFocusWithin() {
  const [isFocusWithin, setFocusWithin] = useState(false);
  const { hoverProps, isHovered } = useHover({});
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange(isFocusWithin) {
      setFocusWithin(isFocusWithin);
    },
  });

  return {
    isHovered: isHovered || isFocusWithin,
    hoverProps: { ...hoverProps, ...focusWithinProps },
  };
}
