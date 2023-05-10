import type { Category, Prisma, ProductImage, Review } from "@prisma/client";
import type { EmblaCarouselType } from "embla-carousel-react";
import type { Url } from "next/dist/shared/lib/router/router";
import type {
  CSSProperties,
  ChangeEventHandler,
  DetailedHTMLProps,
  Dispatch,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  SetStateAction,
} from "react";
import { z } from "zod";

export declare type LogoProps = {
  width?: number;
  height?: number;
  filled?: boolean;
  className?: string;
};

export declare type OffsetValue =
  | number
  | {
      mainAxis?: number;
      crossAxis?: number;
      alignmentAxis?: number | null;
    };

export declare type LayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export declare type ImageProps = {
  alt: string;
  src: string | undefined;
  className?: string;
  height?: number | string;
  width?: number | string;
  loading?: "lazy" | "eager";
  style?: CSSProperties;
  onClick?: () => void;
} & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

export declare interface SliderProps extends Partial<SliderOptions> {
  slides: React.ReactNode[];
}

export declare type SliderOptions = {
  controls: boolean;
};

export declare interface CarouselProps extends Partial<SliderOptions> {
  slides: React.ReactNode[];
  thumbnails?: boolean;
}

export declare type SliderControlProps = {
  api: EmblaCarouselType | undefined;
  visible: boolean;
  type?: "filled" | "shallow";
};

export declare type ProductType = {
  id: string;
  images: ProductImage[] | undefined;
  name: string;
  price: number;
  reviews: {
    rating: number | null;
    _count: number;
  };
  company?: {
    id: string;
    name: string;
  };
};

export declare type ProductProps = {
  product: ProductType;
  type?: "default" | "alternate";
  imageHeight?: number;
  imageWidth?: number;
  imageLoading?: "lazy" | "eager";
};

export declare type OrderedProductType = {
  id: string;
  images: ProductImage[] | undefined;
  name: string;
  price: number;
  company: { id: string; name: string };
};

export declare type OrderedProductProps = {
  product: { product: OrderedProductType; priceAtPurchase: number };
  imageHeight?: number;
  imageWidth?: number;
};

export declare type ListProductProps = {
  product: ProductType;
  imageHeight?: number;
  imageWidth?: number;
};

export declare type AvatarProps = {
  alt: string;
  src: string | null | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export declare type ProductSearchResult = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  category?: string;
  createdAt: Date;
}[];

export declare type ProductWithReviews = {
  id: string;
  name: string;
  company?: { name: string; id: string };
  images: ProductImage[] | undefined;
  price: number;
  reviews: {
    rating: number | null;
    _count: number;
  };
  createdAt: Date;
}[];

export declare type ProductSearchQuery = (
  | Prisma.PrismaPromise<Review[]>
  | Prisma.Prisma__ProductImageClient<ProductImage | null, null>
  | Prisma.Prisma__CategoryClient<Category | null, null>
)[];

export declare type PaginationButtonsProps = {
  totalPages: number | undefined;
  currentPage: number;
  linkTo: string;
};

export declare type NavButtonProps = {
  href: string;
  name: "Previous" | "Next";
  disabled: boolean;
};

export declare type PriceInput = {
  name: "Min" | "Max";
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export declare type CarouselThumbProps = {
  onClick: () => void;
  selected: boolean;
  slideCount: number;
  slide: React.ReactNode;
  index: number;
};

export declare type getLinkWithAllParamsProps = {
  text?: string;
  page?: number;
  sortBy?: z.infer<typeof SearchResultSortBy>;
  category?: string;
  rating?: number;
  price?: {
    min?: number | null;
    max?: number | null;
  };
  includeOutOfStock?: boolean;
};

export declare type InternalLinkProps = {
  href: string;
  className?: string;
  ariaLabel?: string;
  title?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

export declare type FormProps = {
  hidden: boolean;
  setHidden: (value: SetStateAction<boolean>) => void;
  refetch: () => void;
};

export declare interface NameFormProps extends FormProps {
  initialName?: Partial<{ firstName: string; lastName: string }>;
}

export declare interface EmailFormProps extends FormProps {
  initialEmail?: string;
}

export declare interface PhoneNumberFormProps extends FormProps {
  initialPhoneNumber?: string;
}

export declare interface AddressFormProps extends FormProps {
  addressId: string | undefined;
  initialAddress?: Partial<{
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }>;
}

export declare type TextInputFieldProps = {
  internalLabel: string;
  visibleLabel: string;
  name: string;
  className?: string;
  maxLength: number;
  error: string | undefined;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export declare type RatingProps = {
  rating: number | null;
  link: Url;
  _count: number | null;
  className?: string;
};

export declare type ReviewProps = {
  user: {
    firstName: string;
    lastName: string;
    image: string | null;
  };
  id: string;
  createdAt: Date;
  rating: number;
  title: string;
  body: string | null;
};

export declare type LoadingPageProps = {
  title: string;
  description: string;
};

export const SearchResultSortBy = z.enum([
  "reviews",
  "newest",
  "priceHighToLow",
  "priceLowToHigh",
  "default",
]);

export declare type SkipToContentButtonProps = {
  type?: "default" | "inline";
  contentId?: string;
  text?: string;
  className?: string;
};

export const OrderPlacedOnEnum = z.enum([
  "pastDay",
  "pastWeek",
  "pastMonth",
  "pastThreeMonths",
  "pastSixMonths",
  "pastYear",
  "anytime",
]);

export declare type OrderPlacedOnType = z.infer<typeof OrderPlacedOnEnum>;

export declare type DropdownProps = {
  trigger: React.ReactNode;
  children: JSX.Element[] | undefined;
  offset?: number;
  className?: string;
  position: "left" | "right";
};

export declare type QuantityControlsProps = {
  maxQuantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  quantity: number;
  className?: string;
  disabled?: boolean;
  disabledMessage?: string;
};

export declare type CartProductProps = {
  data: {
    id: string;
    product: {
      reviews: {
        rating: number | null;
        _count: number;
      };
      company: {
        id: string;
        name: string;
      };
      id: string;
      name: string;
      images: ProductImage[];
      price: number;
      quantity: number;
    };
    quantity: number;
  };
  cookieId: string | undefined;
};
