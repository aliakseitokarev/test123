import GaragePage from './Pages/GaragePage';
import Car from './components/Car';
import RacePad from './components/RacePad';
import Garage from './components/Garage';
import Winners from './components/Winners';
import {
  getCars,
  deleteCar,
  getCar,
  updateCar,
  createCar,
  startEngine,
  stopEngine,
  drive,
  saveWinner,
  getWinners,
  deleteWinner,
} from './utils/mockAPI';
import state from './utils/state';
import {
  generateRandomCars,
  getHtmlDistance,
  animation,
  goRace,
} from './utils/utils';

export default class App {
  private static container: HTMLElement = document.body;

  private static selectedCar: {
    color: string;
    id: number;
    name: string;
  } | null = null;

  private car: Car;

  private static tesla: Car;

  private static renderMainPage(): void {
    const garageView = new GaragePage('app-wrapper');
    App.container.append(garageView.render());
  }

  private static async updateGarageState(): Promise<void> {
    const { items, count } = await getCars(state.carsPage);
    state.cars = items;
    state.carsCount = count;
    if (state.carsCount !== null) {
      const nextBtn = document.querySelector('.next-btn') as HTMLButtonElement;
      const prevBtn = document.querySelector('.prev-btn') as HTMLButtonElement;
      if (state.carsPage * state.carsLimit < +state.carsCount) {
        nextBtn.disabled = false;
      } else {
        nextBtn.disabled = true;
      }
      if (state.carsPage > 1) {
        prevBtn.disabled = false;
      } else {
        prevBtn.disabled = true;
      }
    }
  }

  private static async updateWinnersState(): Promise<void> {
    const { items, count } = await getWinners({
      page: state.winnersPage,
      sort: state.sortBy,
      order: state.sortOrder,
    });
    state.winners = items;
    state.winnersCount = count;
    if (state.winnersCount !== null) {
      const nextBtn = document.querySelector('.next-btn') as HTMLButtonElement;
      const prevBtn = document.querySelector('.prev-btn') as HTMLButtonElement;
      if (state.winnersPage * 10 < +state.winnersCount) {
        nextBtn.disabled = false;
      } else {
        nextBtn.disabled = true;
      }
      if (state.winnersPage > 1) {
        prevBtn.disabled = false;
      } else {
        prevBtn.disabled = true;
      }
    }
  }

  private static renderGarage(): void {
    const racePad: RacePad[] = [];
    state.cars.forEach(car => {
      racePad.push(new RacePad(new Car(car.name, car.color, car.id)));
    });
    const garage = new Garage(
      state.carsCount as string,
      state.carsPage,
      racePad,
    );
    const carWrapper = App.container.querySelector(
      '.garage__cars',
    ) as HTMLElement;
    carWrapper.innerHTML = garage.renderGarage();
    App.updateGarageState();
  }

  private static renderWinners(): void {
    const winners = new Winners();
    const winnerWrapper = document.getElementById('winners') as HTMLElement;
    winnerWrapper.innerHTML = winners.renderWinners();
  }

  private static async selectCar(
    updateInput: HTMLInputElement,
    updateColorInput: HTMLInputElement,
    updateBtn: HTMLButtonElement,
    id: number,
  ): Promise<void> {
    App.selectedCar = await getCar(id);

    updateInput.value = App.selectedCar.name;
    updateColorInput.value = App.selectedCar.color;
    updateInput.disabled = false;
    updateColorInput.disabled = false;
    updateBtn.disabled = false;
    App.updateCarSettings(updateInput, updateColorInput, updateBtn);
  }

  private static updateCarSettings(
    updateInput: HTMLInputElement,
    updateColorInput: HTMLInputElement,
    updateBtn: HTMLButtonElement,
  ): void {
    document.body.addEventListener('submit', async event => {
      event.preventDefault();
      if (App.selectedCar) {
        const car = new Car(
          updateInput.value,
          updateColorInput.value,
          App.selectedCar.id,
        );
        await updateCar(car);
        await App.updateGarageState();
        updateInput.value = '';
        updateInput.disabled = true;
        updateColorInput.value = '#ffffff';
        updateColorInput.disabled = true;
        updateBtn.disabled = true;
        App.selectedCar = null;
        App.renderGarage();
      }
    });
  }

  private static async createNewCar(
    createInput: HTMLInputElement,
    chooseColorInput: HTMLInputElement,
  ): Promise<void> {
    const car = new Car(createInput.value, chooseColorInput.value, 0);
    await createCar(car);
    await App.updateGarageState();
    App.renderGarage();
    createInput.value = '';
  }

  private static async generateCars(
    generateBtn: HTMLButtonElement,
  ): Promise<void> {
    generateBtn.disabled = true;
    const cars = generateRandomCars();
    await Promise.all(cars.map(async car => createCar(car)));
    await App.updateGarageState();
    App.renderGarage();
    generateBtn.disabled = false;
  }

  private static async startDriving(id: number) {
    const startBtn = document.getElementById(`start-car${id}`) as HTMLButtonElement;
    startBtn.disabled = true;
    const { velocity, distance } = await startEngine(id);
    const time = Math.round(distance / velocity);

    const stopBtn = document.getElementById(`stop-car${id}`) as HTMLButtonElement;
    stopBtn.disabled = false;

    const car = document.getElementById(`car${id}`) as HTMLElement;
    const flag = document.getElementById(`flag${id}`) as HTMLElement;
    const roadDistance = Math.floor(getHtmlDistance(car, flag));

    state.animation.id = animation(car, roadDistance, time);
    const { success } = await drive(id);
    if (!success) window.cancelAnimationFrame(state.animation.id.id);

    return { success, id, time };
  }

