import { TitleBar, useAppBridge, useNavigationHistory } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { useEffect, useState } from "react";
import { Banner, Button, Icon, Layout, Page, TextStyle } from "@shopify/polaris";
import { MobileAcceptMajor } from '@shopify/polaris-icons';
import Axios from  "../Axios";
import store from  "store2";
import { PingServer } from "../components/Helper";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useNavigate } from "react-router";
export default function Payments({showBanner, showFreqBanner}) {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const [btnLoading, setbtnLoading] = useState(false);
  const [payment_is_active, setPaymentActive] = useState(false);
  const [payment_id, setPaymentId] = useState(null); 
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [my_payments_plans, setPaymentPlans] = useState(payment_plans);
  const {replace} = useNavigationHistory();
  const navigate = useNavigate();
  
  useEffect(() => {
    Axios.get("/payment/status.json?shop="+(store("shop"))).then(response => {
      if (response && response.data && response.data.payment && response.data.payment.status === "active") {
        setPaymentActive(true);
        setPaymentId(response.data.payment.id);
      }
      setPaymentLoading(false);
    }).catch(error => {
      setPaymentLoading(false);
    });
  },[]);


  if (paymentLoading) {
    return <LoadingSkeleton></LoadingSkeleton>;
  }

  return (
    <Page>
      <TitleBar
        title="Pricing"
       secondaryActions={[{
        content: "Home",
        onAction: () => {
          navigate("/", {replace: true});
          replace({pathname: '/'});
        },
       }]}
      />
      <Layout>
        {
        showFreqBanner && <Layout.Section>
            <Banner title="Please Buy Professional Plan for Frequently Bought Together." status="warning"></Banner>
          </Layout.Section>
        }
        {
          showBanner && <Layout.Section>
            <Banner title="Start 7-day free trial to get started." status="warning"></Banner>
          </Layout.Section>
        }
        <Layout.Section>
          <div className="payments-sections">
          {
            my_payments_plans.plans.map((plan,index) => {
              return <div key={"s"+index} className={"payment-section "+(payment_is_active && plan.id == payment_id?"is-active":"")}>
                  <div className="payments">
                    {
                      (payment_is_active && payment_id == plan.id)&& <div className="subscribed-plan-item">
                        <div className="subscribed-plan"></div>
                      </div>
                    }
                    <div className="header">{plan.title}</div>
                    <div className="price-section">
                      <div className="price">{plan.price}</div>
                      <div className="price-info">USD /month</div>
                    </div>
                    <div className="price-btn">
                      {
                        payment_id != plan.id?
                        <Button
                          loading={plan.loading}
                          primary
                          onClick={() => {
                            try {
                              var new_payments = payment_plans;
                              new_payments.plans[index].loading = true;
                              setPaymentPlans(new_payments);
                            } catch (e) {
                            }
                            redirect.dispatch(Redirect.Action.REMOTE, process.env.HOST+"/payment/invoice.json?plan="+plan.id+"&shop="+(store("shop")));
                          }}
                        >Start {my_payments_plans.trial_days}-day free trial</Button>
                        :null
                      }
                    </div>
                    {plans_description(plan.details)}
                  </div>
                </div>
            })
          }
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function plans_description(details) {
  return details.map((x,i) => [
    <div key={"sd"+i} className="details-item">
      <div className="item-icon"><Icon source={MobileAcceptMajor} color="success"></Icon></div>
      <div className="item-label"><TextStyle variation="subdued">{x}</TextStyle></div>
    </div>
  ])
}

const payment_plans = {
  "trial_days": 7,
  "plans": [
    {
      "id": "4688e671",
      "title": "Basic",
      "price": "4.99",
      "loading": false,
      "details": [
        "Unlimited products",
        "Manual recommendations",
        "Visual customizer",
        "24/7 priority support"
      ]
    },
    {
      "id": "4688e672",
      "title": "PROFESSIONAL",
      "loading": false,
      "price": "14.99",
      "details": [
        "Unlimited products",
        "Manual recommendations",
        "Visual customizer",
        "24/7 priority support"
      ]
    },
    {
      "id": "4688e673", 
      "title": "ADVANCE",
      "loading": false,
      "price": "34.99",
      "details": [
        "Unlimited products",
        "Manual recommendations",
        "Visual customizer",
        "24/7 priority support"
      ]
    }
  ]
};