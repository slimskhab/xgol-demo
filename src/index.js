import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { configureStore } from '@reduxjs/toolkit';
import recordingReducer from "./features/recording"
import { Provider } from 'react-redux';

const theme = extendTheme({
  colors: {
    brand: {
      100: "red",
      // ...
      900: "red",
    },
  },
  components: {
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: 'var(--main-color)'
        }
      }
    }
  }
})

const store = configureStore({
  reducer: {
    recordingStore: recordingReducer,

  }
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<Provider store={store}>
    <BrowserRouter>
      <ChakraProvider theme={theme}>    <App />
      </ChakraProvider>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);


