import dayjs from "dayjs";
import { type NextPage } from "next";
import { type SyntheticEvent, useState } from "react";
import getFormattedDate from "~/components/Fn/getFormattedDate";
import getPreviousDate from "~/components/Fn/getPreviousDate";
import InternalLink from "~/components/InternalLink";
import Layout from "~/components/Layout";
import OrderedProduct from "~/components/Products/OrderedProduct";
import { api } from "~/utils/api";

const OrdersPage: NextPage = () => {
  const [createdAfterFilter, setCreatedAfterFilter] = useState<Date>();
  const { data } = api.order.getAll.useQuery({
    createdAfter: createdAfterFilter,
  });

  function handleCreatedAfterFilterChange(
    e: SyntheticEvent<HTMLOptionElement, Event>
  ) {
    const newValue = dayjs(e.currentTarget.value).toDate();

    if (createdAfterFilter === newValue) return;
    setCreatedAfterFilter(newValue);
  }

  return (
    <Layout
      title="Your orders | Toshi"
      description="All of your orders on Toshi.com"
    >
      {data ? (
        <div className="flex flex-col">
          <div>
            <span>{data.length} orders placed in</span>{" "}
            <select
              title="Set order placed filter"
              className="bg-web-white px-2 py-1"
            >
              <option
                value={getPreviousDate(1, "day")}
                onSelect={handleCreatedAfterFilterChange}
              >
                past day
              </option>
              <option
                value={getPreviousDate(1, "week")}
                onSelect={handleCreatedAfterFilterChange}
              >
                past week
              </option>
              <option
                value={getPreviousDate(1, "month")}
                onSelect={handleCreatedAfterFilterChange}
              >
                past month
              </option>
              <option
                value={getPreviousDate(3, "month")}
                onSelect={handleCreatedAfterFilterChange}
              >
                past 3 months
              </option>
              <option
                value={getPreviousDate(6, "month")}
                onSelect={handleCreatedAfterFilterChange}
              >
                past 6 months
              </option>
              <option
                value={getPreviousDate(1, "year")}
                onSelect={handleCreatedAfterFilterChange}
              >
                past year
              </option>
              <option value={undefined}>anytime</option>
            </select>
          </div>
          {data.map((order) => {
            const { id, products, createdAt } = order;

            const productsInOrder = products.map((product) => (
              <OrderedProduct key={product.id} product={product} />
            ));

            return (
              <div key={id}>
                <h1>{getFormattedDate(createdAt)}</h1>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {productsInOrder}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center pt-12 text-lg">
          <span>You have no previous order.</span>
          <InternalLink href="/" className="text-lg">
            Continue shopping
          </InternalLink>
        </div>
      )}
    </Layout>
  );
};

export default OrdersPage;
