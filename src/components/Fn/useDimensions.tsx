import { useCallback, useState } from "react";

function useDimensions() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const ref = useCallback((node: HTMLElement) => {
    if (node === null) return;
    setWidth(node.getBoundingClientRect().width);
    setHeight(node.getBoundingClientRect().height);
  }, []);

  return { ref, width, height };
}

export default useDimensions;
