import { createNanoEvents, Emitter } from 'nanoevents';
import { v4 as uuid } from 'uuid';

export enum FieldType {
  text = 'text',
  longtext = 'longtext',
  checkbox = 'checkbox',
  radio = 'radio',
  number = 'number',
  section = 'section',
  logic = 'logic',
}

export interface FieldSchema {
  id?: string;
  type: FieldType;
  label: string;
  description?: string | null;
  unit?: string;
  required?: boolean;
  options?: string[];
  content?: FieldSchema[];
  logic?: FieldLogic;
  matrix?: boolean;
  matrixAddLabel?: string;
}

export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
}

export enum ConditionOperator {
  IS = 'IS',
  IS_NOT = 'IS_NOT',
  IS_EMPTY = 'IS_EMPTY',
  CONTAINS = 'CONTAINS',
  CONTAINS_NOT = 'CONTAINS_NOT',
  IS_NOT_EMPTY = 'IS_NOT_EMPTY',
  IS_BEFORE = 'IS_BEFORE',
  IS_AFTER = 'IS_AFTER',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
}

export enum Action {
  hide = 'hide',
  require = 'require',
}

export type ConditionValue =
  | string
  | number
  | boolean
  | Date
  | string[]
  | Record<string, ConditionValue>[];

export interface ConditionExpression {
  operator: ConditionOperator;
  targetId: string;
  value: ConditionValue;
}

export interface ActionExpression {
  action: Action;
  targetId?: string;
}

export interface FieldLogic {
  conditions: ConditionExpression[];
  operator: LogicalOperator;
  actions: ActionExpression[];
}

type PatchCallback = (field: Field | Section) => void;
type FieldEmitter = Emitter<{ patch: PatchCallback }>;

interface FieldSettings {
  label: string;
  description?: string | null;
  unit?: string;
  required?: boolean;
  options?: string[];
  logic?: FieldLogic;
  matrix?: boolean;
  matrixAddLabel?: string;
}

export function isUnaryOperator(operator: ConditionOperator) {
  return (
    operator == ConditionOperator.IS_EMPTY ||
    operator == ConditionOperator.IS_NOT_EMPTY
  );
}

export function isSection(field: Field | Section): field is Section {
  return field.type == FieldType.section;
}

export function isField(field: Field | Section): field is Field {
  return field.type != FieldType.section;
}

export function isLogic(field: Field): boolean {
  return field.type == FieldType.logic;
}

export function isMatrix(field: Field | Section): field is Section {
  return isSection(field) && field.matrix;
}

export class Field {
  #id: string;
  #type: FieldType;
  #settings: FieldSettings;
  #emitter?: FieldEmitter;
  #parent?: Section;

