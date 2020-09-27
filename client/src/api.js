export class Api {
  constructor({ server = '' } = {}) {
    this.server = server;
  }

  async get(path = '') {
    const response = await fetch(`${this.server}/${path.replace(/^\//, '')}`);

    return await response.json();
  }
}
