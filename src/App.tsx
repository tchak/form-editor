import React from 'react';
import { IntlProvider } from 'react-intl';

import { messages } from './locales/fr';
import { FormEditor } from './components/FormEditor';

function App() {
  return (
    <IntlProvider locale="fr" messages={messages} onError={() => {}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mt-20"></div>
          <FormEditor />
        </div>
      </div>
    </IntlProvider>
  );
}

export default App;