  constructor(field: FieldSchema, parent?: Section, emitter?: FieldEmitter) {
    this.#id = field.id ?? uuid();
    this.#type = field.type;
    this.#settings = {
      label: field.label,
      description: field.description,
      required: field.required,
      options: field.options,
      unit: field.unit,
      logic: field.logic,
      matrix: field.matrix,
      matrixAddLabel: field.matrixAddLabel,
    };
    this.#emitter = emitter ?? parent?.emitter;
    this.#parent = parent;
  }

  get id() {
    return this.#id;
  }

  get type() {
    return this.#type;
  }

  get label() {
    return this.#settings.label;
  }

  get description() {
    return this.#settings.description;
  }

  get required() {
    return this.#settings.required ?? false;
  }

  get options() {
    if (this.type == FieldType.radio) {
      return this.#settings.options ?? [];
    }
    return [];
  }

  get optionsWithBlank() {
    if (this.type == FieldType.radio) {
      return this.required ? this.options : ['', ...this.options];
    } else if (this.type == FieldType.checkbox) {
      return this.required ? ['true', 'false'] : ['', 'true', 'false'];
    }
    return [];
  }

  get logic(): FieldLogic {
    if (isLogic(this) && this.#settings.logic) {
      return this.#settings.logic;
    }
    throw new TypeError(`Field #${this.id} is not of type logic`);
  }

  get matrix(): boolean {
    return this.type == FieldType.section && !!this.#settings.matrix;
  }

  get emitter(): FieldEmitter {
    if (this.#emitter) {
      return this.#emitter;
    }
    return this.parent.emitter;
  }

  get parent() {
    if (this.#parent) {
      return this.#parent;
    }
    throw new Error(`Orphaned field #${this.id}`);
  }

  set parent(parent: Section) {
    this.#parent = parent;
  }

  get index() {
    if (this.#parent) {
      return this.#parent.content.indexOf(this);
    }
    return -1;
  }

  get first(): boolean {
    return this.index == 0;
  }

  get last(): boolean {
    return this.index == this.parent.content.length - 1;
  }

  get sectionIndex(): string {
    if (this.#parent) {
      const index = this.#parent.content
        .filter(({ type }) => type == FieldType.section)
        .indexOf(this);
      const parentSectionIndex = this.#parent.sectionIndex;
      if (parentSectionIndex) {
        return index != -1 ? `${parentSectionIndex}${index + 1}.` : '';
      }
      return index != -1 ? `${index + 1}.` : '';
    }
    return '';
  }

  get displayLabel() {
    if (this.label) {
      return this.label;
    }
    return `Champ "${this.type}" sans nom`;
  }

  get matrixAddLabel(): string {
    if (!this.matrix) {
      return '';
    }
    return this.#settings.matrixAddLabel ?? 'Ajouter un block';
  }

  get defaultValue() {
    switch (this.type) {
      case FieldType.checkbox:
      case FieldType.radio:
        return this.optionsWithBlank[0] ?? '';
      case FieldType.number:
        return 0;
      default:
        return '';
    }
  }

  get closestMatrix(): Section | undefined {
    if (this.#parent) {
      if (isMatrix(this.parent) && this.parent.matrix) {
        return this.parent;
      }
      return this.parent.closestMatrix;
    }
  }

  htmlInputName(index = 0): string {
    const matrix = this.closestMatrix;
    if (matrix) {
      return `${matrix.id}.${index}.${this.id}`;
    }
    return this.id;
  }

  htmlInputId(index = 0) {
    return `input-${this.htmlInputName(index)}`;
  }

  get siblings() {
    return this.parent.content.filter(
      ({ id, type }) => id != this.id && type != FieldType.logic
    );
  }

  get siblingFields() {
    return this.parent.content.filter(
      ({ id, type }) =>
        id != this.id && type != FieldType.logic && type != FieldType.section
    );
  }

  get siblingLogics() {
    return this.parent.content.filter(
      ({ id, type }) => id != this.id && type == FieldType.logic
    );
  }

  get operators() {
    const base = [
      ConditionOperator.IS,
      ConditionOperator.IS_NOT,
      ConditionOperator.IS_EMPTY,
      ConditionOperator.IS_NOT_EMPTY,
    ];
    switch (this.type) {
      case FieldType.text:
      case FieldType.longtext:
        return [
          ...base,
          ConditionOperator.CONTAINS,
          ConditionOperator.CONTAINS_NOT,
          ConditionOperator.STARTS_WITH,
          ConditionOperator.ENDS_WITH,
        ];
      default:
        return base;
    }
  }

  get canAddLogic() {
    const next = this.parent.content[this.index + 1];
    return this.type != FieldType.section && next?.type != FieldType.logic;
  }

  on(event: 'patch', cb: PatchCallback) {
    return this.emitter.on(event, cb);
  }

  remove() {
    const parent = this.parent;
    parent.content.splice(this.index, 1);
    this.#parent = undefined;
    parent.emitter.emit('patch', parent);
  }

  moveAfter(field: Field | Section) {
    field.parent.insert(this, field.index);
  }

  moveUp() {
    if (!this.first) {
      this.parent.insert(this, this.index - 1);
    }
  }

  moveDown() {
    if (!this.last) {
      this.parent.insert(this, this.index + 1);
    }
  }

  update(input: Partial<FieldSettings>) {
    Object.assign(this.#settings, input);
    this.emitter.emit('patch', this);
  }

  getValidator(values: Record<string, ConditionValue>, index?: number) {
    return (value: ConditionValue) => {
      if (this.isRequired(values, index) && empty(value)) {
        return 'Required';
      }
    };
  }

  isHidden(values: Record<string, ConditionValue>, index = 0) {
    const logicFields = this.siblingLogics.filter(({ logic }) =>
      logic.actions.find(
        ({ targetId, action }) => this.id == targetId && action == Action.hide
      )
    );
    return computeLogics(
      logicFields.map(({ logic }) => logic),
      values,
      isMatrix(this.parent) ? [this.parent.id, index] : undefined
    );
  }

  isRequired(values: Record<string, ConditionValue>, index = 0) {
    if (this.required) {
      return true;
    }
    const logicFields = this.siblingLogics.filter(({ logic }) =>
      logic.actions.find(
        ({ targetId, action }) =>
          this.id == targetId && action == Action.require
      )
    );
    return computeLogics(
      logicFields.map(({ logic }) => logic),
      values,
      isMatrix(this.parent) ? [this.parent.id, index] : undefined
    );
  }

  toJSON(): FieldSchema {
    return {
      id: this.id,
      type: this.type,
      label: this.label,
      description: this.description,
      options: this.options,
      required: this.required,
      unit: this.#settings.unit,
      logic: this.#settings.logic,
      matrix: this.#settings.matrix,
      matrixAddLabel: this.#settings.matrixAddLabel,
    };
  }
}

