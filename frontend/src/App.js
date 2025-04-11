import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { route } from "./routes/route";
import Default from "./components/Default";
import AdminLayout from "./components/layout/AdminLayout";
import useProductStore from "./store/productStore";
import Chatbox from "./components/ChatBox";
import Zalo from "./components/Zalo";

function App() {
  const { products, getProducts, isSearching } = useProductStore();

  useEffect(() => {
    if (!isSearching) {
      getProducts();
    }
  }, [getProducts, isSearching]);

  return (
    <Router>
      <AppRoutes products={products} />
    </Router>
  );
}

const AppRoutes = ({ products }) => {
  const location = useLocation();

  const isPublicRoute = !location.pathname.startsWith("/admin") && !location.pathname.startsWith("/forgot-password");

  useEffect(() => {
    const isPublicRoute = !location.pathname.startsWith("/admin") && !location.pathname.startsWith("/forgot-password");

    const dfMessenger = document.querySelector("df-messenger");
    if (dfMessenger) {
      dfMessenger.style.display = isPublicRoute ? "block" : "none";
    }
  }, [location.pathname]);

  return (
    <div className="bg-gray-100 text-gray-900">
      <main>
        <Routes>
          {route.map(({ path, element, isShow, layout }) => {
            const Layout = layout ?? (isShow ? Default : AdminLayout);
            return (
              <Route
                key={path}
                path={path}
                element={
                  <Layout>
                    {path.includes(":id") ? React.cloneElement(element, { products }) : element}
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </main>

      {isPublicRoute && <Chatbox />}
      {isPublicRoute && <Zalo />}
    </div>
  );
};

export default App;