import { createNanoEvents, Emitter } from 'nanoevents';

export enum FieldType {
  text = 'text',
  longtext = 'longtext',
  checkbox = 'checkbox',
  radio = 'radio',
  number = 'number',
  section = 'section',
}

export interface FieldSchema {
  id: string;
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
  #emitter: FieldEmitter;
  parent?: Section;

  constructor(field: FieldSchema, parent?: Section, emitter?: FieldEmitter) {
    this.#id = field.id;
    this.#type = field.type;
    this.#label = field.label;
    this.#description = field.description;
    this.#emitter = emitter ?? createNanoEvents();
    this.#settings = field.settings;
    this.#options = field.options;
    this.parent = parent;
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

  get emitter() {
    return this.#emitter;
  }

  get index() {
    if (this.parent) {
      return this.parent.content.indexOf(this);
    }
    return -1;
  }

  on(event: 'patch', cb: PatchCallback) {
    return this.#emitter.on(event, cb);
  }

  remove() {
    if (this.parent) {
      this.parent.content.splice(this.index, 1);
      this.parent = undefined;
      this.#emitter.emit('patch', this);
    }
  }

  moveAfter(field: Field | Section) {
    if (this.parent && field.parent) {
      field.parent.insert(this, field.index);
    }
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
    if (field.parent) {
      field.parent.content.splice(field.index, 1);
      field.parent = undefined;
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
