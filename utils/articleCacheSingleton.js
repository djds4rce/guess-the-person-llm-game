class TokenCache {
    constructor() {
      if (!TokenCache.instance) {
        this.cache = new Map();
        TokenCache.instance = this;
      }
      return TokenCache.instance;
    }
  
    // Store value in the cache based on token
    set(token, value) {
      this.cache.set(token, value);
    }
  
    // Retrieve value from cache based on token
    get(token) {
      return this.cache.get(token);
    }
  
    // Check if a token exists in the cache
    has(token) {
      return this.cache.has(token);
    }
  
    // Remove a token from the cache
    delete(token) {
      this.cache.delete(token);
    }
  
    // Clear the entire cache
    clear() {
      this.cache.clear();
    }
  }
  
  // Usage
  const tokenCache = new TokenCache();

  export default tokenCache;