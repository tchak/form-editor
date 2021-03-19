import React from 'react';
import { DialogOverlay, DialogContent } from '@reach/dialog';

import { Field, Section, FieldType } from '../tree';

const FIELDS = Object.keys(FieldType);

export function AddFieldModal({
  show,
  done,
}: {
  show: boolean;
  done: (field?: Field | Section) => void;
}) {
  const createField = (type: FieldType) => {
    if (type == FieldType.section) {
      return new Section({
        type: FieldType.section,
        label: 'Nouvelle section',
      });
    } else {
      return new Field({
        type,
        label: 'Nouveau champ',
      });
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
                  onClick={() => done(createField(fieldType as FieldType))}
                >
                  {fieldType}
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
      </div>
    </DialogOverlay>
  );
}
