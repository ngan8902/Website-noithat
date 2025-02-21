import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { route } from "./routes/route";
import Default from "./components/Default";
import AdminLayout from "./components/layout/AdminLayout";
import useProductStore from "./store/productStore";

function App() {

  const { products, getProducts } = useProductStore(); // Lấy dữ liệu từ Zustand

  useEffect(() => {
    getProducts(); // Gọi API khi App mount
  }, [getProducts]);

  return (
    <Router>
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
      </div>
    </Router>
  );
}

export default App;