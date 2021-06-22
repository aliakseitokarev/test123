import Car from './Car';

export default class RacePad {
  private car: Car;

  private model: string;

  private id: number;

  private carPad: string;

  constructor(car: Car) {
    this.car = car;
    this.model = car.getModel();
    this.id = car.getId();
    this.carPad = '';
  }

  renderPad(): string {
    this.carPad = `<div class="road-controls">
    <button class="button select-btn" id="select-car${this.id}">
      Select</button>
    <button class="button remove-btn" id="remove-car${this.id}">
      Remove</button>
    <span class="car-model">${this.model}</span>
  </div>
  <div class="road">
    <div class="start-point">
      <div class="start-navigation">
        <button class="button start-engine-btn" id="start-car${this.id}">
          Go!</button>
        <button class="button stop-engine-btn" id="stop-car${this.id}">
          Stop</button>
      </div>
      <div class="car" id="car${this.id}">
        ${this.car.renderCar()}
      </div>
    </div>
    <div class="flag" id="flag${this.id}">⚑</div>
  </div>
    `;
    return this.carPad;
  }
}
