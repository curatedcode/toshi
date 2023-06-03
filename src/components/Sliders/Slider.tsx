import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import type { SliderProps } from "~/customTypes";
import Controls from "./Controls";

function Slider({
  slides,
  controls = true,
  smallSlides = false,
  slideShadows = true,
  slideRounded = true,
}: SliderProps) {
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
        <div
          className={`flex gap-4 py-2 ${
            smallSlides ? "lg:justify-evenly" : ""
          }`}
        >
          {slides.map((slide, index) => (
            <div
              className={
                smallSlides
                  ? `shrink-0 grow-0 basis-1/3 border border-neutral-200 xs:basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/7 ${
                      slideShadows ? "shadow-md shadow-neutral-200" : ""
                    }
                    ${slideRounded ? "rounded-md" : ""}
                    `
                  : `shrink-0 grow-0 basis-[80%] border border-neutral-200 xs:basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 ${
                      slideShadows ? "shadow-md shadow-neutral-200" : ""
                    }
                    ${slideRounded ? "rounded-lg" : ""}
                    `
              }
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
