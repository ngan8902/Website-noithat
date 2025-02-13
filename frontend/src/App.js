import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { allProducts } from "./pages/Sofa";
import { route } from "./routes/route";
import Default from "./components/Default";

function App() {
  const [products] = useState(allProducts);

  return (
    <Router>
      <div className="bg-gray-100 text-gray-900">
        <main>
          <Routes>
            {route.map(({ path, element, isShow }) => {
              const Layout = isShow ? Default : React.Fragment;
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