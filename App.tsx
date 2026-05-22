import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigations/AppNavigator';
import FlashMessage from 'react-native-flash-message';
import store, { persistor } from './src/redux/store';


const App = () => {
  console.log('Rendering App component');
  console.log('Store:', !!store);
  console.log('Persistor:', !!persistor);

  if (!store) {
    console.error('Redux store is undefined in App.tsx. This is likely a circular dependency issue.');
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppNavigator />
          <FlashMessage 
            position="top" 
            floating={true} 
            statusBarHeight={30} 
          />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
