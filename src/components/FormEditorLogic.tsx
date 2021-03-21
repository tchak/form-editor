import React, { useMemo, useState } from 'react';
import { HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';

import {
  Field,
  ConditionExpression,
  ActionExpression,
  LogicalOperator,
  ConditionOperator,
  Action,
  FieldType,
  ConditionValue,
  isUnaryOperator,
} from '../tree';

export function FormEditorLogic({ field }: { field: Field }) {
  return (
    <div>
      <ul>
        {field.logic.conditions.map((expression, index) => (
          <li key={keyFromExpression(index, expression)}>
            <ConditionExpressionInput
              index={index}
              field={field}
              expression={expression}
            />
          </li>
        ))}
      </ul>
      <ul>
        {field.logic.actions.map((expression, index) => (
          <li key={keyFromExpression(index, expression)}>
            <ActionExpressionInput
              index={index}
              field={field}
              expression={expression}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConditionExpressionInput({
  index,
  field,
  expression,
}: {
  index: number;
  field: Field;
  expression: ConditionExpression;
}) {
  const intl = useIntl();
  const [logicalOperator, setLogicalOperator] = useState(field.logic.operator);
  const [operator, setOperator] = useState(expression.operator);
  const [target, setTarget] = useState(expression.targetId);
  const [value, setValue] = useState(expression.value);
  const targetField = useMemo<Field | undefined>(() => {
    if (target) {
      return field.parent.findById(target);
    }
  }, [field, target]);

  const saveLogicalOperator = (operator: LogicalOperator) => {
    setLogicalOperator(operator);
    field.update({ logic: { ...field.logic, operator } });
  };
  const saveOperator = (operator: ConditionOperator) => {
    setOperator(operator);
    const conditions = [...field.logic.conditions];
    conditions.splice(index, 1, { ...expression, operator });
    field.update({
      logic: { ...field.logic, conditions },
    });
  };
  const saveTarget = (targetId: string) => {
    setTarget(targetId);
    const conditions = [...field.logic.conditions];
    conditions.splice(index, 1, { ...expression, targetId });
    field.update({ logic: { ...field.logic, conditions } });
  };
  const saveValue = (value: ConditionValue) => {
    setValue(value);
    const conditions = [...field.logic.conditions];
    conditions.splice(index, 1, { ...expression, value });
    field.update({ logic: { ...field.logic, conditions } });
  };
  const addCondition = () => {
    const conditions = [...field.logic.conditions];
    conditions.splice(index + 1, 0, {
      operator: ConditionOperator.IS,
      targetId: target,
      value: targetField?.defaultValue ?? '',
    });
    field.update({ logic: { ...field.logic, conditions } });
  };
  const removeCondition = () => {
    const conditions = [...field.logic.conditions];
    conditions.splice(index, 1);
    field.update({ logic: { ...field.logic, conditions } });
  };

  return (
    <div className="flex items-center mb-2">
      {index == 1 ? (
        <select
          value={logicalOperator}
          onChange={({ currentTarget: { value } }) =>
            saveLogicalOperator(value as LogicalOperator)
          }
          style={{ width: '82px' }}
          className="mr-1 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value={LogicalOperator.AND}>
            {intl.formatMessage({ id: 'And', defaultMessage: 'And' })}
          </option>
          <option value={LogicalOperator.OR}>
            {intl.formatMessage({ id: 'Or', defaultMessage: 'Or' })}
          </option>
        </select>
      ) : (
        <span
          style={{ width: '82px' }}
          className="mr-1 pr-1 text-sm font-medium text-gray-800 text-right"
        >
          {index == 0 ? (
            <FormattedMessage id="When" defaultMessage="When" />
          ) : field.logic.operator == LogicalOperator.AND ? (
            <FormattedMessage id="And" defaultMessage="And" />
          ) : (
            <FormattedMessage id="Or" defaultMessage="Or" />
          )}
        </span>
      )}
      <select
        value={target}
        onChange={({ currentTarget: { value } }) => saveTarget(value)}
        className="w-60 mr-1 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {field.siblingFields.map((field) => (
          <option key={field.id} value={field.id}>
            {field.displayLabel}
          </option>
        ))}
      </select>
      {targetField && (
        <select
          value={operator}
          onChange={({ currentTarget: { value } }) =>
            saveOperator(value as ConditionOperator)
          }
          className="w-36 mr-1 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {targetField.operators.map((operator) => (
            <option key={operator} value={operator}>
              {formatOperator(intl, operator)}
            </option>
          ))}
        </select>
      )}
      {targetField && !isUnaryOperator(operator) && (
        <ConditionValueInput
          field={targetField}
          value={value}
          onChange={saveValue}
        />
      )}
      <div className="text-right text-lg flex">
        {index != 0 ? (
          <button
            className="mr-1 hover:text-red-600"
            type="button"
            onClick={removeCondition}
          >
            <HiOutlineMinus />
          </button>
        ) : (
          <span className="mr-1">
            <HiOutlineMinus className="opacity-0" />
          </span>
        )}
        <button type="button" onClick={addCondition}>
          <HiOutlinePlus />
        </button>
      </div>
    </div>
  );
}

