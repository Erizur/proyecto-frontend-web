import { Route, Routes } from "react-router";
import { AuthProvider } from "./hooks/useAuth";
import LayoutLogin from "./components/auth/LayoutLogin";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PostDetail from "./pages/PostDetail";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Connections from "./pages/Connections";

function App() {
  return <>
    <AuthProvider>
      <Routes>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
        <Route element={<LayoutLogin />}>
          <Route path="/auth/register" element={<Register />}></Route>
          <Route path="/auth/login" element={<Login />}></Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />} >
            <Route path="/" element={<Home />} />
            <Route path="/profile/:username" element={<Profile />} />
            
            <Route path="/profile/:username/:type" element={<Connections />} />
            
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth/logout" element={<Logout />}></Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  </>;
}

export default App
