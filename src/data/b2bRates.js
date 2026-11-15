// Rates used by the B2B Cost Estimator. Edit the numbers here to change prices on the website.
// (These are the default rates from the original Letter Cost Estimator tool.)
//
// Liquid acrylic + channel: each letter is placed in a size band by its own "running inch"
// (the larger of its height and width).
//   under b1 inches  -> t1 rate per running inch
//   b1 up to b2      -> t2
//   b2 up to b3      -> t3
//   above b3         -> custom rate (customer is asked to contact us)
// c40 / c60 / c80 are the extra rupees per running inch for a 40 / 60 / 80 mm channel.
// l3 / c3 are the per running inch rates for the two 3D-print categories.
export const DEFAULT_RATES = {
  t1: 125, t2: 135, t3: 145,
  b1: 18, b2: 24, b3: 36,
  l3: 100, c3: 90,
  c40: 0, c60: 10, c80: 20
};
