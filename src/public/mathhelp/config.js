self.__uv$config = {
    prefix: '/arc~/',
    bare:'https://bare2.mysticmath.workers.dev/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/src/public/mathhelp/handler.js',
    bundle: '/src/public/mathhelp/bundle.js',
    config: '/src/public/mathhelp/config.js',
    sw: '/src/public/mathhelp/sw.js',
};