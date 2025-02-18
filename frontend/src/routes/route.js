import Home from "../pages/Home";
import AboutDetail from "../pages/AboutDetail";
import Contact from "../pages/Contact";
import SofaPage from "../pages/Sofa";
import ProductDetail from "../pages/ProductDetail";
import PolicyTerms from "../pages/PolicyTerms";
import Checkout from "../pages/Checkout";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";
import Account from "../pages/Account";
import SalesManagement from "../pages/SalesManagement";

export const route = [
  { path: "/", element: <Home />, isShow: true },
  { path: "/home", element: <Home />, isShow: true },
  { path: "/about", element: <AboutDetail />, isShow: true },
  { path: "/contact", element: <Contact />, isShow: true },
  { path: "/sofa", element: <SofaPage />, isShow: true },
  { path: "/:name/:id", element: <ProductDetail />, isShow: true },
  { path: "/policy-terms", element: <PolicyTerms />, isShow: true },
  { path: "/checkout", element: <Checkout />, isShow: true },
  { path: "/cart", element: <Cart />, isShow: true },
  { path: "*", element: <NotFound /> },
  { path: "/account", element: <Account />, isShow: true },
  { path: "/salesmanagement", element: <SalesManagement />, isShow: true },
];
