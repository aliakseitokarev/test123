import Car from '../components/Car';

const PAGE_MAX_CARS_LIMIT = 7;
const WINNERS_MAX_LIMIT = 10;
const baseUrl = 'http://localhost:3000';
const garageUrl = `${baseUrl}/garage`;
const engineUrl = `${baseUrl}/engine`;
const winnersUrl = `${baseUrl}/winners`;

export const getCar = async (
  id: number,
): Promise<{ color: string; id: number; name: string }> => {
  const result = (await fetch(`${garageUrl}/${id}`)).json();
  return result;
};

export const getCars = async (
  page: number,
  pageCarsLimit = PAGE_MAX_CARS_LIMIT,
): Promise<{
  items: [{ name: string; color: string; id: number }];
  count: string | null;
}> => {
  const response = await fetch(
    `${garageUrl}?_page=${page}&_limit=${pageCarsLimit}`,
  );

  return {
    items: await response.json(),
    count: response.headers.get('X-Total-Count'),
  };
};

export const deleteCar = async (id: number): Promise<Record<string, never>> => {
  const result = (
    await fetch(`${garageUrl}/${id}`, { method: 'DELETE' })
  ).json();
  return result;
};

export const updateCar = async (car: Car): Promise<Record<string, never>> => {
  const result = (
    await fetch(`${garageUrl}/${car.getId()}`, {
      method: 'PATCH',
      body: JSON.stringify(car),
      headers: { 'Content-Type': 'application/json' },
    })
  ).json();
  return result;
};

export const createCar = async (car: Car): Promise<Record<string, never>> => {
  const result = (
    await fetch(garageUrl, {
      method: 'POST',
      body: JSON.stringify(car),
      headers: { 'Content-Type': 'application/json' },
    })
  ).json();
  return result;
};

export const startEngine = async (
  id: number,
): Promise<{ velocity: number; distance: number }> => {
  const result = (await fetch(`${engineUrl}?id=${id}&status=started`)).json();
  return result;
};

export const stopEngine = async (
  id: number,
): Promise<Record<string, never>> => {
  const result = (await fetch(`${engineUrl}?id=${id}&status=stopped`)).json();
  return result;
};

export const drive = async (id: number): Promise<{ success: boolean }> => {
  const result = await fetch(`${engineUrl}?id=${id}&status=drive`).catch();
  return result.status !== 200
    ? { success: false }
    : { ...(await result.json()) };
};

const getSortOrder = (sort: null | string, order: null | string): string => {
  if (sort && order) return `&_sort=${sort}&_order=${order}`;
  return '';
};

export const getWinners = async ({
  page = 1,
  winnersLimit = WINNERS_MAX_LIMIT,
  sort = null,
  order = null,
}: {
  page?: number;
  winnersLimit?: number;
  sort?: null | string;
  order?: null | string;
}): Promise<{
  items: {
    car: { color: string; id: number; name: string };
    id: number;
    time: number;
    wins: number;
  }[];
  count: string | null;
}> => {
  const response = await fetch(
    `${winnersUrl}?_page=${page}&_limit=${winnersLimit}${getSortOrder(
      sort,
      order,
    )}`,
  );
  const items = (await response.json()) as [
    { id: number; time: number; wins: number },
  ];
  return {
    items: await Promise.all(
      items.map(async winner => ({ ...winner, car: await getCar(winner.id) })),
    ),
    count: response.headers.get('X-Total-Count'),
  };
};

export const getWinner = async (
  id: number,
): Promise<{ wins: number; time: number }> =>
  (await fetch(`${winnersUrl}/${id}`)).json();

export const getWinnerStatus = async (id: number): Promise<number> =>
  (await fetch(`${winnersUrl}/${id}`)).status;

export const deleteWinner = async (id: number): Promise<number> =>
  (await fetch(`${winnersUrl}/${id}`, { method: 'DELETE' })).json();

export const createWinner = async (body: {
  id: number;
  wins: number;
  time: number;
}): Promise<Record<string, never>> => {
  const result = (
    await fetch(winnersUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
  ).json();
  return result;
};

export const updateWinner = async (
  id: number,
  body: { id: number; wins: number; time: number },
): Promise<Record<string, never>> => {
  const result = (
    await fetch(`${winnersUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
  ).json();
  return result;
};

export const saveWinner = async (winner: {
  time: number;
  name: string;
  color: string;
  id: number;
}): Promise<void> => {
  const winnerStatus = await getWinnerStatus(winner.id);
  if (winnerStatus === 404) {
    await createWinner({ id: winner.id, wins: 1, time: winner.time });
  } else {
    const win = await getWinner(winner.id);
    await updateWinner(winner.id, {
      id: winner.id,
      wins: win.wins + 1,
      time: winner.time < win.time ? winner.time : win.time,
    });
  }
};
