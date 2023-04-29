import type { AvatarProps } from "~/customTypes";
import Image from "./Image";

function Avatar({ size = "md", alt, src, className = "" }: AvatarProps) {
  if (size === "sm") {
    return (
      <Image
        className={`rounded-full ${className}`}
        alt={alt}
        src={src ?? "/profile-placeholder.jpg"}
        width={32}
        height={32}
      />
    );
  }

  if (size === "md") {
    return (
      <Image
        className={`rounded-full ${className}`}
        alt={alt}
        src={src ?? "/profile-placeholder.jpg"}
        width={48}
        height={48}
      />
    );
  }

  return (
    <Image
      className={`rounded-full ${className}`}
      alt={alt}
      src={src ?? "/profile-placeholder.jpg"}
      width={64}
      height={64}
    />
  );
}

export default Avatar;
