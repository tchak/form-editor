import React from 'react';

import { usePage } from '../hooks';
import { FormEditorField } from './FormEditorField';

export function FormEditor() {
  const page = usePage();

  return (
    <div>
      <div>
        <input
          className="text-blue-500 border-none font-bold text-3xl p-0 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded"
          type="text"
          value={page.label}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          onChange={() => {}}
        />
      </div>
      <ul>
        {page.content.map((field) => (
          <FormEditorField key={field.id} field={field} />
        ))}
      </ul>
    </div>
  );
}
