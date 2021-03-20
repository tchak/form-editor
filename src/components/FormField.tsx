import React from 'react';

import { Field, Section, isSection } from '../tree';
import { FormLabel } from './FormLabel';
import { FieldInput } from './FieldInput';
import { FormSection } from './FormSection';

export function FormField({ field }: { field: Field | Section }) {
  if (isSection(field)) {
    return <FormSection field={field} />;
  } else {
    return (
      <FormLabel field={field}>
        <FieldInput field={field} />
      </FormLabel>
    );
  }
}
