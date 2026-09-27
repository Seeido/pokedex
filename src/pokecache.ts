type CacheEntry<T> = {
  createdAt: number;
  val: T;
};

export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalId: NodeJS.Timeout | undefined = undefined;
  #interval: number;

  constructor(num: number) {
    this.#interval = num;
    this.#startReapLoop();
  }

  #reap() {
    for (const [key, value] of this.#cache) {
      if (value.createdAt < Date.now() - this.#interval) {
        this.#cache.delete(key);
      }
    }
  }

  #startReapLoop() {
    this.#reapIntervalId = setInterval(() => this.#reap(), this.#interval);
  }

  stopReapLoop() {
    clearInterval(this.#reapIntervalId);
    this.#reapIntervalId = undefined;
  }

  add<T>(key: string, val: T) {
    const cacheObj: CacheEntry<T> = {
      createdAt: Date.now(),
      val: val,
    };
    this.#cache.set(key, cacheObj);
  }
  get<T>(key: string) {
    const cacheObj = this.#cache.get(key);
    if (cacheObj) return cacheObj.val;
    return undefined;
  }
}
