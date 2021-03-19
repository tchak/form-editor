import { createNanoEvents, Emitter } from 'nanoevents';
import { v4 as uuid } from 'uuid';

export enum FieldType {
  text = 'text',
  longtext = 'longtext',
  checkbox = 'checkbox',
  radio = 'radio',
  number = 'number',
  section = 'section',
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
}

type PatchCallback = (field: Field | Section) => void;
type FieldEmitter = Emitter<{ patch: PatchCallback }>;

interface FieldSettings {
  label: string;
  description?: string | null;
  unit?: string;
  required?: boolean;
  options?: string[];
}

export function isSection(field: Field | Section): field is Section {
  return field.type == FieldType.section;
}

export function isField(field: Field | Section): field is Field {
  return field.type != FieldType.section;
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

  get sectionIndex() {
    if (this.#parent) {
      const index = this.#parent.content
        .filter(({ type }) => type == FieldType.section)
        .indexOf(this);
      return index != -1 ? `${index + 1}.` : '';
    }
    return '';
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

  update(input: Partial<FieldSettings>) {
    Object.assign(this.#settings, input);
    this.emitter.emit('patch', this);
  }

  toJSON(): FieldSchema {
    return {
      id: this.id,
      type: this.type,
      label: this.label,
      description: this.description,
      options: this.options,
      required: this.required,
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
