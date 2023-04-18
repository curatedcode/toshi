/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import type { ImageProps } from "~/customTypes";

function Image(props: ImageProps) {
  return <img loading={props.loading ? props.loading : "lazy"} {...props} />;
}

export default Image;
