function getProductRating(reviews: { rating: number }[]) {
  const allRatings = reviews.map((review) => review.rating);

  if (reviews.length < 1) {
    return null;
  }

  const ratingTotal = allRatings.reduce(
    (rating, totalValue) => (totalValue += rating)
  );

  const ratingAverage =
    Math.round((ratingTotal / allRatings.length) * 1e1) / 1e1;

  return ratingAverage;
}

export default getProductRating;
