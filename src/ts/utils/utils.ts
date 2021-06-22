import { carBrands, models } from './constants';
import state from './state';
import Car from '../components/Car';

const getRandomName = () => {
  const model = models[Math.floor(Math.random() * models.length)];
  const name = carBrands[Math.floor(Math.random() * models.length)];
  return `${name} ${model}`;
};

const getRandomColor = () => {
  const letters = '0123456789abcdef';
  let color = '#';
  for (let index = 0; index < 6; index++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateRandomCars = (count = 100): Car[] => {
  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    result[i] = new Car(getRandomName(), getRandomColor(), 0);
  }
  return result;
};

const getCenterPosition = (elem: HTMLElement): { x: number; y: number } => {
  const { top, left, width, height } = elem.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
};

export const getHtmlDistance = (
  elem1: HTMLElement,
  elem2: HTMLElement,
): number => {
  const positionElem1 = getCenterPosition(elem1);
  const positionElem2 = getCenterPosition(elem2);
  return (
    Math.hypot(
      positionElem1.x - positionElem2.x,
      positionElem1.y - positionElem2.y,
    ) + elem1.offsetWidth
  );
};

export const animation = (
  car: HTMLElement,
  distance: number,
  animationTime: number,
): { id: number } => {
  let start: number | null = null;
  const motionState = { id: 0 };
  function step(timestamp: number) {
    if (!start) start = timestamp;
    const time = timestamp - start;
    const passed = Math.round(time * (distance / animationTime));
    car.style.transform = `translateX(${Math.min(passed, distance)}px)`;
    if (passed < distance) {
      motionState.id = window.requestAnimationFrame(step);
    }
  }
  motionState.id = window.requestAnimationFrame(step);
  return motionState;
};

export const goRaceAll = async (
  promises: Promise<{
    success: boolean;
    id: number;
    time: number;
  }>[],
  ids: number[],
): Promise<{
  time: number;
  name: string;
  color: string;
  id: number;
}> => {
  const { success, id, time } = await Promise.race(promises);
  if (!success) {
    const failedCarIndex = ids.findIndex(i => i === id);
    const restPromises = [
      ...promises.slice(0, failedCarIndex),
      ...promises.slice(failedCarIndex + 1, promises.length),
    ];
    const restIds = [
      ...ids.slice(0, failedCarIndex),
      ...ids.slice(failedCarIndex + 1, promises.length),
    ];
    return goRaceAll(restPromises, restIds);
  }
  let winnerCar = state.cars[0];
  const winCar = state.cars.find(car => car.id === id);
  if (winCar) {
    winnerCar = winCar;
  }

  return {
    ...winnerCar,
    time: +(time / 1000).toFixed(2),
  };
};

export const goRace = async (
  action: (
    id: number,
  ) => Promise<{ success: boolean; id: number; time: number }>,
): Promise<{
  time: number;
  name: string;
  color: string;
  id: number;
}> => {
  const promises = state.cars.map(({ id }) => action(id));
  const winner = await goRaceAll(
    promises,
    state.cars.map(car => car.id),
  );
  return winner;
};
