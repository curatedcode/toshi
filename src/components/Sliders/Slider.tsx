import useEmblaCarousel from "embla-carousel-react";
import { useState } from "react";
import type { SliderProps } from "~/customTypes";
import Controls from "./Controls";

function Slider({ slides, controls = true }: SliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });

  const [controlsVisible, setControlVisible] = useState(false);

  function handleMouse() {
    if (!controls) return;
    setControlVisible((prev) => !prev);
  }

  return (
    <div
      className="relative max-w-full overflow-hidden"
      onMouseEnter={handleMouse}
      onMouseLeave={handleMouse}
    >
      <div ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="shrink-0 grow-0 basis-full xs:basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      {controls && <Controls api={emblaApi} visible={controlsVisible} />}
    </div>
  );
}

export default Slider;
