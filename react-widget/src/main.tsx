import App from './App.tsx'
import './index.css'
import r2wc from "@r2wc/react-to-web-component"
import {createRoot} from "react-dom/client";

const isProduction = import.meta.env.MODE === 'production';

const WebComponent = r2wc(App, {shadow: "open", props: {chatwidgetid: "string"}});
isProduction && customElements.define('widget-web-component', WebComponent);

createRoot(document.getElementById("root")!).render(
    <App chatwidgetid='cm34a72ty0003z9wlc7v4lhtd'/>
)