import React, { ReactNode } from 'react';
import {
  Formik,
  Form as FormikForm,
  Field as FormikField,
  ErrorMessage,
  useFormikContext,
} from 'formik';
import { FormattedMessage } from 'react-intl';

import { usePage } from '../hooks';
import { Field, Section, isSection, FieldType, ConditionValue } from '../tree';

export function FormPreview() {
  const page = usePage();

  return (
    <div>
      <div>
        <h1 className="text-blue-500 border-none font-bold text-4xl pl-0 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded">
          {page.label}
        </h1>
      </div>
      <div className="mt-5">
        <Formik
          initialValues={page.initialValues}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          <FormikForm>
            {page.publicContent.map((field) => (
              <FormPreviewField key={field.id} field={field} />
            ))}

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
          </FormikForm>
        </Formik>
      </div>
    </div>
  );
}

function FormPreviewField({ field }: { field: Field | Section }) {
  if (isSection(field)) {
    return <FormPreviewSection field={field} />;
  }
  return (
    <FormPreviewLabel field={field}>
      <div className="mb-2 w-full">
        <FormPreviewInput field={field} />
        <ErrorMessage
          component="p"
          name={field.id}
          className="mt-2 text-sm text-red-600"
        />
      </div>
    </FormPreviewLabel>
  );
}

function FormPreviewSection({ field }: { field: Section }) {
  return (
    <fieldset>
      <legend className="text-2xl font-bold flex-auto text-blue-500 border-none p-0 mb-1 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10">
        {field.sectionIndex} {field.label}
      </legend>
      {field.description && (
        <div className="text-black border-none p-0 mb-2 text-xs focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10">
          {field.description}
        </div>
      )}
      {field.publicContent.map((field) => (
        <FormPreviewField key={field.id} field={field} />
      ))}
    </fieldset>
  );
}

function FormPreviewInput({ field }: { field: Field }) {
  if (field.type == FieldType.checkbox) {
    return <FormPreviewCheckbox field={field} />;
  } else if (field.type == FieldType.radio) {
    return <FormPreviewRadio field={field} />;
  }
  return <FormPreviewText field={field} />;
}

function FormPreviewText({ field }: { field: Field }) {
  const { values } = useFormikContext<Record<string, ConditionValue>>();
  return (
    <FormikField
      className="w-full text-sm shadow-sm rounded-t border-t-0 border-l-0 border-r-0 border-2 border-black focus:border-black bg-gray-200 text-black placeholder-black focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
      as={asFromFieldType(field.type)}
      type={htmlTypeFromFieldType(field.type)}
      name={field.id}
      id={`for-${field.id}`}
      validate={field.getValidator(values)}
      autoCorrect="off"
      autoComplete="off"
      spellCheck="false"
    />
  );
}

function FormPreviewCheckbox({ field }: { field: Field }) {
  return (
    <FormikField
      className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
      as="input"
      type="checkbox"
      name={field.id}
      id={`for-${field.id}`}
    />
  );
}

function FormPreviewRadio({ field }: { field: Field }) {
  const { values } = useFormikContext<Record<string, ConditionValue>>();
  return (
    <div role="group" aria-labelledby={`for-${field.id}`}>
      {field.options.map((option, index) => (
        <label key={index} className="flex items-center">
          <FormikField
            className="shadow-sm focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none"
            name={field.id}
            type="radio"
            value={option}
            validate={field.getValidator(values)}
          />
          <span className="ml-2 border-none p-0 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10">
            {option}
          </span>
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

function FormPreviewLabel({
  field,
  children,
}: {
  field: Field;
  children: ReactNode;
}) {
  const { values } = useFormikContext<Record<string, ConditionValue>>();
  if (field.isHidden(values)) {
    return null;
  }
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex">
        <label
          htmlFor={`for-${field.id}`}
          className="font-semibold text-blue-500 border-none p-0 mb-1 focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10"
        >
          {field.sectionIndex} {field.label}
        </label>
        {field.isRequired(values) && (
          <span className="ml-2 font-medium text-2xl text-red-800">*</span>
        )}
      </div>

      {field.description && (
        <div className="text-black border-none p-0 mb-2 text-xs focus:ring focus:ring-blue-500 focus:ring-offset-2 outline-none rounded focus:z-10">
          {field.description}
        </div>
      )}
      {children}
    </div>
  );
}
