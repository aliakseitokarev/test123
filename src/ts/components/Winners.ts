import state from '../utils/state';
import Car from './Car';

export default class Winners {
  private winTable: string;

  constructor() {
    this.winTable = '';
  }

  renderWinners(): string {
    this.winTable = `<h1>Winners(${state.winnersCount})</h1>
    <h2>Page #${state.winnersPage}</h2>
    <table class="table" border="0" cellspacing="10px" cellpadding="0">
      <thead>
        <th>Number</th>
        <th>Car</th>
        <th class="car-model">Model</th>
        <th class="table-btn wins-btn ${state.sortBy === 'wins' ? state.sortOrder : ''}" id="sort-by-wins">Wins</th>
        <th class="table-btn time-btn 
        ${state.sortBy === 'time' ? state.sortOrder : ''}" id="sort-by-time">Best time (sec)</th>
      </thead>
      <tbody>
        ${state.winners.map((winner, index) => ` <tr>
        <td>${index + 1}</td>
        <td>${new Car(winner.car.name, winner.car.color, winner.id).renderCar()}</td>
        <td>${winner.car.name}</td>
        <td>${winner.wins}</td>
        <td>${winner.time}</td>
      </tr>`).join('')}
      </tbody>
    </table>
    `;
    return this.winTable;
  }
}
