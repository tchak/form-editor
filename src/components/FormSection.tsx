import React from 'react';
import { useDrop } from 'react-dnd';

import { Field, Section } from '../tree';

import { FormLabel } from './FormLabel';
import { FormField } from './FormField';

export function FormSection({ field }: { field: Section }) {
  const [, drop] = useDrop(() => ({ accept: 'Field' }));

  return (
    <FormLabel field={field}>
      <ul ref={drop}>
        {field.content.map((field) => (
          <FormField key={field.id} field={field} />
        ))}
        <SectionInsert field={field} />
      </ul>
    </FormLabel>
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
