import { getCars, getWinners } from './mockAPI';

const { items: cars, count: carsCount } = await getCars(1);
let carsPage = 1;
let winnersPage = 1;
let screen = 'garage';
const carsLimit = 7;
const animation = { id: { id: 0 } };
let sortBy: string = '';
let sortOrder: string = '';


const { items: winners, count: winnersCount } = await getWinners({ page: 1 });

export default {
  carsCount,
  carsPage,
  cars,
  screen,
  carsLimit,
  animation,
  winnersPage,
  winners,
  winnersCount,
  sortBy,
  sortOrder,
};
