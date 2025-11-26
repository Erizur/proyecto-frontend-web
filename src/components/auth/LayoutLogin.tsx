import { Outlet } from "react-router";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";

export default function LayoutLogin() {
    return <div className="min-h-screen flex flex-col">
        <Navbar disableMenu={true} />

        <div className="flex flex-1 mt-30">
            <div id="main-content" className="flex-1 p-6">
                <Outlet />
            </div>
        </div>

        <Footer />
    </div>
}