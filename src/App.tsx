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
import OAuth2Redirect from "./components/auth/OAuth2Redirect";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import MapPage from "./pages/MapPage";
import NotFound from "./pages/NotFound";
import Policy from "./pages/terms/Policy";

function App() {
  return <>
    <AuthProvider>
      <Routes>
        <Route element={<LayoutLogin />}>
          <Route path="/auth/register" element={<Register />}></Route>
          <Route path="/auth/login" element={<Login />}></Route>
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
      
        <Route element={<Layout />}>
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/profile/:username/:type" element={<Connections />} />
            <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />} >
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth/logout" element={<Logout />}></Route>
          </Route>
        </Route>

        
        <Route path="/terms/policy" element={<Policy/>}/>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </>;
}

export default App
