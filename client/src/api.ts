const applyFieldsToUrl = (
  url: string,
  fields = {} as Record<string, string>
) => {
  return (
    url
      // Switch all :foo for any fields.foo and remove those .foo from fields
      .replace(/:([A-Za-z]\w*)/g, (_, field) => {
        const result = fields[field];
        delete fields[field];
        return result;
      })
      // Change any // to / (except for :// as in https://)
      .replace(/([^:])\/\/+/g, '$1/')
      .replace(/^\/\//g, '/')
  );
};

export class Api {
  server = '';

  constructor({ server = '' } = {}) {
    this.server = server;
  }

  async get<TResponse>(slug: string, body: Record<string, any> = {}) {
    const url = applyFieldsToUrl(`${this.server}/${slug}`, body);

    const response = await fetch(
      `${url.toString()}?${new URLSearchParams(body)}`,
      { method: 'GET' }
    );

    return (await response.json()) as TResponse;
  }

  async delete<TResponse>(slug: string, body: Record<string, any> = {}) {
    const url = applyFieldsToUrl(`${this.server}/${slug}`, body);

    const response = await fetch(
      `${url.toString()}?${new URLSearchParams(body)}`,
      { method: 'DELETE' }
    );

    return (await response.json()) as TResponse;
  }

  async patch<TResponse>(slug: string, body: Record<string, any>) {
    const url = applyFieldsToUrl(`${this.server}/${slug}`, body);

    const response = await fetch(url.toString(), {
      method: 'PATCH',
      body: JSON.stringify(body),
    });

    return (await response.json()) as TResponse;
  }

  async post<TResponse>(slug: string, body: Record<string, any>) {
    const url = applyFieldsToUrl(`${this.server}/${slug}`, body);

    const response = await fetch(url.toString(), {
      method: 'GET',
      body: JSON.stringify(body),
    });

    return (await response.json()) as TResponse;
  }
}
