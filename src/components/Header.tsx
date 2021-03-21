import React from 'react';
import {
  HiOutlineEye,
  HiOutlineArrowNarrowLeft,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { FormattedMessage } from 'react-intl';

export function Header({
  preview,
  onReset,
  onPreview,
}: {
  preview: boolean;
  onReset: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="md:flex md:items-center md:justify-between mt-2">
      <div className="flex-1 min-w-0"></div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        {preview && (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onPreview}
          >
            <HiOutlineArrowNarrowLeft className="-ml-0.5 mr-2 h-4 w-4" />
            <FormattedMessage
              id="backToEditor"
              defaultMessage="Back to editor"
            />
          </button>
        )}
        {!preview && (
          <button
            type="button"
            className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onPreview}
          >
            <HiOutlineEye className="-ml-0.5 mr-2 h-4 w-4" />
            <FormattedMessage id="preview" defaultMessage="Preview" />
          </button>
        )}
        {!preview && (
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onReset}
          >
            <HiOutlineRefresh className="-ml-0.5 mr-2 h-4 w-4" />
            <FormattedMessage id="reset" defaultMessage="Reset" />
          </button>
        )}
      </div>
    </div>
  );
}
