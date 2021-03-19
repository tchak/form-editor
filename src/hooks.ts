import { useEffect, useMemo, useState } from 'react';

import { FieldSchema, FieldType, Page } from './tree';

const defaultPage: FieldSchema = {
  type: FieldType.section,
  label: 'Ma démarche',
  content: [
    {
      type: FieldType.section,
      label: 'Qui êtes-vous ?',
      description: '',
      settings: {
        required: false,
      },
      content: [
        {
          label: 'Nom',
          description: 'Votre nom',
          type: FieldType.text,
          settings: {
            required: false,
          },
        },
        {
          label: 'Prénom',
          type: FieldType.text,
          settings: {
            required: false,
          },
        },
      ],
    },
    {
      label: 'Étes vous islamo-gauchiste ?',
      type: FieldType.checkbox,
      settings: {
        required: true,
      },
    },
    {
      label: 'À quel point ?',
      type: FieldType.radio,
      options: ['Un peu', 'Beaucoup', 'Complètement'],
      settings: {
        required: false,
      },
    },
    {
      label: 'Racontez nous votre vie !',
      type: FieldType.longtext,
      settings: {
        required: false,
      },
    },
  ],
};

const FORM_EDITOR_KEY = 'form-editor-schema';

function getDefaultPage(): FieldSchema {
  const json = localStorage.getItem(FORM_EDITOR_KEY);
  if (json) {
    return JSON.parse(json);
  }
  return defaultPage;
}

let currentPage: FieldSchema | undefined;
function savePage(page: FieldSchema) {
  currentPage = page;
  requestAnimationFrame(() =>
    currentPage
      ? localStorage.setItem(FORM_EDITOR_KEY, JSON.stringify(currentPage))
      : false
  );
}

function resetPage() {
  currentPage = undefined;
  localStorage.removeItem(FORM_EDITOR_KEY);
}

export function usePage(): Page {
  const root = useMemo(() => new Page(getDefaultPage()), []);
  const [render, setRender] = useState(0);

  useEffect(() =>
    root.on('patch', () => {
      savePage(root.toJSON());
      setRender(render + 1);
    })
  );

  return root;
}
