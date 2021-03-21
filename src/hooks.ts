import { useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  Action,
  ConditionOperator,
  FieldSchema,
  FieldType,
  LogicalOperator,
  Page,
} from './tree';

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
        {
          label: 'Avez-vous des enfants ?',
          type: FieldType.section,
          matrix: true,
          content: [
            {
              label: 'Nom',
              type: FieldType.text,
            },
            {
              label: 'Prénom',
              type: FieldType.text,
            },
            {
              id: 'age-enfant',
              label: 'Age',
              type: FieldType.number,
            },
            {
              id: 'grande-question',
              label: 'La grande question sur la vie',
              type: FieldType.text,
            },
            {
              id: 'carte-electeur',
              label: 'Il a sa carte d’électeur ?',
              type: FieldType.text,
            },
            {
              label: '42',
              type: FieldType.logic,
              logic: {
                conditions: [
                  {
                    operator: ConditionOperator.IS_NOT,
                    targetId: 'age-enfant',
                    value: 42,
                  },
                ],
                operator: LogicalOperator.AND,
                actions: [{ action: Action.hide, targetId: 'grande-question' }],
              },
            },
            {
              label: 'Est-il mageur ?',
              type: FieldType.logic,
              logic: {
                conditions: [
                  {
                    operator: ConditionOperator.LESS_THEN,
                    targetId: 'age-enfant',
                    value: 18,
                  },
                ],
                operator: LogicalOperator.AND,
                actions: [{ action: Action.hide, targetId: 'carte-electeur' }],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'islamo-gauchiste',
      label: 'Étes vous islamo-gauchiste ?',
      type: FieldType.checkbox,
    },
    {
      id: 'point',
      label: 'À quel point ?',
      type: FieldType.radio,
      options: ['Un peu', 'Beaucoup', 'Complètement'],
      required: true,
    },
    {
      id: 'la-vie',
      label: 'Racontez nous votre vie !',
      type: FieldType.longtext,
    },
    {
      label: 'Racontez la vie',
      type: FieldType.logic,
      logic: {
        operator: LogicalOperator.OR,
        conditions: [
          {
            operator: ConditionOperator.IS_NOT,
            targetId: 'islamo-gauchiste',
            value: true,
          },
          {
            operator: ConditionOperator.IS_NOT,
            targetId: 'point',
            value: 'Complètement',
          },
        ],
        actions: [{ action: Action.hide, targetId: 'la-vie' }],
      },
    },
    {
      label: 'Menu déjeuner',
      type: FieldType.section,
      content: [
        {
          id: 'entree-ou-dessert',
          label: 'Vous prendrez un dessert ou une entrée ?',
          type: FieldType.radio,
          options: ['Dessert', 'Entrée'],
          required: true,
        },
        {
          id: 'desserts',
          label: 'Desserts',
          type: FieldType.radio,
          options: ['Tarte Tatin', 'Camembert', 'Île flottante'],
          required: true,
        },
        {
          id: 'entrees',
          label: 'Entrées',
          type: FieldType.radio,
          options: [
            'Velouté de poireau',
            'Carpaccio de betteraves',
            'Salade de papaye',
          ],
          required: true,
        },
        {
          label: 'Choisir le dessert',
          type: FieldType.logic,
          logic: {
            conditions: [
              {
                operator: ConditionOperator.IS_NOT,
                targetId: 'entree-ou-dessert',
                value: 'Dessert',
              },
            ],
            operator: LogicalOperator.AND,
            actions: [{ action: Action.hide, targetId: 'desserts' }],
          },
        },
        {
          label: 'Choisir l’entrée',
          type: FieldType.logic,
          logic: {
            conditions: [
              {
                operator: ConditionOperator.IS_NOT,
                targetId: 'entree-ou-dessert',
                value: 'Entrée',
              },
            ],
            operator: LogicalOperator.AND,
            actions: [{ action: Action.hide, targetId: 'entrees' }],
          },
        },
      ],
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
