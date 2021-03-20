import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';

import { FieldSchema, FieldType, Page } from './tree';

const defaultPage: FieldSchema = {
  type: FieldType.section,
  label: 'Ma démarche',
  content: [
    {
      type: FieldType.section,
      label: 'Qui êtes-vous ?',
      description: '',
      content: [
        {
          label: 'Nom',
          description: 'Votre nom',
          type: FieldType.text,
        },
        {
          label: 'Prénom',
          type: FieldType.text,
        },
      ],
    },
    {
      label: 'Étes vous islamo-gauchiste ?',
      type: FieldType.checkbox,
      required: true,
    },
    {
      label: 'À quel point ?',
      type: FieldType.radio,
      options: ['Un peu', 'Beaucoup', 'Complètement'],
    },
    {
      label: 'Racontez nous votre vie !',
      type: FieldType.longtext,
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

export function resetPage() {
  currentPage = undefined;
  localStorage.removeItem(FORM_EDITOR_KEY);
  location.reload();
}

export function usePage(): Page {
  const initialData = useMemo(() => new Page(getDefaultPage()), []);
  const { data, refetch } = useQuery('form', () => initialData, {
    initialData,
  });

  useEffect(() =>
    data?.on('patch', () => {
      savePage(data.toJSON());
      refetch();
    })
  );

  return data ?? initialData;
}
