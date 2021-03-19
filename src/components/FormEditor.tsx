import React, { useState } from 'react';
import {
  HiOutlineDotsVertical,
  HiOutlineTrash,
  HiOutlinePlus,
} from 'react-icons/hi';
import { useDrag, useDrop } from 'react-dnd';

import { Field, Section, FieldType, isSection } from '../tree';
import { usePage } from '../hooks';
import { SettingsMenu } from './SettingsMenu';
import { AddFieldModal } from './AddFieldModal';
import { FieldLogic } from './FieldLogic';

export function FormEditor() {
  const page = usePage();

  const [, drop] = useDrop(() => ({ accept: 'Field' }));
  return (
    <div>
      <div>
        <input
          className="text-blue-500 border-none font-bold text-4xl pl-0 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded"
          type="text"
          value={page.label}
          autoCorrect="off"
          autoComplete="off"
          onChange={() => {}}
        />
      </div>
      <div className="mt-5">
        <ul className="pb-32" ref={drop}>
          {page.content.map((field) => (
            <FormField key={field.id} field={field} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function FormField({ field }: { field: Field }) {
  const [showAddField, setShowAddField] = useState(false);
  const [label, setLabel] = useState(field.label);
  const [description, setDescription] = useState(field.description);
  const hasDescription = field.description != null;

  const openAddField = () => setShowAddField(true);
  const closeAddField = () => setShowAddField(false);
  const saveLabel = (label: string) => {
    setLabel(label);
    field.update({ label });
  };
  const saveDescription = (description: string) => {
    setDescription(description);
    field.update({ description });
  };

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'Field',
      item: field,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end(item, monitor) {
        const didDrop = monitor.didDrop();
        if (!didDrop) {
        }
      },
    }),
    [field.id]
  );

  const [, drop] = useDrop(
    () => ({
      accept: 'Field',
      canDrop: () => false,
      hover(item: Field | Section) {
        if (item.id !== field.id) {
          item.moveAfter(field);
        }
      },
    }),
    [field.id]
  );

  return (
    <li ref={preview} className="-ml-28 mb-5 flex group">
      <div
        ref={drop}
        className="flex text-lg text-gray-600 w-28 pt-3 opacity-0 group-hover:opacity-100 transition duration-150 ease-in-out"
      >
        {field.type != FieldType.logic && <SettingsMenu field={field} />}
        <button
          type="button"
          className="hover:bg-gray-200 rounded p-1 h-6 w-6"
          onClick={() => field.remove()}
        >
          <HiOutlineTrash />
        </button>

        <button
          type="button"
          className="hover:bg-gray-200 rounded p-1 h-6 w-6"
          onClick={openAddField}
        >
          <HiOutlinePlus />
        </button>

        <div ref={drag} className="hover:bg-gray-200 rounded p-1 h-6 w-6">
          <HiOutlineDotsVertical />
        </div>

        <AddFieldModal
          show={showAddField}
          done={(item) => {
            if (item) field.parent.insert(item, field.index + 1);
            closeAddField();
          }}
        />
      </div>
      <div
        className={`flex flex-col flex-grow ${
          isDragging ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <div className="flex">
          {isSection(field) ? (
            <span
              className={`${
                isSection(field) ? 'text-2xl font-bold' : 'font-semibold'
              } flex-no-grow text-blue-500 border-none pr-1 mb-1 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10`}
            >
              {field.sectionIndex}
            </span>
          ) : null}
          <input
            className={`${
              isSection(field) ? 'text-2xl font-bold' : 'font-semibold'
            } flex-auto text-blue-500 border-none p-0 mb-1 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10`}
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            type="text"
            value={label}
            onChange={({ currentTarget: { value } }) => saveLabel(value)}
          />
          {field.required && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-800">
              *
            </span>
          )}
        </div>

        {hasDescription && (
          <textarea
            className="text-black border-none p-0 mb-2 text-xs focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10"
            rows={1}
            value={description ?? ''}
            onChange={({ currentTarget: { value } }) => saveDescription(value)}
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
          ></textarea>
        )}
        <FieldInput field={field} />
      </div>
    </li>
  );
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

function FieldInput({ field }: { field: Field | Section }) {
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
