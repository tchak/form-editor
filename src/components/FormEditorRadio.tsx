import React, { RefObject, useEffect, useRef, useState } from 'react';
import { HiOutlineMinus } from 'react-icons/hi';
import composeRefs from '@seznam/compose-react-refs';

import { Field } from '../tree';
import { useAutosize } from '../autosize';

export function FormEditorRadio({ field }: { field: Field }) {
  const {
    options,
    addOption,
    updateOption,
    removeOption,
    isFocused,
  } = useRadioOptions(field);

  return (
    <div>
      {options.map((option, index) => (
        <RadioInput
          key={index}
          option={option}
          checked={index == 0}
          focused={() => isFocused(index)}
          group={field.id}
          addOption={() => addOption(index)}
          updateOption={(option) => updateOption(index, option)}
          removeOption={() => removeOption(index)}
        />
      ))}
    </div>
  );
}

function RadioInput({
  option,
  group,
  checked,
  focused,
  addOption,
  updateOption,
  removeOption,
}: {
  option: string;
  group: string;
  checked: boolean;
  focused: () => boolean;
  addOption: () => void;
  updateOption: (value: string) => void;
  removeOption: () => void;
}) {
  const autosizeRef = useAutosize();
  const focusRef = useFocused(focused);

  return (
    <div className="flex items-center group">
      <input
        radioGroup={group}
        type="radio"
        checked={checked}
        readOnly
        tabIndex={-1}
        className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
      />
      <input
        ref={composeRefs(autosizeRef, focusRef)}
        type="text"
        className="ml-2 border-none p-0 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10"
        value={option}
        onChange={({ currentTarget: { value } }) => updateOption(value)}
        onKeyPress={(event) => {
          if (event.key == 'Enter') {
            addOption();
          }
        }}
      />
      <button
        className="text-red-600 text-lg opacity-0 group-hover:opacity-100 p-1 ml-2"
        onClick={() => removeOption()}
      >
        <HiOutlineMinus />
      </button>
    </div>
  );
}

function useFocus(): [RefObject<HTMLInputElement>, () => void] {
  const ref = useRef<HTMLInputElement>(null);
  return [ref, () => ref.current?.focus()];
}

function useFocused(focused: () => boolean): RefObject<HTMLInputElement> {
  const [ref, setFocus] = useFocus();
  useEffect(() => {
    if (focused()) {
      setFocus();
    }
  }, [focused, ref, setFocus]);

  return ref;
}

function useRadioOptions(field: Field) {
  const [options, setOptions] = useState(field.options);
  const focusIndexRef = useRef<number>();

  const updateOption = (index: number, option: string) => {
    const options = [...field.options];
    options.splice(index, 1, option);
    focusIndexRef.current = undefined;
    setOptions(options);
    field.update({ options });
  };
  const addOption = (index: number) => {
    const options = [...field.options];
    options.splice(index + 1, 0, '');
    focusIndexRef.current = index + 1;
    setOptions(options);
    field.update({ options });
  };
  const removeOption = (index: number) => {
    const options = [...field.options];
    options.splice(index, 1);
    setOptions(options);
    field.update({ options });
  };

  return {
    options,
    addOption,
    updateOption,
    removeOption,
    isFocused(index: number) {
      return focusIndexRef.current == index;
    },
  };
}
