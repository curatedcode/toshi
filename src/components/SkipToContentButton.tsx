import type { SkipToContentButtonProps } from "~/customTypes";

function SkipToContentButton({
  type = "default",
  className = "",
  contentId = "#main",
  text = "Skip to main content",
}: SkipToContentButtonProps) {
  if (type === "inline") {
    return (
      <a
        href={contentId}
        className={`h-0 overflow-hidden whitespace-nowrap px-4 text-center text-sky-600 underline underline-offset-1 focus-within:mt-0 focus-within:h-fit focus-within:ring-2 ${className}`}
      >
        {text}
      </a>
    );
  }

  return (
    <a
      href={contentId}
      className={`fixed left-1 z-50 -translate-y-full rounded-b-md bg-black p-2 text-white opacity-0 transition-all focus-within:translate-y-0 focus-within:opacity-100 focus-within:ring-2 focus-within:ring-white ${className}`}
      tabIndex={1}
    >
      {text}
    </a>
  );
}

export default SkipToContentButton;
