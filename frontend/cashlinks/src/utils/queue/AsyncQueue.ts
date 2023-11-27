class AsyncQueue<T> {
  private readonly items: T[];
  private readonly resolves: Array<(value: T | PromiseLike<T>) => void>;

  constructor() {
    this.items = [];
    this.resolves = [];
  }

  async enqueue(item: T): Promise<void> {
    if (this.resolves.length > 0) {
      const resolve = this.resolves.shift();
      resolve?.(item);
    } else {
      this.items.push(item);
    }
  }

  async dequeue(): Promise<T> {
    return new Promise(resolve => {
      if (this.items.length > 0) {
        resolve(this.items.shift() as T);
      } else {
        this.resolves.push(resolve);
      }
    });
  }
}

export {
    AsyncQueue,
};