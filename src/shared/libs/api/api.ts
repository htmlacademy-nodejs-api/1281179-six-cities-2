import got from 'got';

export function fetchJSON<T>(url: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const stream = got.stream(url);
    let body = '';
    stream.on('data', (chunk) => {
      body += chunk.toString();
      console.log(`Received ${chunk.length} bytes of data.`);
    });

    stream.on('end', () => {
      try {
        const json = JSON.parse(body);
        resolve(json as T);
      } catch (err) {
        if (err instanceof Error) {
          reject(new Error(`JSON parse error at ${url}: ${err.message}`));
        } else {
          reject(new Error(`Something went wrong: ${err}`));
        }
      }
    });

    stream.on('error', (err: Error) => {
      throw err;
    });
  });
}
