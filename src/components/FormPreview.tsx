import React, { ReactNode } from 'react';
import {
  Formik,
  Form,
  Field as FormikField,
  FieldArray,
  ErrorMessage,
  useFormikContext,
} from 'formik';
import { FormattedMessage } from 'react-intl';
import { HiOutlinePlusCircle } from 'react-icons/hi';

import { usePage } from '../hooks';
import {
  Field,
  Section,
  isSection,
  FieldType,
  ConditionValue,
  isMatrix,
} from '../tree';

export function FormPreview() {
  const page = usePage();

  return (
    <Formik
      initialValues={page.initialValues}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form>
        <fieldset>
          <legend className="mb-5">
            <h1 className="text-blue-500 font-bold text-4xl">{page.label}</h1>
          </legend>

          {page.publicContent.map((field) => (
            <FormPreviewField key={field.id} field={field} />
          ))}
        </fieldset>

        <div className="py-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FormattedMessage id="Cancel" defaultMessage="Cancel" />
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FormattedMessage id="Save" defaultMessage="Save" />
            </button>
          </div>
        </div>
      </Form>
    </Formik>
  );
}

function FormPreviewField({
  field,
  index,
}: {
  field: Field | Section;
  index?: number;
}) {
  if (isMatrix(field)) {
    return <FormPreviewMatrix field={field} />;
  }
  if (isSection(field)) {
    return <FormPreviewSection field={field} index={index} />;
  }
  return (
    <FormPreviewLabel field={field} index={index}>
      <div className="mb-2 w-full">
        <FormPreviewInput field={field} index={index} />
        <ErrorMessage
          component="p"
          name={field.id}
          className="mt-2 text-sm text-red-600"
        />
      </div>
    </FormPreviewLabel>
  );
}

function FormPreviewSection({
  field,
  index,
}: {
  field: Section;
  index?: number;
}) {
  return (
    <fieldset className="mt-4">
      <legend className="text-2xl font-bold flex-auto text-blue-500">
        {field.sectionIndex} {field.label}
      </legend>
      {field.description && (
        <div className="mt-1 text-xs">{field.description}</div>
      )}

      {field.publicContent.map((field) => (
        <FormPreviewField key={field.id} field={field} index={index} />
      ))}
    </fieldset>
  );
}

function FormPreviewLabel({
  field,
  index,
  children,
}: {
  field: Field;
  index?: number;
  children: ReactNode;
}) {
  const { values } = useFormikContext<Record<string, ConditionValue>>();
  if (field.isHidden(values, index)) {
    return null;
  }
  return (
    <div className="mt-2 flex flex-col flex-grow">
      <div className="flex">
        <label
          htmlFor={field.htmlInputId(index)}
          className="font-semibold text-blue-500"
        >
          {field.sectionIndex} {field.label}
        </label>
        {field.isRequired(values, index) && (
          <span className="ml-2 font-medium text-2xl text-red-800">*</span>
        )}
      </div>

      {field.description && (
        <div className="mt-1 text-xs">{field.description}</div>
      )}
      {children}
    </div>
  );
}

function FormPreviewMatrix({ field }: { field: Section }) {
  return (
    <FieldArray name={field.htmlInputName()}>
      {({ push, form }) => (
        <fieldset className="mt-2">
          <legend className="text-2xl font-bold flex-auto text-blue-500">
            {field.label}
          </legend>
          {field.description && (
            <div className="mt-1 text-xs">{field.description}</div>
          )}
          {field.matrixValues(form.values).map((_, index) => (
            <div key={index}>
              {field.publicContent.map((field) => (
                <FormPreviewField key={field.id} index={index} field={field} />
              ))}
            </div>
          ))}
          <div className="mt-2 flex justify-start">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => push(field.initialValues)}
            >
              <HiOutlinePlusCircle className="-ml-0.5 mr-2 h-4 w-4" />
              {field.matrixAddLabel}
            </button>
          </div>
        </fieldset>
      )}
    </FieldArray>
  );
}

function FormPreviewInput({ field, index }: { field: Field; index?: number }) {
  if (field.type == FieldType.checkbox) {
    return <FormPreviewCheckbox field={field} index={index} />;
  } else if (field.type == FieldType.radio) {
    return <FormPreviewRadio field={field} index={index} />;
  }
  return <FormPreviewText field={field} index={index} />;
}

function FormPreviewText({ field, index }: { field: Field; index?: number }) {
  const { values } = useFormikContext<Record<string, ConditionValue>>();
  return (
    <FormikField
      className="w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-300 rounded-md"
      as={asFromFieldType(field.type)}
      type={htmlTypeFromFieldType(field.type)}
      name={field.htmlInputName(index)}
      id={field.htmlInputId(index)}
      validate={field.getValidator(values, index)}
      autoCorrect="off"
      autoComplete="off"
      spellCheck="false"
    />
  );
}

function FormPreviewCheckbox({
  field,
  index,
}: {
  field: Field;
  index?: number;
}) {
  const { values } = useFormikContext<Record<string, ConditionValue>>();
  return (
    <FormikField
      className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
      as="input"
      type="checkbox"
      name={field.htmlInputName(index)}
      id={`for-${field.htmlInputId(index)}`}
      validate={field.getValidator(values, index)}
    />
  );
}

function FormPreviewRadio({ field, index }: { field: Field; index?: number }) {
  const { values } = useFormikContext<Record<string, ConditionValue>>();
  return (
    <div role="group" aria-labelledby={field.htmlInputId(index)}>
      {field.options.map((option, index) => (
        <label key={index} className="flex items-center">
          <FormikField
            className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
            name={field.htmlInputName(index)}
            type="radio"
            value={option}
            validate={field.getValidator(values, index)}
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );
}

function htmlTypeFromFieldType(type: FieldType): string {
  switch (type) {
    case FieldType.checkbox:
      return 'checkbox';
    case FieldType.number:
      return 'number';
    default:
      return 'text';
  }
}

function asFromFieldType(type: FieldType): string {
  switch (type) {
    case FieldType.longtext:
      return 'textarea';
    default:
      return 'input';
  }
}
