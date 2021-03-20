import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClientProvider, QueryClient } from 'react-query';

import { messages } from './locales/fr';
import { resetPage } from './hooks';

import { FormEditor } from './components/FormEditor';
import { FormPreview } from './components/FormPreview';
import { Header } from './components/Header';

const client = new QueryClient();

function App() {
  const [preview, setPreview] = useState(false);
  return (
    <IntlProvider locale="fr" messages={messages} onError={() => {}}>
      <QueryClientProvider client={client}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header
            preview={preview}
            onReset={resetPage}
            onPreview={() => setPreview(!preview)}
          />
          <div className="max-w-3xl mx-auto">
            <div className="mt-20"></div>
            {preview ? <FormPreview /> : <FormEditor />}
          </div>
        </div>
      </QueryClientProvider>
    </IntlProvider>
  );
}

export default App;
