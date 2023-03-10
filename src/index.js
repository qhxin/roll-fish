import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register(`./sw.js`)
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));

    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) {
        return
      }
      refreshing = true;
      window.location.reload();
    });

    try {
      ((width, height) => {
        if (window.matchMedia('(display-mode: standalone)').matches ||
          window.navigator.standalone === true) {
          window.resizeTo(width, height);
          // window.addEventListener('resize', () => {
          //   window.resizeTo(width, height)
          // })
        }
      })(570, 760);
    } catch(e) {
      console.error(e);
    }
  });
}