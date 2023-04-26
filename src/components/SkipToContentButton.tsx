export default function SkipToContentButton() {
  return (
    <a
      href="#main"
      className="fixed left-1 z-50 -translate-y-full rounded-b-md bg-black p-2 text-white opacity-0 transition-all focus-within:translate-y-0 focus-within:opacity-100 focus-within:ring-2 focus-within:ring-white"
    >
      Skip to content
    </a>
  );
}
