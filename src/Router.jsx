import "@shopify/polaris/build/esm/styles.css";
import { Card, Heading, Page } from "@shopify/polaris";
import { Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import Home from "./pages/Home";
import Payments from "./pages/Payments";
import PackPage from "./pages/PackPage";
import AddSamples from "./pages/AddSamples";
import Test from "./pages/Test";


export default function Router({plan}) {
    return (
      <Routes>
          <Route
            index element={<Home />}
          />
          <Route
            path="/home" element={<Home />}
          />
          <Route
            path="/products" element={<Products />}
          />
          <Route
            path="/sephbeats" element={<Products />}
          />
          <Route
            path="/add-samples/:id" element={<AddSamples />}
          />
          <Route
            path="/sample/edit/:sid" element={<AddSamples method="edit" />}
          />
          <Route
            path="/test" element={<Test />}
          />
          <Route
            path="/payments" element={<Payments />}
          />
          <Route
            path="/pack-page/:id" element={<PackPage />} 
          />
          <Route
            path="*" element={<NoMatch />}
          />
      </Routes>
    );
}

function NoMatch() {
    return (
        <Page>
          <Card sectioned>
            <Heading>404! Page not found</Heading>
            <p>The page you have requested is not found</p>
          </Card>
        </Page>
    );
} 