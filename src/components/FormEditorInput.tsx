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
          className="text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
        />
      );
    case FieldType.longtext:
      return (
        <textarea
          id={field.id}
          tabIndex={-1}
          readOnly
          className="text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
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
          className="text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
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
