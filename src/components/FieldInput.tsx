import React, { useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { useDrop } from 'react-dnd';

import { Field, Section, FieldType, isSection } from '../tree';
import { FieldLogic } from './FieldLogic';
import { FormField } from './FormField';

export function FieldInput({ field }: { field: Field | Section }) {
  const [checked, setChecked] = useState(true);
  const [options, setOptions] = useState(field.options);
  const [selected, setSelected] = useState(options[0] ?? '');
  const [, drop] = useDrop(() => ({ accept: 'Field' }));

  const saveOptions = (index: number, option: string) => {
    const options = [...field.options];
    options.splice(index, 1, option);
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
          readOnly
          className="text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
          id={field.id}
          type="text"
        />
      );
    case FieldType.longtext:
      return (
        <textarea
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
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none mt-1"
        />
      );
    case FieldType.radio:
      return (
        <div>
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                radioGroup={field.id}
                type="radio"
                checked={selected == option}
                onChange={() => setSelected(option)}
                className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
              />
              <input
                className="ml-2"
                value={option}
                onChange={({ currentTarget: { value } }) =>
                  saveOptions(index, value)
                }
              />
              <button
                className="hover:text-red-600 text-lg opacity-0 hover:opacity-100 p-1"
                onClick={() => removeOption(index)}
              >
                <HiOutlineTrash />
              </button>
            </div>
          ))}
        </div>
      );
    case FieldType.number:
      return (
        <input
          readOnly
          className="text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
          id={field.id}
          type="number"
        />
      );
    case FieldType.logic:
      return <FieldLogic field={field} />;
    default:
      if (isSection(field)) {
        return (
          <ul ref={drop}>
            {field.content.map((field) => (
              <FormField key={field.id} field={field} />
            ))}
            <SectionInsert field={field} />
          </ul>
        );
      }
      return null;
  }
}

function SectionInsert({ field }: { field: Section }) {
  const [, drop] = useDrop(
    () => ({
      accept: 'Field',
      canDrop: () => false,
      hover(item: Field | Section) {
        if (item != field && !field.content.includes(item)) {
          field.insert(item, field.content.length);
        }
      },
    }),
    []
  );
  return <li className="p-2" ref={drop}></li>;
}
