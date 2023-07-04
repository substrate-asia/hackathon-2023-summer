/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@/styles/reset.css';
import '@/styles/global.scss';
import store from '@/store';
import { ThemeProvider } from '@/context/ThemeProvider';
import { wagmiConfig as config, chains } from '@/components/ConnectWallet';
import App from './App';
import '@/i18n';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <WagmiConfig config={config}>
                <RainbowKitProvider chains={chains}>
                    <ThemeProvider>
                        <Router>
                            <App />
                        </Router>
                    </ThemeProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </Provider>
    </React.StrictMode>
);
