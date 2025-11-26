import { Outlet } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Dock from "./Dock";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col relative pb-24 lg:pb-0">
            
            <Navbar />

            <div className="flex flex-1">
                <div id="main-content" className="flex-1 w-full">
                    <Outlet />
                </div>
            </div>

            <Footer />
            
            <Dock />
        </div>
    );
}