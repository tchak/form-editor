import React from 'react';

import { useSectionDrop, useSectionInsertDrop } from '../field-dnd';
import { Section } from '../tree';

import { FormEditorLabel } from './FormEditorLabel';
import { FormEditorField } from './FormEditorField';

export function FormEditorSection({ field }: { field: Section }) {
  const drop = useSectionDrop();

  return (
    <FormEditorLabel field={field}>
      <ul ref={drop}>
        {field.content.map((field) => (
          <FormEditorField key={field.id} field={field} />
        ))}
      </ul>
      <SectionInsert field={field} />
    </FormEditorLabel>
  );
}

function SectionInsert({ field }: { field: Section }) {
  const drop = useSectionInsertDrop(field);
  return <div className="p-2" ref={drop}></div>;
}
