import type {
  AvatarColor,
  Category,
  Prisma,
  ProductImage,
  Review,
} from "@prisma/client";
import type { EmblaCarouselType } from "embla-carousel-react";
import type { Url } from "next/dist/shared/lib/router/router";
import type {
  CSSProperties,
  ChangeEventHandler,
  DetailedHTMLProps,
  Dispatch,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  SetStateAction,
  TextareaHTMLAttributes,
} from "react";
import { z } from "zod";
import { avatarColors } from "./customVariables";
import type {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";

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
  buttons?: boolean;
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
  id?: string;
  onClick?: () => void;
};

export declare type FormProps = {
  hidden: boolean;
  setVisible: (value: SetStateAction<boolean>) => void;
  refetch: () => void;
};

export const AvatarType = z.enum(avatarColors);

export declare interface AvatarFormProps extends FormProps {
  initialAvatarColor: AvatarColor;
}

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
  classNameContainer?: string;
  className?: string;
  maxLength: number;
  error: string | undefined;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export declare type TextAreaInputFieldProps = {
  internalLabel: string;
  visibleLabel: string;
  classNameContainer?: string;
  className?: string;
  maxLength: number;
  error: string | undefined;
} & DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export declare type SelectInputFieldProps = {
  internalLabel: string;
  visibleLabel: string;
  classNameContainer?: string;
  className?: string;
  error: string | undefined;
  options: string[] | number[];
} & DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

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
    avatarColor: AvatarColor;
  };
  id: string;
  createdAt: Date;
  rating: number;
  title: string | null;
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
  tabIndex?: number;
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
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult>;
};

export declare type CheckoutSteps = "address" | "payment" | "review";

export declare type ButtonProps = {
  style?: "standard" | "toshi";
  link?: { href: Url };
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
};

export interface DimensionObject {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
  right: number;
  bottom: number;
}

export type UseDimensionsHook = [
  (node: HTMLElement) => void,
  object | DimensionObject,
  HTMLElement
];

export interface UseDimensionsArgs {
  liveMeasure?: boolean;
}
