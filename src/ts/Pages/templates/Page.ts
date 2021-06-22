export default abstract class Page {
  protected container: HTMLElement;

  static ClassObject = {};

  constructor(className: string) {
    this.container = document.createElement('div');
    this.container.className = className;
  }

  protected static createContainer(className: string): HTMLDivElement {
    const container = document.createElement('div');
    container.className = className;
    return container;
  }

  render(): HTMLElement {
    return this.container;
  }
}
