import React from 'react';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { IntlShape, useIntl } from 'react-intl';

import { Field, Section, FieldType } from '../tree';

const FIELDS = Object.keys(FieldType) as FieldType[];

export function AddFieldModal({
  show,
  done,
}: {
  show: boolean;
  done: (field?: Field | Section) => void;
}) {
  const intl = useIntl();
  const createField = (type: FieldType) => {
    if (type == FieldType.section) {
      return new Section({
        type: FieldType.section,
        label: intl.formatMessage({
          id: 'newSection',
          defaultMessage: 'New section',
        }),
      });
    } else {
      const label = intl.formatMessage(
        {
          id: 'newField',
          defaultMessage: 'New field "{type}"',
        },
        { type: formatFieldType(intl, type) }
      );
      if (type == FieldType.radio) {
        return new Field({ type, label, options: [''] });
      }
      return new Field({ type, label });
    }
  };
  const close = () => done();
  return (
    <DialogOverlay
      className="fixed z-10 inset-0 overflow-y-auto"
      isOpen={show}
      onDismiss={close}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <DialogContent
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          aria-label="Add field"
        >
          <ul>
            {FIELDS.map((fieldType) => (
              <li key={fieldType}>
                <button
                  type="button"
                  onClick={() => done(createField(fieldType))}
                >
                  {formatFieldType(intl, fieldType)}
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </div>
    </DialogOverlay>
  );
}

function formatFieldType(intl: IntlShape, type: FieldType): string {
  switch (type) {
    case FieldType.text:
      return intl.formatMessage({ id: type, defaultMessage: 'Text' });
    case FieldType.longtext:
      return intl.formatMessage({ id: type, defaultMessage: 'Long text' });
    case FieldType.number:
      return intl.formatMessage({ id: type, defaultMessage: 'Number' });
    case FieldType.radio:
      return intl.formatMessage({ id: type, defaultMessage: 'Select' });
    case FieldType.checkbox:
      return intl.formatMessage({ id: type, defaultMessage: 'Checkbox' });
    case FieldType.section:
      return intl.formatMessage({ id: type, defaultMessage: 'Section' });
    case FieldType.logic:
      return intl.formatMessage({
        id: type,
        defaultMessage: 'Conditional logic',
      });
  }
}
