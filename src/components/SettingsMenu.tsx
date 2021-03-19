import React, { useState } from 'react';
import { HiOutlineCog, HiOutlineChevronRight } from 'react-icons/hi';
import { Menu, Switch } from '@headlessui/react';

import { Field, Section } from '../tree';

export function SettingsMenu({ field }: { field: Field | Section }) {
  const [required, setRequired] = useState(field.required);
  const [description, setDescription] = useState(field.description != null);
  const saveRequired = (required: boolean) => {
    setRequired(required);
    field.update({ required });
  };
  const saveDescription = (description: boolean) => {
    setDescription(description);
    field.update({ description: description ? '' : null });
  };

  return (
    <Menu>
      <div className="relative inline-block text-left">
        <Menu.Button className="hover:bg-gray-200 rounded p-1 h-6 w-6">
          <span className="sr-only">Open options</span>
          <HiOutlineCog />
        </Menu.Button>

        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="none">
            <Menu.Item>
              <div
                className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                <Toggle
                  label="Description"
                  checked={description}
                  onChange={saveDescription}
                />
              </div>
            </Menu.Item>
            <Menu.Item>
              <div
                className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                <Toggle
                  label="Obligatoire"
                  checked={required}
                  onChange={saveRequired}
                />
              </div>
            </Menu.Item>
            <Menu.Item>
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
            </Menu.Item>
          </div>
        </Menu.Items>
      </div>
    </Menu>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Switch.Group>
      <Switch.Label className="flex-1">{label}</Switch.Label>
      <Switch
        checked={checked}
        onChange={onChange}
        className={`${
          checked ? 'bg-blue-500' : 'bg-gray-200'
        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        <span
          aria-hidden="true"
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        ></span>
      </Switch>
    </Switch.Group>
  );
}
