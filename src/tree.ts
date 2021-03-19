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
  description?: string;
  unit?: string;
  options?: string[];
  content?: FieldSchema[];
  settings?: FieldSettings;
}

export interface FieldSettings {
  required?: boolean;
}

type PatchCallback = (field: Field | Section) => void;
type FieldEmitter = Emitter<{ patch: PatchCallback }>;

export function isSection(field: Field | Section): field is Section {
  return field.type == FieldType.section;
}

export function isField(field: Field | Section): field is Field {
  return field.type != FieldType.section;
}

export class Field {
  #id: string;
  #type: FieldType;
  #label: string;
  #description?: string;
  #settings?: FieldSettings;
  #options?: string[];
  #emitter?: FieldEmitter;
  #parent?: Section;

  constructor(field: FieldSchema, parent?: Section, emitter?: FieldEmitter) {
    this.#id = field.id ?? uuid();
    this.#type = field.type;
    this.#label = field.label;
    this.#description = field.description;
    this.#settings = field.settings;
    this.#options = field.options;
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
    return this.#label;
  }

  get description() {
    return this.#description;
  }

  get settings() {
    return this.#settings ?? {};
  }

  get options() {
    if (this.type == FieldType.radio) {
      return this.#options ?? [];
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
}

export class Page extends Section {
  constructor(field: FieldSchema) {
    super(field, undefined, createNanoEvents());
  }
}
