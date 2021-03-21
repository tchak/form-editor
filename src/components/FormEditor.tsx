import React from 'react';
import { useDrop } from 'react-dnd';

import { usePage } from '../hooks';
import { FormEditorField } from './FormEditorField';

export function FormEditor() {
  const page = usePage();

  const [, drop] = useDrop(() => ({ accept: 'Field' }));
  return (
    <div>
      <div>
        <input
          className="text-blue-500 border-none font-bold text-4xl pl-0 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded"
          type="text"
          value={page.label}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          onChange={() => {}}
        />
      </div>
      <ul className="pb-20 mt-5" ref={drop}>
        {page.content.map((field) => (
          <FormEditorField key={field.id} field={field} />
        ))}
      </ul>
    </div>
  );
}
