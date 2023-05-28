import { MapPinIcon } from "@heroicons/react/24/outline";
import { type DehydratedState } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import SuperJSON from "superjson";
import Avatar from "~/components/Avatar";
import Layout from "~/components/Layout";
import Product from "~/components/Products/Product";
import PaginationButtons from "~/components/Search/PaginationButtons";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { api } from "~/utils/api";

const CompanyPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { companyId, queryPage } = props as SSRReturnType;

  const { data: companyInfo } = api.company.get.useQuery({ companyId });
  const { data: productsData } = api.company.products.useQuery({
    companyId,
    page: queryPage,
  });

  const { name = "", location, about, logoURL } = companyInfo || {};
  const { products, totalPages } = productsData || {};

  return (
    <Layout title={`${name} | Toshi`} description={`${name} on Toshi.com`}>
      <div className="mt-4 flex w-fit flex-col place-items-center gap-2 self-center text-center md:flex-row md:place-items-start md:text-start">
        <Avatar
          alt={`${name} logo`}
          src={logoURL ? logoURL : "/profile-placeholder.png"}
          size="lg"
        />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-semibold">{name}</span>
          <div className="flex items-center gap-1">
            <MapPinIcon className="w-5" aria-hidden />
            <p>{location}</p>
          </div>
          <p>{about}</p>
        </div>
      </div>
      <div className="mt-6 md:mt-10">
        {products ? (
          <div>
            <h1 className="my-2 text-2xl">Products</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
            <PaginationButtons
              currentPage={queryPage}
              totalPages={totalPages}
              linkTo={`/companies/${companyId}?`}
            />
          </div>
        ) : (
          <span>No products</span>
        )}
      </div>
    </Layout>
  );
};

type SSRReturnType = {
  trpcState: DehydratedState;
  companyId: string;
  queryPage: number;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helpers = createServerSideHelpers({
    ctx: createInnerTRPCContext({ session: null }),
    router: appRouter,
    transformer: SuperJSON,
  });

  const { query } = context;

  const queryPage = query.page ? Number(query.page) : 1;

  const companyId = query.slug as string;

  await helpers.company.get.prefetch({ companyId });
  await helpers.company.products.prefetch({ companyId, page: 1 });

  const dataToReturn: SSRReturnType = {
    trpcState: helpers.dehydrate(),
    companyId,
    queryPage,
  };

  return {
    props: dataToReturn,
  };
};

export default CompanyPage;
