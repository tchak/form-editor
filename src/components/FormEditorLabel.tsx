import React, { ReactNode, useState } from 'react';
import {
  HiOutlineDotsVertical,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlinePencil,
} from 'react-icons/hi';
import composeRefs from '@seznam/compose-react-refs';

import { useFieldDrag } from '../field-dnd';
import { useAutosize } from '../autosize';
import { Field, isLogic, isSection } from '../tree';
import { SettingsMenu, MenuButtonTooltip } from './SettingsMenu';
import { AddFieldModal } from './AddFieldModal';
import { useFocus } from './hooks';

function SideMenuButton({
  children,
  tooltip,
  onClick,
}: {
  children: ReactNode;
  tooltip: {
    id: string;
    defaultMessage: string;
  };
  onClick: () => void;
}) {
  return (
    <MenuButtonTooltip label={tooltip}>
      <button
        type="button"
        className="hover:bg-gray-200 rounded flex items-center justify-center h-6 w-6"
        onClick={onClick}
      >
        {children}
      </button>
    </MenuButtonTooltip>
  );
}

export function FormEditorLabel({
  field,
  children,
}: {
  field: Field;
  children: ReactNode;
}) {
  const [focusLabelRef, setLabelFocus] = useFocus();
  const autosizeLabelRef = useAutosize();
  const descriptionRef = useAutosize<HTMLTextAreaElement>();
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

  const [drag, drop, preview, { isDragging }] = useFieldDrag(field);

  return (
    <li ref={preview} className="-ml-40 flex">
      <div
        ref={drop}
        className="flex justify-end text-lg text-gray-600 w-40 pt-3 pr-3 transition duration-150 ease-in-out"
      >
        {!field.first && (
          <SideMenuButton
            tooltip={{
              id: 'moveUp',
              defaultMessage: 'Move Field up',
            }}
            onClick={() => field.moveUp()}
          >
            <HiOutlineChevronUp />
          </SideMenuButton>
        )}
        {!field.last && (
          <SideMenuButton
            tooltip={{
              id: 'moveDown',
              defaultMessage: 'Move Field down',
            }}
            onClick={() => field.moveDown()}
          >
            <HiOutlineChevronDown />
          </SideMenuButton>
        )}

        {!isLogic(field) && <SettingsMenu field={field} />}

        <SideMenuButton
          tooltip={{ id: 'deleteField', defaultMessage: 'Remove the Field' }}
          onClick={() => field.remove()}
        >
          <HiOutlineTrash />
        </SideMenuButton>

        <SideMenuButton
          tooltip={{
            id: 'addFieldAfter',
            defaultMessage: 'Add a Field after',
          }}
          onClick={openAddField}
        >
          <HiOutlinePlus />
        </SideMenuButton>

        <MenuButtonTooltip
          label={{
            id: 'move',
            defaultMessage: 'Move Field',
            description:
              'Tooltip on a drag handle to move a selected Field by Drag & Drop',
          }}
        >
          <div
            ref={drag}
            className="hover:bg-gray-200 rounded flex items-center justify-center h-6 w-6 cursor-move"
          >
            <HiOutlineDotsVertical />
          </div>
        </MenuButtonTooltip>

        <AddFieldModal
          show={showAddField}
          done={(item) => {
            if (item) field.parent.insert(item, field.index + 1);
            closeAddField();
          }}
        />
      </div>
      <div
        className={`${
          isSection(field) ? 'mt-4' : 'mt-2'
        } flex flex-col flex-grow ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      >
        <div className="flex group">
          {isSection(field) && !field.matrix ? (
            <span
              className={`${
                isSection(field) ? 'text-2xl font-bold' : 'font-semibold'
              } flex-no-grow text-blue-500 border-none pr-1 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10`}
            >
              {field.sectionIndex}
            </span>
          ) : null}
          <input
            className={`${
              isSection(field) ? 'text-2xl font-bold' : 'font-semibold'
            } text-blue-500 border-none p-0 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10`}
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            ref={composeRefs(autosizeLabelRef, focusLabelRef)}
            type="text"
            value={label}
            onChange={({ currentTarget: { value } }) => saveLabel(value)}
          />
          {field.required && (
            <span className="ml-2 font-medium text-2xl text-red-800">*</span>
          )}
          <button
            className="ml-2 opacity-0 group-hover:opacity-100"
            onClick={setLabelFocus}
          >
            <HiOutlinePencil />
          </button>
        </div>

        {hasDescription && (
          <textarea
            className="mt-1 text-black border-none p-0 text-xs focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10"
            rows={1}
            value={description ?? ''}
            onChange={({ currentTarget: { value } }) => saveDescription(value)}
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            ref={descriptionRef}
          ></textarea>
        )}
        {children}
      </div>
    </li>
  );
}
