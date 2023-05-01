import type { Placement } from "@floating-ui/react";
import type { Category, Prisma, ProductImage, Review } from "@prisma/client";
import type { EmblaCarouselType } from "embla-carousel-react";
import type { CSSProperties, ChangeEventHandler } from "react";

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

export declare type FloatingOptions = {
  children?: React.ReactNode;
  offset?: OffsetValue;
  placement?: Placement;
  delay?: number | Partial<{ open: number; close: number }>;
};

export declare interface PopoverProps extends FloatingOptions {
  trigger: React.ReactNode;
  className?: Partial<{ trigger: string; children: string }>;
}

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
};

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
};

export declare type ProductProps = {
  product: ProductType;
  type?: "default" | "alternate";
  imageHeight?: number;
  imageWidth?: number;
};

export declare type OrderedProductType = {
  id: string;
  images: ProductImage[] | undefined;
  name: string;
  price: number;
  company: { id: string; name: string };
};

export declare type OrderedProductProps = {
  product: OrderedProductType;
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
}[];

export declare type ProductWithReviews = {
  id: string;
  name: string;
  images: ProductImage[] | undefined;
  price: number;
  reviews: {
    rating: number | null;
    _count: number;
  };
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
  category?: string;
  rating?: number;
  price?: {
    min?: number;
    max?: number;
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
