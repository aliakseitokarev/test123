import Page from './templates/Page';

export default class GaragePage extends Page {
  static ClassObject = {
    ClassTitle: 'garage',
  };

  render(): HTMLElement {
    const wrapper = GaragePage.createContainer(
      GaragePage.ClassObject.ClassTitle,
    );
    wrapper.innerHTML = `
    <nav class="garage__menu">
      <button class="button garage-btn">To garage</button>
      <button class="button winners-btn">To winners</button>
    </nav>
    <div class="garage__main">
      <div class="garage__data">
        <form class="garage-create">
          <input type="text" class="input-name" name="model">
          <input type="color" value="#ffffff" class="input-color" name="color">
          <button class="button create-btn" type="button">Create</button>
        </form>
        <form class="garage-update">
          <input type="text" class="update-name" name="model" disabled>
          <input type="color" value="#ffffff" class="update-color" name="color" disabled>
          <button class="button update-btn" type="submit" disabled>Update</button>
        </form>
      </div>
      <div class="race-controls">
        <button class="button start-btn">Start race</button>
        <button class="button reset-btn">Reset</button>
        <button class="button generate-btn">Generate cars</button>
      </div>
      <div class="garage__cars">
      </div>
      <div class="garage__winner-message">
        <p class="message-text"></p>
      </div>
    </div>
    <div id="winners" style="display: none">
    </div>
    <div class="page-controls">
      <button class="button prev-btn" disabled>Prev</button>
      <button class="button next-btn" disabled>Next</button>
    </div>`;
    this.container.append(wrapper);
    return this.container;
  }
}
