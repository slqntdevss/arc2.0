async function games() {
    try {
        await registerSW();
      } catch (err) {
        console.log(err);
        throw err;
      }
    
      frame.src = __uv$config.prefix + __uv$config.encodeUrl("https://radon.games");
};
async function goto(site) {
    try {
        await registerSW();
      } catch (err) {
        console.log(err);
        throw err;
      }
    
      location.href = __uv$config.prefix + __uv$config.encodeUrl(site);
}
async function fullscreen() {
  frame.requestFullscreen();
}
async function reload() {
  frame.contentWindow.location.reload();
}