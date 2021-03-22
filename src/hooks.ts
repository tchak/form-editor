import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { FieldSchema, Page } from './tree';
import { defaultPage } from './default-page';

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

const initialData = new Page(getDefaultPage());

export function usePage(): Page {
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
