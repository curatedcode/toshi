import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import Carousel from "~/components/Sliders/Carousel";
import { useEffect, useState } from "react";
import Image from "~/components/Image";
import Rating from "~/components/Reviews/Rating";
import Review from "~/components/Reviews/Review";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import superjson from "superjson";
import Slider from "~/components/Sliders/Slider";
import Product from "~/components/Products/Product";
import QuantityControls from "~/components/Products/QuantityControls";
import InternalLink from "~/components/InternalLink";
import useLocalCart from "~/components/Fn/useLocalCart";
import Button from "~/components/Input/Button";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import CustomLink from "~/components/Input/CustomLink";
import SelectInputField from "~/components/Input/SelectInputField";

const ProductPage: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const productId = props.productId as string;

  const { cookieId } = useLocalCart();

  const { data: mainData } = api.product.getOne.useQuery({ productId });

  const { data: similarData } = api.product.similar.useQuery({
    category: mainData?.categories[0]?.name,
  });
  const similarProducts = similarData?.map((product) => (
    <Product key={product.id} product={product} />
  ));

  const { name, price, images, description, company, reviews, quantity } =
    mainData || {
      name: "",
      price: 0,
      images: [],
      description: "",
      company: { name: "", id: "" },
      reviews: { rating: 0, _count: 0, data: [] },
      quantity: 0,
    };

  const [orderQuantity, setOrderQuantity] = useState(1);

  const [showAddToCartButton, setShowAddToCartButton] = useState(true);

  const [addedToList, setAddedToList] = useState(false);

  const {} = api.cart.isInCart.useQuery(
    {
      productId,
      cookieId,
    },
    { onSuccess: (val) => setShowAddToCartButton(!val) }
  );

  const { mutate: addToCart, isLoading: addingToCart } =
    api.cart.addProduct.useMutation({
      onSuccess: () => {
        setShowAddToCartButton(false);
      },
    });

  const { data: lists } = api.list.getAllSimple.useQuery();
  const { mutate: addToList } = api.list.addProduct.useMutation({
    onSuccess: () => setAddedToList(true),
  });

  function handleAddToList(value: { id: string; name: string }) {
    if (value.id === "defaultListOption") return;
    addToList({ productId, listId: value.id });
  }

  useEffect(() => {
    if (!addedToList) return;
    const hideAddedToList = setTimeout(() => {
      setAddedToList(false);
    }, 3000);
    return () => clearTimeout(hideAddedToList);
  }, [addedToList]);

  return (
    <Layout
      title={`${name} | Toshi`}
      description={`${name} found on Toshi.com`}
      className="mx-auto max-w-7xl gap-4 md:gap-16"
    >
      <section className="flex flex-col md:flex-row md:gap-4">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-start">
          <Carousel
            slides={images.map((image) => (
              <Image
                key={image.url}
                alt={name}
                src={image.url}
                loading="eager"
                className="w-full rounded-md"
                height={150}
                width={200}
              />
            ))}
            thumbnails={images.length > 1}
            controls
          />
          <div>
            <h1 className="line-clamp-2 text-2xl font-semibold">{name}</h1>
            <Rating
              rating={reviews.rating}
              _count={reviews._count}
              link={"#reviews"}
            />
            <p className="mt-1 text-2xl" aria-label="price">
              ${price}
            </p>
            <div className="mt-3">
              <h1 className="text-xl font-semibold">About</h1>
              <div className="flex flex-col gap-4">
                <p>{description}</p>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap font-semibold">
                    Sold By:
                  </span>
                  <InternalLink
                    href={`/companies/${company.id}`}
                    className="-mt-0.5"
                  >
                    {company.name}
                  </InternalLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 flex h-fit w-full max-w-sm flex-col gap-2 self-center rounded-md bg-neutral-100 px-3 py-3 pb-3 md:max-w-[18rem] md:self-auto lg:max-w-xs">
          <div className="flex items-center gap-2 text-xl">
            <span>Price:</span>
            <span>${price}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex gap-1 self-start text-sm">
              <span className="font-medium text-toshi-green">FREE</span>
              <span className="whitespace-nowrap">
                shipping on orders over $25.
              </span>
            </div>
            <span className="self-start whitespace-nowrap text-sm">
              Shipped by Toshi.com
            </span>
          </div>
          <p
            className={`text-lg font-semibold text-toshi-green md:hidden ${
              quantity <= 10 && quantity > 0 ? "" : "hidden"
            }`}
          >{`Only ${quantity} left in stock!`}</p>
          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <span>Qty:</span>
              <QuantityControls
                maxQuantity={quantity}
                quantity={orderQuantity}
                setQuantity={setOrderQuantity}
                disabled={!showAddToCartButton}
                disabledMessage="Item already in cart"
                className="mt-3 self-center"
              />
            </div>
          ) : (
            <span className="mb-2 text-xl font-medium text-toshi-green">
              Out of stock
            </span>
          )}
          <Button
            style="toshi"
            onClick={() =>
              addToCart({ productId, quantity: orderQuantity, cookieId })
            }
            className={showAddToCartButton ? "w-full text-lg" : "hidden"}
            disabled={quantity < 1 || orderQuantity < 1 || addingToCart}
          >
            Add to cart
          </Button>
          <CustomLink
            href={"/cart"}
            className={showAddToCartButton ? "hidden" : "w-full text-lg"}
          >
            View in cart
          </CustomLink>
          {addedToList ? (
            <div
              role="alert"
              className="flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-md bg-toshi-green px-4 py-1 text-lg font-semibold text-white"
            >
              <CheckCircleIcon className="w-6" aria-hidden />
              <span className="mt-0.5">Added to list</span>
            </div>
          ) : (
            lists &&
            lists.length > 0 && (
              <SelectInputField
                onChange={handleAddToList}
                options={[
                  { id: "defaultListOption", name: "Add to list" },
                  ...lists,
                ]}
                internalLabel="addToList"
                className="bg-white text-lg font-semibold text-neutral-600"
              />
            )
          )}
        </div>
      </section>
      <section id="reviews" className="pt-4 md:pt-0">
        <h1 className="whitespace-nowrap text-2xl font-semibold">Reviews</h1>
        <div className="flex flex-col gap-2">
          {reviews.data.map((review) => (
            <Review key={review.id} review={review} />
          ))}
        </div>
      </section>
      {similarProducts && (
        <section className="mt-4">
          <h1 className="mb-3 whitespace-nowrap text-2xl font-semibold">
            Similar products
          </h1>
          <Slider slides={similarProducts} controls />
        </section>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });
  const { query } = context;
  const productId = query.slug as string;

  await helper.product.getOne.prefetch({ productId });

  return { props: { trpcState: helper.dehydrate(), productId } };
};

export default ProductPage;
