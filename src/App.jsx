import ChatApp from "./ChatApp";
import PortfolioApp from "./PortfolioApp";
import ChatWidget from "./components/ChatWidget";

export default function App() {
    const path = window.location.pathname;

    if (path.startsWith("/chat")) {
        return <ChatApp />;
    }

    return (
        <>
            <PortfolioApp />
            <ChatWidget />
        </>
    );
}