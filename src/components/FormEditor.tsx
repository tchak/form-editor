import React, { useState } from 'react';
import {
  HiOutlineDotsVertical,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineCog,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { useDrag, useDrop } from 'react-dnd';

import { Field, Section, FieldType, FieldSettings, isSection } from '../tree';
import { usePage } from '../hooks';

export function FormEditor() {
  const page = usePage();

  const [, drop] = useDrop(() => ({ accept: 'Field' }));
  return (
    <div>
      <div>
        {/* <h1 className="p-3 font-bold text-4xl">Ma démarche</h1> */}
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
          {page.content.map((field, index) => (
            <FormField index={index} key={field.id} field={field} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function FormField({ field, index }: { field: Field; index: number }) {
  const [label, setLabel] = useState(field.label);
  const [description, setDescription] = useState(field.description);

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
        <SettingsMenu settings={field.settings ?? {}} />
        <button
          type="button"
          className="hover:bg-gray-200 rounded p-1 h-6 w-6"
          onClick={() => field.remove()}
        >
          <HiOutlineTrash />
        </button>

        <button type="button" className="hover:bg-gray-200 rounded p-1 h-6 w-6">
          <HiOutlinePlus />
        </button>

        <div ref={drag} className="hover:bg-gray-200 rounded p-1 h-6 w-6">
          <HiOutlineDotsVertical />
        </div>
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
            >{`${index + 1}.`}</span>
          ) : null}
          <input
            className={`${
              isSection(field) ? 'text-2xl font-bold' : 'font-semibold'
            } flex-auto text-blue-500 border-none p-0 mb-1 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10`}
            autoCorrect="off"
            autoComplete="off"
            type="text"
            value={label}
            onChange={({ currentTarget: { value } }) => setLabel(value)}
          />
          {field.settings?.required && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-800">
              *
            </span>
          )}
        </div>

        {description != null && (
          <textarea
            className="text-black border-none p-0 mb-2 text-xs focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10"
            rows={1}
            value={description}
            onChange={({ currentTarget: { value } }) => setDescription(value)}
            autoCorrect="off"
            autoComplete="off"
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
  const [selected, setSelected] = useState(field.options[0] ?? '');
  const [, drop] = useDrop(() => ({ accept: 'Field' }));

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
          {field.options.map((option) => (
            <div key={option}>
              <input
                radioGroup={field.id}
                id={`${field.id}-${option}`}
                type="radio"
                checked={selected == option}
                onChange={() => setSelected(option)}
                className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
              />
              <label htmlFor={`${field.id}-${option}`} className="ml-2">
                {option}
              </label>
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
    default:
      if (isSection(field)) {
        return (
          <ul ref={drop}>
            {field.content.map((field, index) => (
              <FormField index={index} key={field.id} field={field} />
            ))}
            <SectionInsert field={field} />
          </ul>
        );
      }
      return null;
  }
}

function SettingsMenu({ settings }: { settings: FieldSettings }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="hover:bg-gray-200 rounded p-1 h-6 w-6"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">Open options</span>
          <HiOutlineCog />
        </button>
      </div>

      {open && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            <div
              className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              <span className="flex-1">Description</span>
              <Toggle checked={false} />
            </div>
            <div
              className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              <span className="flex-1">Obligatoire</span>
              <Toggle checked={settings.required ?? false} />
            </div>
            <button
              type="button"
              className="inline-flex items-center text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              role="menuitem"
            >
              <span className="flex-1">Logique conditionnelle</span>
              <span className="">
                <HiOutlineChevronRight />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ checked }: { checked: boolean }) {
  const [enabled, setEnabled] = useState(checked);
  return (
    <button
      type="button"
      className={`${
        enabled ? 'bg-blue-500' : 'bg-gray-200'
      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      aria-pressed="false"
      onClick={() => setEnabled(!enabled)}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
      ></span>
    </button>
  );
}
