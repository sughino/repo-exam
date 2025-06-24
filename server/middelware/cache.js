import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 });

export function cacheMiddleware(keyBuilder) {
  return (req, res, next) => {
    const key = typeof keyBuilder === 'function' ? keyBuilder(req) : keyBuilder;

    const cachedResponse = cache.get(key);
    if (cachedResponse) {
      return res.status(200).json({
        status: 'success',
        data: cachedResponse,
        cached: true
      });
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (body && body.data) {
        cache.set(key, body.data);
      }
      return originalJson(body);
    };

    next();
  };
}

export function invalidateCache(key) {
  cache.del(key);
}

export default cache;