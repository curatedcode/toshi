import type { Placement } from "@floating-ui/react";
import type { Category, Prisma, ProductImage, Review } from "@prisma/client";
import type { EmblaCarouselType } from "embla-carousel-react";
import type { CSSProperties, ChangeEventHandler } from "react";

export declare type Variants = "filled" | "outline" | "default";
export declare type BorderRadii =
  | "none"
  | "sm"
  | "reg"
  | "md"
  | "lg"
  | "xl"
  | "full";

export declare type InteractiveElement = {
  variant?: Variants;
  icon?: React.ReactNode;
  radius?: BorderRadii;
  alignIcon?: "start" | "end";
};

export declare interface TextInputProps
  extends React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    InteractiveElement {}

export declare type Sizes = "sm" | "md" | "lg" | "xl";

export declare interface ButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    InteractiveElement {}

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
  slides: JSX.Element[];
}

export declare type SliderOptions = {
  controls: boolean;
};

export declare interface CarouselProps extends Partial<SliderOptions> {
  slides: { url: string }[];
  productName: string;
}

export declare type SliderControlProps = {
  api: EmblaCarouselType | undefined;
  visible: boolean;
  type?: "filled" | "shallow";
};

export declare type ProductProps = {
  id: string;
  image: ProductImage | undefined;
  name: string;
  price: number;
  reviews: {
    rating: number | null;
    _count: number;
  };
};

export declare type AvatarProps = {
  alt: string;
  src: string;
  size?: "sm" | "md" | "lg";
};

export declare type ProductSearchResult = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
}[];

export declare type ProductSearchWithReviews = {
  id: string;
  name: string;
  image: ProductImage | undefined;
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
  searchText: string | undefined;
};

export declare type NavButtonProps = {
  href: string;
  name: "Previous" | "Next";
};

export declare type PriceInput = {
  name: "Min" | "Max";
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export declare type CarouselThumbProps = {
  onClick: () => void;
  selected: boolean;
  src: string;
  productName: string;
  slideCount: number;
  index: number;
};