import React, { /*useEffect,*/ useState } from "react";
//import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { allProducts } from "./pages/Sofa";
import { route } from "./routes/route";
import Default from "./components/Default";
// import {useQuery} from "@tanstack/react-query";

function App() {


  // useEffect(() => {
  //   fetchApi()
  // },[])

  // const fetchApi = async () => {
  //   const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/all-product`)
  //   return res.data
  // }
  
  // const query = useQuery({ queryKey: ['products'], queryFn: fetchApi })

  // console.log(query)

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