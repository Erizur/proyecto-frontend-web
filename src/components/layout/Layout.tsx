import { Outlet } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout() {
    return <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex flex-1 mt-30">
            <div id="main-content" className="flex-1 p-6">
                <Outlet />
            </div>
        </div>

        <Footer />
    </div>
}