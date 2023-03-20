import {
  NavigationMenu,
  Provider as AppBridgeProvider
} from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { createApp } from "@shopify/app-bridge";
import { AppProvider as PolarisProvider, Heading, Layout, Page, Spinner, TextContainer } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import Router from "./Router"; 
import queryString from 'query-string';
import store from "store2";
import { useEffect, useState } from "react";
import Axios from "./Axios";
import "@shopify/polaris/build/esm/styles.css";
import "./style.css";
import LoadingSkeleton from "./components/LoadingSkeleton";
// import Header from "./components/Header";
const query = queryString.parse(location.search);

if (query.shop) {
  store("shop", query.shop);
}

const { shop } = query;
console.log(query.shop, shop);

export default function App() {
  const [payment_active, setPaymentActive] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(true);

  useEffect(() => {
    if (location.pathname !== "/") {
      Axios.get("/payment/status.json?shop="+store("shop")).then(response => {
        if (response && response.data && response.data.payment && response.data.payment.status === "active") {
          setPaymentActive(true); 
        } 
        setPaymentLoading(false);
      }).catch(error => {
        setPaymentLoading(false);
      });
    }
  },[]);

  if (location.pathname === "/") {
    return <MyOauthProvider></MyOauthProvider>;
  }

  return (
    <PolarisProvider i18n={translations}>
      <BrowserRouter>
        <AppBridgeProvider
          config={{
            apiKey: process.env.SHOPIFY_API_KEY,
            host: new URL(location).searchParams.get("host"),
            forceRedirect: true,
          }}
        >
          {/* <Header /> */}
        {/* <NavigationMenu
          navigationLinks={[
            {
              label: "Dashboard",
              destination: "/Products"
            }
          ]}
          matcher={(link, location) => link.destination === location.pathname}
        ></NavigationMenu> */}
        {
          paymentLoading ? <LoadingSkeleton/>: <Router plan = {payment_active}/>
        }
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}

function MyOauthProvider({ children }) {
  // alert(query.shop);
console.log(shop);
  Axios.get(`/oauth/init?ref=app&shop=${query.shop}&embedded=none`).then(response => {
      if (window.top === window.self) {
        window.location.href = response.data;
      }
      else{
        const app = createApp({
            apiKey: process.env.SHOPIFY_API_KEY,
            host: new URL(location).searchParams.get("host"),
        });
        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.REMOTE, response.data);
      }
  }).catch(error => { });
  return <PolarisProvider i18n={translations}>
    <Page>
          <Layout>
              <Layout.Section>
                  <div className="center-wrapper">
                      <TextContainer>
                          <div>
                              <Spinner accessibilityLabel="Authenticating. Please wait..." size="large"></Spinner>
                          </div>
                          <Heading>Authenticating. Please wait...</Heading>
                      </TextContainer>
                  </div>
              </Layout.Section>
          </Layout>
      </Page>
  </PolarisProvider>;
}