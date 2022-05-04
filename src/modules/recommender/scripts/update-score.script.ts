import { compose } from 'lodash/fp';

const daysRate = 2; //decaying by 2 days
const millisecondsInDaysRate = daysRate * 24 * 3.6e6;
const rate = 1 / millisecondsInDaysRate;

const updateScore = (z: number): number => {
  const t = new Date().getTime(); // get now milliseconds
  const [u, v] = [Math.max(z, rate * t), Math.min(z, rate * t)];
  return u + Math.log1p(Math.exp(v - u));
};

export const setInitialScore = () => updateScore(0);
export const updateScoreWithLike = updateScore;
export const updateScoreWithReservation = compose(updateScore, updateScore);
