'use strict';

const sum = (a, b) => a + b;

// rough estimate of line going thru points, returns {m, b}
export function cheapLineFit(values) {
  const xMean = (values.length - 1) / 2;
  const yMean = values.reduce(sum) / values.length;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < values.length; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += Math.pow(i - xMean, 2);
  }
  const m = numerator / denominator;
  const b = yMean - (m * xMean);
  return {m, b};
}
