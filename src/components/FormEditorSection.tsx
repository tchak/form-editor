import React from 'react';

import { Section } from '../tree';

import { FormEditorLabel } from './FormEditorLabel';
import { FormEditorField } from './FormEditorField';

export function FormEditorSection({ field }: { field: Section }) {
  return (
    <FormEditorLabel field={field}>
      <ul>
        {field.content.map((field) => (
          <FormEditorField key={field.id} field={field} />
        ))}
      </ul>
      {field.matrix && (
        <div className="flex justify-start">
          <button
            disabled={true}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {field.matrixAddLabel}
          </button>
        </div>
      )}
    </FormEditorLabel>
  );
}
