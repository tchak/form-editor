import React, { RefObject, useEffect, useRef, useState } from 'react';
import { HiOutlineMinus } from 'react-icons/hi';
import composeRefs from '@seznam/compose-react-refs';

import { useAutosize } from '../autosize';
import { Field, FieldType } from '../tree';
import { FieldLogic } from './FieldLogic';

export function FieldInput({ field }: { field: Field }) {
  const [options, setOptions] = useState(field.options);
  const focusIndexRef = useRef<number>();

  const saveOptions = (index: number, option: string) => {
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

  switch (field.type) {
    case FieldType.text:
      return (
        <input
          tabIndex={-1}
          readOnly
          className="text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
          id={field.id}
          type="text"
        />
      );
    case FieldType.longtext:
      return (
        <textarea
          tabIndex={-1}
          readOnly
          className="text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
          id={field.id}
          rows={3}
        ></textarea>
      );
    case FieldType.checkbox:
      return (
        <input
          id={field.id}
          type="checkbox"
          checked={true}
          tabIndex={-1}
          readOnly
          className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none mt-1"
        />
      );
    case FieldType.radio:
      return (
        <div>
          {options.map((option, index) => (
            <RadioInput
              key={index}
              option={option}
              checked={index == 0}
              focused={() => focusIndexRef.current == index}
              group={`radio-group-${field.id}`}
              addOption={() => addOption(index)}
              updateOption={(option) => saveOptions(index, option)}
              removeOption={() => removeOption(index)}
            />
          ))}
        </div>
      );
    case FieldType.number:
      return (
        <input
          tabIndex={-1}
          readOnly
          className="text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
          id={field.id}
          type="number"
        />
      );
    case FieldType.logic:
      return <FieldLogic field={field} />;
    default:
      return null;
  }
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
  const [focusRef, setFocus] = useFocus();
  useEffect(() => {
    if (focused()) {
      setFocus();
    }
  }, [focused, setFocus]);

  return (
    <div className="flex items-center">
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
        className="hover:text-red-600 text-lg opacity-0 hover:opacity-100 p-1 ml-2"
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
