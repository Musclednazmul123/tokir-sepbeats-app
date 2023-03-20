import { Card, Layout, Page, SkeletonBodyText } from "@shopify/polaris";
export default function LoadingSkeleton({fullWidth}) {
    return (
        <Page fullWidth={fullWidth}>
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <SkeletonBodyText lines={3}></SkeletonBodyText>
                        <SkeletonBodyText lines={2}></SkeletonBodyText>
                    </Card>
                    <Card sectioned>
                        <SkeletonBodyText lines={2}></SkeletonBodyText>
                        <SkeletonBodyText lines={3}></SkeletonBodyText>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
