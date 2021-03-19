import React, { useMemo, useState } from 'react';
import {
  Field,
  WhenExpression,
  ThenExpression,
  BinaryExpression,
  LogicalExpression,
  LogicalOperator,
  BinaryOperator,
  ThenAction,
  FieldType,
  BinaryExpressionValue,
  isUnaryOperator,
} from '../tree';

const ACTIONS = Object.keys(ThenAction);
const LOGICAL_OPERATORS = Object.keys(LogicalOperator);

export function FieldLogic({ field }: { field: Field }) {
  return (
    <div>
      <WhenExpressionInput field={field} expression={field.logic.when} />
      <ul>
        {field.logic.then.map((expression, index) => (
          <li key={index}>
            <ThenExpressionInput
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

function WhenExpressionInput({
  field,
  expression,
}: {
  field: Field;
  expression: WhenExpression;
}) {
  if ('id' in expression) {
    return <BinaryExpressionInput field={field} expression={expression} />;
  }
  return null;
}

function ThenExpressionInput({
  index,
  field,
  expression,
}: {
  field: Field;
  index: number;
  expression: ThenExpression;
}) {
  const [action, setAction] = useState(expression.action);
  const [target, setTarget] = useState(expression.id);

  const saveAction = (action: ThenAction) => {
    setAction(action);
    const then = [...field.logic.then];
    then.splice(index, 1, { ...expression, action });
    field.update({ logic: { ...field.logic, then } });
  };
  const saveTarget = (id: string) => {
    setTarget(id);
    const then = [...field.logic.then];
    then.splice(index, 1, { ...expression, id });
    field.update({ logic: { ...field.logic, then } });
  };

  return (
    <div className="flex items-center mt-2">
      <span className="px-2 text-sm font-medium text-gray-800">
        {index == 0 ? 'Then' : 'And'}
      </span>
      <select
        value={action}
        onChange={({ currentTarget: { value } }) =>
          saveAction(value as ThenAction)
        }
        className="ml-1 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {ACTIONS.map((action) => (
          <option key={action} value={action}>
            {action}
          </option>
        ))}
      </select>
      <select
        value={target}
        onChange={({ currentTarget: { value } }) => saveTarget(value)}
        className="ml-1 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {!expression.id ? <option value=""></option> : null}
        {field.siblings.map((field) => (
          <option key={field.id} value={field.id}>
            {field.displayLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function LogicalExpressionInput({
  field,
  expression,
}: {
  field: Field;
  expression: LogicalExpression;
}) {
  return (
    <div className="flex">
      <select
        value={expression.operator}
        onChange={() => {}}
        className="ml-1 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {LOGICAL_OPERATORS.map((operator) => (
          <option key={operator} value={operator}>
            {operator}
          </option>
        ))}
      </select>
    </div>
  );
}

function BinaryExpressionInput({
  field,
  expression,
}: {
  field: Field;
  expression: BinaryExpression;
}) {
  const [operator, setOperator] = useState(expression.operator);
  const [target, setTarget] = useState(expression.id);
  const [value, setValue] = useState(expression.value);
  const targetField = useMemo<Field | undefined>(() => {
    if (target) {
      return field.parent.findById(target);
    }
  }, [field, target]);

  const saveOperator = (operator: BinaryOperator) => {
    setOperator(operator);
    field.update({
      logic: { ...field.logic, when: { ...expression, operator } },
    });
  };
  const saveTarget = (id: string) => {
    setTarget(id);
    field.update({ logic: { ...field.logic, when: { ...expression, id } } });
  };
  const saveValue = (value: BinaryExpressionValue) => {
    setValue(value);
    field.update({ logic: { ...field.logic, when: { ...expression, value } } });
  };

  return (
    <div className="flex items-center">
      <span className="px-2 text-sm font-medium text-gray-800">When</span>
      <select
        value={target}
        onChange={({ currentTarget: { value } }) => saveTarget(value)}
        className="ml-1 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
            saveOperator(value as BinaryOperator)
          }
          className="ml-1 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {targetField.operators.map((operator) => (
            <option key={operator} value={operator}>
              {operator}
            </option>
          ))}
        </select>
      )}
      {targetField && !isUnaryOperator(operator) && (
        <BinaryExpressionInputValue
          field={targetField}
          value={value}
          onChange={saveValue}
        />
      )}
    </div>
  );
}

function BinaryExpressionInputValue({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: BinaryExpressionValue;
  onChange: (value: BinaryExpressionValue) => void;
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
          className="ml-1 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
          className="ml-1 p-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      );
  }
}
