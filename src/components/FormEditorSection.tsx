import React from 'react';
import { useDrop } from 'react-dnd';

import { Field, Section } from '../tree';

import { FormEditorLabel } from './FormEditorLabel';
import { FormEditorField } from './FormEditorField';

export function FormEditorSection({ field }: { field: Section }) {
  const [, drop] = useDrop(() => ({ accept: 'Field' }));

  return (
    <FormEditorLabel field={field}>
      <ul ref={drop}>
        {field.content.map((field) => (
          <FormEditorField key={field.id} field={field} />
        ))}
        <SectionInsert field={field} />
      </ul>
    </FormEditorLabel>
  );
}

function SectionInsert({ field }: { field: Section }) {
  const [, drop] = useDrop(
    () => ({
      accept: 'Field',
      canDrop: () => false,
      hover(item: Field | Section) {
        if (item != field && !field.content.includes(item)) {
          field.insert(item, field.content.length);
        }
      },
    }),
    []
  );
  return <li className="p-2" ref={drop}></li>;
}
