import ChatApp from "./ChatApp";
import PortfolioApp from "./PortfolioApp";

export default function App() {
    const path = window.location.pathname;
    if (path.startsWith("/chat")) return <ChatApp />;
    return <PortfolioApp />;
}
