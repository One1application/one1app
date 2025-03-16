import React from "react";
import "./styles.css";

const Carousel = ({ position, slides }) => {
  // Determine breakpoints and card sizes
  const isExtraLarge = window.innerWidth >= 1600;
  const isLarge = window.innerWidth >= 1200 && window.innerWidth < 1600;
  const isMedium = window.innerWidth >= 768 && window.innerWidth < 1200;
  const isSmall = window.innerWidth < 768;

  let cardWidth = 400;
  let gap = 30;

  if (isExtraLarge) {
    // Extra Large: 4 cards
    cardWidth = 350;
    gap = 20;
  } else if (isLarge) {
    // Large: 3 cards
    cardWidth = 400;
    gap = 30;
  } else if (isMedium) {
    // Medium: 2 cards
    cardWidth = 400;
    gap = 30;
  } else if (isSmall) {
    // Small: 1 card. We'll rely on percentage-based transforms
    cardWidth = 0;
    gap = 0;
  }

  const translateXValue = isSmall
    ? (position - 1) * 100    // Move in 100% increments for small screens
    : (position - 1) * (cardWidth + gap);

  return (
    <div className="carousel-wrapper">
      <div className="carousel-container">
        <div
          className="carousel-track"
          style={{ 
            transform: isSmall
              ? `translateX(-${translateXValue}%)`
              : `translateX(-${translateXValue}px)`
          }}
        >
          {slides.map((slide, index) => (
            <div className="carousel-item" key={index}>
              <p className="testimonial">{slide.testimonial}</p>
              <div className="user">
                <img src={slide.img} alt={slide.name} />
                <div className="user_inner">
                  <p className="stp">{slide.name}</p>
                  <p className="ndp">{slide.occupation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
