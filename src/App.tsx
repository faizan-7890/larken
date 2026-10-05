import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { About } from "./pages/About";
import { Account } from "./pages/Account";
import { Cart } from "./pages/Cart";
import { Catalog } from "./pages/Catalog";
import { Checkout } from "./pages/Checkout";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { OrderPage } from "./pages/Order";
import { Policies } from "./pages/Policies";
import { ProductPage } from "./pages/Product";
import { ProjectPage, Projects } from "./pages/Projects";
import { QuickOrder } from "./pages/QuickOrder";
import { Trade } from "./pages/Trade";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders/:id" element={<OrderPage />} />
          <Route path="account" element={<Account />} />
          <Route path="trade" element={<Trade />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectPage />} />
          <Route path="quick-order" element={<QuickOrder />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="policies" element={<Policies />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
