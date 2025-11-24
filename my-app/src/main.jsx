import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App.jsx'
import themeConfig from './theme/themeConfig.js'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={themeConfig}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
