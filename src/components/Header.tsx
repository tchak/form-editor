import React from 'react';

export function Header({
  onReset,
  onPreview,
}: {
  onReset: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="md:flex md:items-center md:justify-between mt-2">
      <div className="flex-1 min-w-0"></div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={onReset}
        >
          Reset
        </button>
        <button
          type="button"
          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={onPreview}
        >
          Preview
        </button>
      </div>
    </div>
  );
}