export class Section extends Field {
  content: (Field | Section)[];

  constructor(field: FieldSchema, parent?: Section, emitter?: FieldEmitter) {
    if (field.type != FieldType.section) {
      throw new TypeError(
        `Field type expected to be "section" but was "${field.type}"`
      );
    }
    super(field, parent, emitter);
    this.content = (field.content ?? []).map((field) => {
      if (field.type == FieldType.section) {
        return new Section(field, this, this.emitter);
      }
      return new Field(field, this, this.emitter);
    });
  }

  get publicContent() {
    return this.content.filter(({ type }) => type != FieldType.logic);
  }

  get publicFields(): (Field | Section)[] {
    return this.publicContent.flatMap((field) =>
      isSection(field) && !field.matrix ? field.publicFields : [field]
    );
  }

  get initialValues(): Record<string, ConditionValue> {
    return Object.fromEntries(
      this.publicFields.map((field) =>
        isMatrix(field) ? [field.id, []] : [field.id, '']
      )
    );
  }

  matrixValues(
    values: Record<string, ConditionValue>
  ): Record<string, ConditionValue>[] {
    const value = values[this.id];
    if (Array.isArray(value)) {
      return value as Record<string, ConditionValue>[];
    }
    return [];
  }

  insert(field: Field | Section, atIndex: number) {
    if (field.index != -1) {
      field.parent.content.splice(field.index, 1);
    }
    this.content.splice(atIndex, 0, field);
    field.parent = this;
    this.emitter.emit('patch', this);
  }

  findById(id: string): Field | Section | undefined {
    if (this.id == id) {
      return this;
    }
    for (const field of this.content) {
      if (isSection(field)) {
        const found = field.findById(id);
        if (found) {
          return found;
        }
      } else if (field.id == id) {
        return field;
      }
    }
  }

  toJSON(): FieldSchema {
    return {
      ...super.toJSON(),
      content: this.content.map((field) => field.toJSON()),
    };
  }
}

export class Page extends Section {
  constructor(field: FieldSchema) {
    super(field, undefined, createNanoEvents());
  }
}

function computeLogics(
  logics: FieldLogic[],
  values: Record<string, ConditionValue>,
  matrix?: [string, number]
) {
  return logics.find(({ conditions, operator }) =>
    computeConditions(operator, conditions, values, matrix)
  );
}

function computeConditions(
  operator: LogicalOperator,
  conditions: ConditionExpression[],
  values: Record<string, ConditionValue>,
  matrix?: [string, number]
): boolean {
  if (conditions.length > 1) {
    if (operator == LogicalOperator.AND) {
      return !conditions.find(
        (condition) => computeCondition(condition, values, matrix) === false
      );
    }
    return !!conditions.find((condition) =>
      computeCondition(condition, values, matrix)
    );
  }
  return computeCondition(conditions[0], values, matrix);
}

function getValue(
  values: Record<string, ConditionValue>,
  targetId: string,
  matrix?: [string, number]
) {
  if (!matrix) {
    return values[targetId];
  }
  const array = values[matrix[0]];
  if (Array.isArray(array)) {
    return (array as Record<string, ConditionValue>[])[matrix[1]][targetId];
  }
  throw new Error('Invalid value');
}

function computeCondition(
  condition: ConditionExpression,
  values: Record<string, ConditionValue>,
  matrix?: [string, number]
) {
  return computeOperator(
    condition.operator,
    getValue(values, condition.targetId, matrix),
    condition.value
  );
}

function computeOperator(
  operator: ConditionOperator,
  left: ConditionValue,
  right: ConditionValue
) {
  switch (operator) {
    case ConditionOperator.IS:
      return left == right;
    case ConditionOperator.IS_NOT:
      return left !== right;
    case ConditionOperator.IS_EMPTY:
      return empty(left);
    case ConditionOperator.IS_NOT_EMPTY:
      return !empty(left);
    case ConditionOperator.CONTAINS:
      return contains(left, right);
    case ConditionOperator.CONTAINS_NOT:
      return !contains(left, right);
    case ConditionOperator.STARTS_WITH:
      return `${left}`.startsWith(`${right}`);
    case ConditionOperator.ENDS_WITH:
      return `${left}`.endsWith(`${right}`);
    default:
      return false;
  }
}

function empty(value: ConditionValue): boolean {
  if (Array.isArray(value)) {
    return value.length == 0;
  }
  return !value;
}

function contains(list: ConditionValue, value: ConditionValue) {
  if (value == null) {
    return false;
  }
  if (Array.isArray(list)) {
    return (list as string[]).includes(`${value}`);
  } else if (typeof list == 'string') {
    return list.includes(`${value}`);
  }
  return false;
}
