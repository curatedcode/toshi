import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import type { CarouselProps, CarouselThumbProps } from "~/customTypes";
import Controls from "./Controls";

function Carousel({ slides, controls, thumbnails }: CarouselProps) {
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    loop: true,
  });

  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
  });

  const [controlsVisible, setControlVisible] = useState(false);

  function handleMouse() {
    if (!controls) return;
    setControlVisible((prev) => !prev);
  }

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      if (emblaThumbsApi.clickAllowed()) emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  useEffect(() => {
    emblaMainApi?.reInit();
  }, [emblaMainApi]);

  return (
    <div className="relative flex flex-col gap-2 md:max-w-xs">
      <div
        className="overflow-hidden"
        ref={emblaMainRef}
        onMouseEnter={handleMouse}
        onMouseLeave={handleMouse}
      >
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="relative shrink-0 grow-0 basis-full">
              {slide}
            </div>
          ))}
        </div>
        {controls && slides.length > 1 && (
          <Controls
            type="shallow"
            api={emblaMainApi}
            visible={controlsVisible}
          />
        )}
      </div>
      {thumbnails && (
        <div className="overflow-hidden rounded-md" ref={emblaThumbsRef}>
          <div className="flex w-fit max-w-full gap-2 rounded-md">
            {slides.map((slide, index) => (
              <Thumbnail
                key={index}
                slide={slide}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Thumbnail({ onClick, selected, slide, index }: CarouselThumbProps) {
  return (
    <button
      type="button"
      aria-label={`View image ${index}`}
      onClick={onClick}
      className={`relative max-h-14 shrink-0 grow-0 rounded-md ${
        selected ? "" : "opacity-50"
      }`}
      style={{ flexBasis: "25%" }}
      title={`View image ${index}`}
    >
      {slide}
    </button>
  );
}

export default Carousel;
