import React, { useState, ReactNode } from 'react';
import { HiOutlineCog } from 'react-icons/hi';
import { Menu, Switch } from '@headlessui/react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Tooltip } from '@reach/tooltip';

import {
  ConditionOperator,
  Field,
  FieldType,
  LogicalOperator,
  Section,
  Action,
} from '../tree';

export function MenuButtonTooltip({
  children,
  label,
}: {
  children: ReactNode;
  label: {
    id?: string;
    defaultMessage: string;
    description?: string;
  };
}) {
  const intl = useIntl();
  const message = intl.formatMessage(label);

  return (
    <Tooltip
      label={message}
      className="rounded bg-gray-800 text-white p-2 px-3 border-none"
    >
      {children}
    </Tooltip>
  );
}

export function SettingsMenu({ field }: { field: Field | Section }) {
  const intl = useIntl();
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

  const addLogic = () => {
    const logic = new Field({
      type: FieldType.logic,
      label: intl.formatMessage(
        {
          id: 'conditionsFor',
          defaultMessage: 'Conditions for "{label}"',
        },
        { label: field.displayLabel }
      ),
      logic: {
        conditions: [
          {
            operator: ConditionOperator.IS,
            targetId: field.id,
            value: field.defaultValue,
          },
        ],
        operator: LogicalOperator.AND,
        actions: [{ action: Action.hide }],
      },
    });
    field.parent.insert(logic, field.index + 1);
  };

  return (
    <Menu>
      <div className="relative inline-block text-left">
        <MenuButtonTooltip
          label={{ id: 'fieldSettigs', defaultMessage: 'Field settings' }}
        >
          <Menu.Button className="hover:bg-gray-200 rounded flex items-center justify-center h-6 w-6">
            <span className="sr-only">Open options</span>
            <HiOutlineCog />
          </Menu.Button>
        </MenuButtonTooltip>

        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="none">
            <Menu.Item>
              <div className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                <Toggle
                  label={intl.formatMessage({
                    id: 'description',
                    defaultMessage: 'Description',
                  })}
                  checked={description}
                  onChange={saveDescription}
                />
              </div>
            </Menu.Item>
            <Menu.Item>
              <div className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                <Toggle
                  label={intl.formatMessage({
                    id: 'required',
                    defaultMessage: 'Required',
                  })}
                  checked={required}
                  onChange={saveRequired}
                />
              </div>
            </Menu.Item>
            {field.canAddLogic && (
              <Menu.Item>
                <button
                  type="button"
                  className="inline-flex items-center text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={addLogic}
                >
                  <span className="flex-1">
                    <FormattedMessage
                      id="logic"
                      defaultMessage="Conditional logic"
                    />
                  </span>
                </button>
              </Menu.Item>
            )}
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
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
        ></span>
      </Switch>
    </Switch.Group>
  );
}
