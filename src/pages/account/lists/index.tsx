import { type NextPage } from "next";
import Layout from "~/components/Layout";
import Product from "~/components/Products/Product";
import { api } from "~/utils/api";

const ListPage: NextPage = () => {
  const { data } = api.list.getAll.useQuery();

  return (
    <Layout title="Your lists | Toshi" description="Your lists on Toshi.com">
      {data?.map((list) => {
        const { id, name, isPrivate, products } = list;

        const allProducts = products.map((product) => (
          <Product key={product.id} product={product} type="alternate" />
        ));

        return (
          <div key={id}>
            <div>
              <h1>{name}</h1>
              <span>{isPrivate ? "Private" : "Public"}</span>
            </div>
            <div className="flex flex-col">{allProducts}</div>
          </div>
        );
      })}
    </Layout>
  );
};

export default ListPage;