  private static async stopDriving(id: number) {
    const stopBtn = document.getElementById(`stop-car${id}`) as HTMLButtonElement;
    stopBtn.disabled = true;
    await stopEngine(id);
    const startBtn = document.getElementById(`start-car${id}`) as HTMLButtonElement;
    startBtn.disabled = false;

    const car = document.getElementById(`car${id}`) as HTMLElement;
    car.style.transform = `translateX(0)`;
    if (state.animation.id) window.cancelAnimationFrame(state.animation.id.id);
  }

  private static async startRace(startBtn: HTMLButtonElement) {
    startBtn.disabled = true;
    const winner = await goRace(App.startDriving);
    await saveWinner(winner);
    const message = document.querySelector('.message-text') as HTMLElement;
    message.innerHTML = `${winner.name} WIN!!! (${winner.time}s)`;
    message.classList.toggle('visible', true);
    const resetBtn = document.querySelector('.reset-btn') as HTMLButtonElement;
    resetBtn.disabled = false;
  }

  private static reset(resetBtn: HTMLButtonElement) {
    resetBtn.disabled = true;
    state.cars.map(({ id }) => App.stopDriving(id));
    const message = document.querySelector('.message-text') as HTMLElement;
    message.classList.toggle('visible', false);
    const startBtn = document.querySelector('.start-btn') as HTMLButtonElement;
    startBtn.disabled = false;
  }

  private static setSortOrder = async (sortBy: string) => {
    state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    state.sortBy = sortBy;
    await App.updateWinnersState();
    App.renderWinners();
  }

  private static async pagination(direction: string): Promise<void> {
    if (direction.includes('prev-btn')) {
      if (state.screen === 'garage') {
        state.carsPage--;
        await App.updateGarageState();
        App.renderGarage();
      } else {
        state.winnersPage--;
        await App.updateWinnersState();
        App.renderWinners();
      }
    } else {
      if (state.screen === 'garage') {
        state.carsPage++;
        await App.updateGarageState();
        App.renderGarage();
      } else {
        state.winnersPage++;
        await App.updateWinnersState();
        App.renderWinners();
      }
    }
  }

  private static checkUI(): void {
    document.body.addEventListener('click', async event => {
      const clickTarget = event.target as HTMLElement;
      const id = +clickTarget.id.slice(clickTarget.id.lastIndexOf('r') + 1);
      if (clickTarget.classList.contains('remove-btn')) {
        await deleteCar(id);
        await deleteWinner(id);
        await App.updateGarageState();
        App.renderGarage();
      }
      if (clickTarget.classList.contains('select-btn')) {
        const updateInput = document.querySelector('.update-name') as HTMLInputElement;
        const updateColorInput = document.querySelector('.update-color') as HTMLInputElement;
        const updateBtn = document.querySelector('.update-btn') as HTMLButtonElement;
        await App.selectCar(updateInput, updateColorInput, updateBtn, id);
      }
      if (clickTarget.classList.contains('create-btn')) {
        const createInput = document.querySelector('.input-name') as HTMLInputElement;
        const chooseColorInput = document.querySelector('.input-color') as HTMLInputElement;
        // const createBtn = document.querySelector('.create-btn') as HTMLButtonElement;
        await App.createNewCar(createInput, chooseColorInput);
      }
      if (clickTarget.classList.contains('start-engine-btn')) {
        App.startDriving(id);
      }
      if (clickTarget.classList.contains('stop-engine-btn')) {
        App.stopDriving(id);
      }
      if (clickTarget.classList.contains('generate-btn')) {
        App.generateCars(clickTarget as HTMLButtonElement);
      }
      if (clickTarget.classList.contains('start-btn')) {
        App.startRace(clickTarget as HTMLButtonElement);
      }
      if (clickTarget.classList.contains('reset-btn')) {
        App.reset(clickTarget as HTMLButtonElement);
      }
      if (clickTarget.classList.contains('garage-btn')) {
        const garage = document.querySelector('.garage__main') as HTMLDivElement;
        const winners = document.getElementById('winners') as HTMLDivElement;
        garage.style.display = 'block';
        winners.style.display = 'none';
        state.screen = 'garage';
        App.renderGarage();
      }
      if (clickTarget.classList.contains('winners-btn')) {
        const garage = document.querySelector('.garage__main') as HTMLDivElement;
        const winners = document.getElementById('winners') as HTMLDivElement;
        garage.style.display = 'none';
        winners.style.display = 'block';
        state.screen = 'winners';
        await App.updateWinnersState();
        winners.innerHTML = new Winners().renderWinners();
      }
      if (
        clickTarget.classList.contains('prev-btn') ||
        clickTarget.classList.contains('next-btn')
      ) {
        App.pagination(clickTarget.classList.toString());
      }
      if (clickTarget.classList.contains('wins-btn')) {
          App.setSortOrder('wins');
        }
      if (clickTarget.classList.contains('time-btn')) {
          App.setSortOrder('time');
        }
    });
  }

  constructor() {
    this.car = new Car('Tesla', '#1fee11', 666);
  }

  run(): void {
    App.renderMainPage();
    App.renderGarage();
    App.checkUI();
    App.tesla = this.car;
  }
}
