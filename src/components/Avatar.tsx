import type { AvatarProps } from "~/customTypes";
import Image from "./Image";

function Avatar({ size = "md", alt, src }: AvatarProps) {
  if (size === "sm") {
    return (
      <Image
        className="rounded-full"
        alt={alt}
        src={src}
        width={32}
        height={32}
      />
    );
  }

  if (size === "md") {
    return (
      <Image
        className="rounded-full"
        alt={alt}
        src={src}
        width={48}
        height={48}
      />
    );
  }

  return (
    <Image
      className="rounded-full"
      alt={alt}
      src={src}
      width={64}
      height={64}
    />
  );
}

export default Avatar;
