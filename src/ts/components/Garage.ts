// import Car from './Car';
import RacePad from './RacePad';

export default class Garage {
  private carsCount: string;

  private carsPage: number;

  private racePads: RacePad[];

  private carGarage: string;

  constructor(carsCount: string, carsPage: number, racePads: RacePad[]) {
    this.carsCount = carsCount;
    this.carsPage = carsPage;
    this.racePads = racePads;
    this.carGarage = '';
  }

  renderGarage(): string {
    this.carGarage = `<h1>Garage (${this.carsCount})</h1>
    <h2>Page #${this.carsPage}</h2>
    <ul class="cars-list">
    ${this.racePads.map(racePad => `<li>${racePad.renderPad()}</li>`).join('')}
    </ul>`;
    return this.carGarage;
  }
}
