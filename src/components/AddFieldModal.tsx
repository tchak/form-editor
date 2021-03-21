import React from 'react';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { IntlShape, useIntl } from 'react-intl';
import {
  HiOutlineVariable,
  HiOutlineHashtag,
  HiOutlineDocumentText,
  HiOutlineTemplate,
} from 'react-icons/hi';
import {
  MdCheckBox,
  MdRadioButtonChecked,
  MdShortText,
  MdSubject,
} from 'react-icons/md';

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
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6"
          aria-label="Add field"
        >
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <HiOutlineTemplate className="h-6 w-6 text-blue-500" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <div className="mt-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {FIELDS.map((fieldType) => (
                    <div
                      key={fieldType}
                      className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <div className="flex-shrink-0">
                        <FieldTypeIcon type={fieldType} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          type="button"
                          className="focus:outline-none"
                          onClick={() => done(createField(fieldType))}
                        >
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          ></span>
                          <p className="text-sm font-medium text-gray-900">
                            {formatFieldType(intl, fieldType)}
                          </p>
                          <p className="text-sm text-gray-500 truncate"></p>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </div>
    </DialogOverlay>
  );
}

function FieldTypeIcon({ type }: { type: FieldType }) {
  const className = 'h-5 w-5 rounded-full';
  switch (type) {
    case FieldType.text:
      return <MdShortText className={className} />;
    case FieldType.longtext:
      return <MdSubject className={className} />;
    case FieldType.number:
      return <HiOutlineHashtag className={className} />;
    case FieldType.radio:
      return <MdRadioButtonChecked className={className} />;
    case FieldType.checkbox:
      return <MdCheckBox className={className} />;
    case FieldType.section:
      return <HiOutlineDocumentText className={className} />;
    case FieldType.logic:
      return <HiOutlineVariable className={className} />;
  }
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
