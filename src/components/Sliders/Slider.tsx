import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import type { SliderProps } from "~/customTypes";
import Controls from "./Controls";

function Slider({ slides, controls = true }: SliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: "auto",
    containScroll: "trimSnaps",
  });

  const [controlsVisible, setControlVisible] = useState(false);

  function handleMouse() {
    if (!controls) return;
    setControlVisible((prev) => !prev);
  }

  useEffect(() => {
    emblaApi?.reInit();
  });

  return (
    <div className="max-w-full">
      <div
        className="relative overflow-hidden"
        ref={emblaRef}
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
      >
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              className="shrink-0 grow-0 basis-full xs:basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              key={index}
            >
              {slide}
            </div>
          ))}
        </div>
        {controls && <Controls api={emblaApi} visible={controlsVisible} />}
      </div>
    </div>
  );
}

export default Slider;
