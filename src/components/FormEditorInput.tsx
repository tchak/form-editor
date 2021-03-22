import React from 'react';

import { Field, FieldType } from '../tree';
import { FormEditorRadio } from './FormEditorRadio';
import { FormEditorLogic } from './FormEditorLogic';

export function FormEditorInput({ field }: { field: Field }) {
  switch (field.type) {
    case FieldType.text:
      return (
        <input
          type="text"
          id={field.id}
          tabIndex={-1}
          readOnly
          className="w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-300 rounded-md"
        />
      );
    case FieldType.longtext:
      return (
        <textarea
          id={field.id}
          tabIndex={-1}
          readOnly
          className="w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-300 rounded-md"
          rows={3}
        ></textarea>
      );
    case FieldType.checkbox:
      return (
        <input
          id={field.id}
          type="checkbox"
          checked={true}
          tabIndex={-1}
          readOnly
          className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none mt-1"
        />
      );
    case FieldType.number:
      return (
        <input
          id={field.id}
          type="number"
          tabIndex={-1}
          readOnly
          className="w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-300 rounded-md"
        />
      );
    case FieldType.radio:
      return <FormEditorRadio field={field} />;
    case FieldType.logic:
      return <FormEditorLogic field={field} />;
    default:
      return null;
  }
}
