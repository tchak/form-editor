import React, { useState } from 'react';
import { HiOutlineCog, HiOutlineChevronRight } from 'react-icons/hi';
import { Menu } from '@headlessui/react';

import { FieldSettings } from '../tree';

export function SettingsMenu({ settings }: { settings: FieldSettings }) {
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
                <span className="flex-1">Description</span>
                <Toggle checked={false} />
              </div>
            </Menu.Item>
            <Menu.Item>
              <div
                className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                <span className="flex-1">Obligatoire</span>
                <Toggle checked={settings.required ?? false} />
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
