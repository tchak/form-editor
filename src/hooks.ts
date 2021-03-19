import { useEffect, useMemo, useState } from 'react';

import { FieldSchema, FieldType, Section } from './tree';

const defaultPage: FieldSchema = {
  id: '0',
  type: FieldType.section,
  label: 'Ma démarche',
  content: [
    {
      id: '1',
      type: FieldType.section,
      label: 'Qui êtes-vous ?',
      description: '',
      settings: {
        required: false,
      },
      content: [
        {
          id: '2',
          label: 'Nom',
          description: 'Votre nom',
          type: FieldType.text,
          settings: {
            required: false,
          },
        },
        {
          id: '3',
          label: 'Prénom',
          type: FieldType.text,
          settings: {
            required: false,
          },
        },
      ],
    },
    {
      id: '4',
      label: 'Étes vous islamo-gauchiste ?',
      type: FieldType.checkbox,
      settings: {
        required: true,
      },
    },
    {
      id: '5',
      label: 'À quel point ?',
      type: FieldType.radio,
      options: ['Un peu', 'Beucoup', 'Complètement'],
      settings: {
        required: false,
      },
    },
    {
      id: '6',
      label: 'Racontez nous votre vie !',
      type: FieldType.longtext,
      settings: {
        required: false,
      },
    },
  ],
};

export function usePage(): Section {
  const root = useMemo(() => new Section(defaultPage), []);
  const [render, setRender] = useState(0);

  useEffect(() =>
    root.on('patch', () => {
      setRender(render + 1);
    })
  );

  return root;
}
