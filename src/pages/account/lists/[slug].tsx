import { type NextPage } from "next";
import { useRouter } from "next/router";
import getFormattedDate from "~/components/Fn/getFormattedDate";
import Layout from "~/components/Layout";
import ListProduct from "~/components/Products/ListProduct";
import { api } from "~/utils/api";

const ListPage: NextPage = () => {
  const { query } = useRouter();
  const listId = query.slug as string;

  const { data } = api.list.getOne.useQuery({ listId });

  return (
    <Layout
      title={`${data?.name ? `${data.name} list` : "Your list"} | Toshi`}
      description="Your custom list on Toshi.com"
      className="flex flex-col"
    >
      <div>
        {data?.name ? <h1>{data.name}</h1> : <h1>Your custom list</h1>}
        {data?.updatedAt && (
          <span>Last edited {getFormattedDate(data.updatedAt)}</span>
        )}
      </div>
      {data?.products?.map((product) => (
        <ListProduct key={product.id} product={product} />
      ))}
    </Layout>
  );
};

export default ListPage;
