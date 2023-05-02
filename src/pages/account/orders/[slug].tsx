import { type NextPage } from "next";
import { useRouter } from "next/router";
import getFormattedDate from "~/components/Fn/getFormattedDate";
import Layout from "~/components/Layout";
import OrderedProduct from "~/components/Products/OrderedProduct";
import { api } from "~/utils/api";

const OrderPage: NextPage = () => {
  const { query } = useRouter();
  const orderId = typeof query.slug === "string" ? query.slug : undefined;

  const { data } = api.order.getOne.useQuery({ orderId });

  return (
    <Layout
      title={`${
        data?.createdAt
          ? `Your order on ${getFormattedDate(data.createdAt)}`
          : "Your order"
      } | Toshi`}
      description="Your previous order on Toshi.com"
      className="flex flex-col"
    >
      {data?.createdAt ? (
        <h1>Your order from {getFormattedDate(data.createdAt)}</h1>
      ) : (
        <h1>Your previous order</h1>
      )}
      {data?.products?.map((product) => (
        <OrderedProduct key={product.id} product={product} />
      ))}
    </Layout>
  );
};

export default OrderPage;