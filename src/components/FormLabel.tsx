import React, { ReactNode, useState } from 'react';
import {
  HiOutlineDotsVertical,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
} from 'react-icons/hi';
import { useDrag, useDrop } from 'react-dnd';

import { Field, Section, isLogic, isSection } from '../tree';
import { SettingsMenu } from './SettingsMenu';
import { AddFieldModal } from './AddFieldModal';

export function FormLabel({
  field,
  children,
}: {
  field: Field;
  children: ReactNode;
}) {
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
    <li ref={preview} className="-ml-40 mb-5 flex group">
      <div
        ref={drop}
        className="flex justify-end text-lg text-gray-600 w-40 pt-3 opacity-0 group-hover:opacity-100 transition duration-150 ease-in-out"
      >
        {!field.first && (
          <button
            type="button"
            className="hover:bg-gray-200 rounded p-1 h-6 w-6"
            onClick={() => field.moveUp()}
          >
            <HiOutlineChevronUp />
          </button>
        )}
        {!field.last && (
          <button
            type="button"
            className="hover:bg-gray-200 rounded p-1 h-6 w-6"
            onClick={() => field.moveDown()}
          >
            <HiOutlineChevronDown />
          </button>
        )}
        {!isLogic(field) && <SettingsMenu field={field} />}
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
        {children}
      </div>
    </li>
  );
}