function ActionExpressionInput({
  index,
  field,
  expression,
}: {
  field: Field;
  index: number;
  expression: ActionExpression;
}) {
  const intl = useIntl();
  const [action, setAction] = useState(expression.action);
  const [target, setTarget] = useState(expression.targetId);

  const saveAction = (action: Action) => {
    setAction(action);
    const actions = [...field.logic.actions];
    actions.splice(index, 1, { ...expression, action });
    field.update({ logic: { ...field.logic, actions } });
  };
  const saveTarget = (targetId: string) => {
    setTarget(targetId);
    const actions = [...field.logic.actions];
    actions.splice(index, 1, { ...expression, targetId });
    field.update({ logic: { ...field.logic, actions } });
  };
  const addAction = () => {
    const actions = [...field.logic.actions];
    actions.splice(index + 1, 0, { action });
    field.update({ logic: { ...field.logic, actions } });
  };
  const removeAction = () => {
    const actions = [...field.logic.actions];
    actions.splice(index, 1);
    field.update({ logic: { ...field.logic, actions } });
  };

  return (
    <div className="flex items-center mb-2">
      <span
        className="mr-1 pr-1 text-sm font-medium text-gray-800 w-20 text-right"
        style={{ width: '82px' }}
      >
        {index == 0 ? (
          <FormattedMessage id="Then" defaultMessage="Then" />
        ) : (
          <FormattedMessage id="And" defaultMessage="And" />
        )}
      </span>
      <select
        value={action}
        onChange={({ currentTarget: { value } }) => saveAction(value as Action)}
        className="w-60 mr-1 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value={Action.hide}>
          {intl.formatMessage({
            id: Action.hide,
            defaultMessage: 'Hide block',
          })}
        </option>
        <option value={Action.require}>
          {intl.formatMessage({
            id: Action.require,
            defaultMessage: 'Require answer',
          })}
        </option>
      </select>
      <select
        value={target}
        onChange={({ currentTarget: { value } }) => saveTarget(value)}
        className="flex-grow mr-1 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {!expression.targetId ? <option value=""></option> : null}
        {field.siblings.map((field) => (
          <option key={field.id} value={field.id}>
            {field.displayLabel}
          </option>
        ))}
      </select>
      <div className="text-lg flex">
        {index != 0 ? (
          <button
            className="mr-1 hover:text-red-600"
            type="button"
            onClick={removeAction}
          >
            <HiOutlineMinus />
          </button>
        ) : (
          <span className="mr-1">
            <HiOutlineMinus className="opacity-0" />
          </span>
        )}
        <button type="button" onClick={addAction}>
          <HiOutlinePlus />
        </button>
      </div>
    </div>
  );
}

function ConditionValueInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: ConditionValue;
  onChange: (value: ConditionValue) => void;
}) {
  switch (field.type) {
    case FieldType.checkbox:
    case FieldType.radio:
      return (
        <select
          value={`${value}`}
          onChange={({ currentTarget: { value } }) =>
            onChange(
              field.type == FieldType.checkbox ? value === 'true' : value
            )
          }
          className="flex-grow mr-1 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {field.optionsWithBlank.map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        </select>
      );
    default:
      return (
        <input
          type="text"
          value={value as string}
          onChange={({ currentTarget: { value } }) => onChange(value)}
          className="flex-grow mr-1 p-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
        />
      );
  }
}

function keyFromExpression(
  index: number,
  expression: ConditionExpression | ActionExpression
) {
  if ('operator' in expression) {
    return [index, expression.operator, expression.targetId]
      .filter((key) => key)
      .join('-');
  }

  return [index, expression.action, expression.targetId]
    .filter((key) => key)
    .join('-');
}

function formatOperator(intl: IntlShape, operator: ConditionOperator): string {
  switch (operator) {
    case ConditionOperator.IS:
      return intl.formatMessage({ id: operator, defaultMessage: 'is' });
    case ConditionOperator.IS_NOT:
      return intl.formatMessage({ id: operator, defaultMessage: 'is not' });
    case ConditionOperator.IS_EMPTY:
      return intl.formatMessage({ id: operator, defaultMessage: 'is empty' });
    case ConditionOperator.IS_NOT_EMPTY:
      return intl.formatMessage({
        id: operator,
        defaultMessage: 'is not empty',
      });
    case ConditionOperator.IS_AFTER:
      return intl.formatMessage({ id: operator, defaultMessage: 'is after' });
    case ConditionOperator.IS_BEFORE:
      return intl.formatMessage({ id: operator, defaultMessage: 'is before' });
    case ConditionOperator.STARTS_WITH:
      return intl.formatMessage({
        id: operator,
        defaultMessage: 'starts with',
      });
    case ConditionOperator.ENDS_WITH:
      return intl.formatMessage({ id: operator, defaultMessage: 'ends with' });
    case ConditionOperator.CONTAINS:
      return intl.formatMessage({ id: operator, defaultMessage: 'contains' });
    case ConditionOperator.CONTAINS_NOT:
      return intl.formatMessage({
        id: operator,
        defaultMessage: 'doesn’t contain',
      });
  }
}
