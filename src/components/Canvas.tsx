import React, { useState } from 'react';
import {
  HiOutlineDotsVertical,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineCog,
} from 'react-icons/hi';
import { useDrag, useDrop } from 'react-dnd';

import { useFields, Field, FieldType, FieldSettings } from '../hooks';

export function Canvas() {
  const { fields, findField, moveField, removeField } = useFields();

  const [, drop] = useDrop(() => ({ accept: 'Field' }));
  return (
    <div>
      <div>
        {/* <h1 className="p-3 font-bold text-4xl">Ma démarche</h1> */}
        <input
          className="text-blue-500 border-none font-bold text-4xl pl-0 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded"
          type="text"
          value="Ma démarche"
          autoCorrect="off"
          autoComplete="off"
          onChange={() => {}}
        />
      </div>
      <div className="mt-5">
        <ul className="pb-32" ref={drop}>
          {fields.map((field) => (
            <CanvasField
              key={field.id}
              field={field}
              findField={findField}
              moveField={moveField}
              removeField={removeField}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

interface Item {
  id: string;
  originalIndex: number;
}

function CanvasField({
  field,
  findField,
  moveField,
  removeField,
}: {
  field: Field;
  findField: (id: string) => { field: Field; index: number };
  moveField: (id: string, atIndex: number) => void;
  removeField: (id: string) => void;
}) {
  const id = field.id;
  const originalIndex = findField(id).index;
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'Field',
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end(item, monitor) {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveField(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveField]
  );

  const [, drop] = useDrop(
    () => ({
      accept: 'Field',
      canDrop: () => false,
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = findField(id);
          moveField(draggedId, overIndex);
        }
      },
    }),
    [findField, moveField]
  );

  return (
    <li ref={(node) => preview(drop(node))} className="-ml-28 mb-5 flex group">
      <div className="flex text-lg text-gray-600 w-28 pt-3 opacity-0 group-hover:opacity-100 transition duration-150 ease-in-out">
        <SettingsMenu settings={field.settings} />
        <button
          type="button"
          className="hover:bg-gray-200 rounded p-1 h-6 w-6"
          onClick={() => removeField(field.id)}
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
          <input
            className="flex-auto text-blue-500 border-none p-0 mb-1 font-semibold focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10"
            autoCorrect="off"
            autoComplete="off"
            type="text"
            value={field.label}
            onChange={() => {}}
          />
          {field.settings.required && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-800">
              *
            </span>
          )}
        </div>

        {field.settings.description && (
          <textarea
            className="text-black border-none p-0 mb-2 text-xs focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10"
            rows={1}
            value={field.description}
            onChange={() => {}}
            autoCorrect="off"
            autoComplete="off"
          ></textarea>
        )}
        <FieldInput field={field} />
      </div>
    </li>
  );
}

function FieldInput({ field }: { field: Field }) {
  const [checked, setChecked] = useState(true);
  switch (field.type) {
    case FieldType.text:
      return (
        <input
          className="text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
          id={field.id}
          type="text"
        />
      );
    case FieldType.longtext:
      return (
        <textarea
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
          className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
        />
      );
    case FieldType.radio:
      return (
        <input
          id={field.id}
          type="radio"
          className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
        />
      );
    case FieldType.number:
      return (
        <input
          className="text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
          id={field.id}
          type="number"
        />
      );
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
              <Toggle checked={settings.description} />
            </div>
            <div
              className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              <span className="flex-1">Obligatoire</span>
              <Toggle checked={settings.required} />
            </div>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Logique conditionnelle
            </a>
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
