import { useCallback, useState } from 'react';
import update from 'immutability-helper';

export enum FieldType {
  text,
  longtext,
  checkbox,
  radio,
  number,
}

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  unit?: string;
  options?: string[];
  settings: FieldSettings;
}

export interface FieldSettings {
  required: boolean;
  description: boolean;
}

const defaultFields: Field[] = [
  {
    id: '1',
    label: 'Nom',
    description: 'Votre nom',
    type: FieldType.text,
    settings: {
      required: false,
      description: true,
    },
  },
  {
    id: '2',
    label: 'Prénom',
    type: FieldType.text,
    settings: {
      required: false,
      description: false,
    },
  },
  {
    id: '3',
    label: 'Étes vous islamo-gauchiste ?',
    type: FieldType.checkbox,
    settings: {
      required: true,
      description: false,
    },
  },
  {
    id: '4',
    label: 'À quel point ?',
    type: FieldType.radio,
    options: ['Un peu', 'Beucoup', 'Complètement'],
    settings: {
      required: false,
      description: false,
    },
  },
  {
    id: '5',
    label: 'Racontez nous votre vie !',
    type: FieldType.longtext,
    settings: {
      required: false,
      description: false,
    },
  },
];

export function useFields() {
  const [fields, setFields] = useState(defaultFields);

  const findField = useCallback(
    (id: string) => {
      const field = fields.find((field) => field.id == id) as Field;
      return {
        field,
        index: fields.indexOf(field),
      };
    },
    [fields]
  );

  const moveField = useCallback(
    (id: string, atIndex: number) => {
      const { field, index } = findField(id);
      setFields(
        update(fields, {
          $splice: [
            [index, 1],
            [atIndex, 0, field],
          ],
        })
      );
    },
    [findField, fields, setFields]
  );

  const removeField = useCallback(
    (id: string) => {
      const { index } = findField(id);
      setFields(
        update(fields, {
          $splice: [[index, 1]],
        })
      );
    },
    [findField, fields, setFields]
  );

  return {
    fields,
    findField,
    moveField,
    removeField,
  };
}
