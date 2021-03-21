import React from 'react';

import { Field, Section, isSection } from '../tree';
import { FormEditorLabel } from './FormEditorLabel';
import { FormEditorInput } from './FormEditorInput';
import { FormEditorSection } from './FormEditorSection';

export function FormEditorField({ field }: { field: Field | Section }) {
  if (isSection(field)) {
    return <FormEditorSection field={field} />;
  } else {
    return (
      <FormEditorLabel field={field}>
        <FormEditorInput field={field} />
      </FormEditorLabel>
    );
  }
}
