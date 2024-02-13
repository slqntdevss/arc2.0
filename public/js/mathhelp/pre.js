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
function transitionToPage(page) {
  document.querySelector('body').style.opacity = 0
  setTimeout(function() { 
      frame.src = location.href + page;
  }, 500)
}
function transitionToPageWProxy(page) {
  document.querySelector('body').style.opacity = 0
  setTimeout(function() { 
      window.location.href = __uv$config.prefix + __uv$config.encodeUrl(page);
  }, 500)
}

document.addEventListener('DOMContentLoaded', function(event) {
  document.querySelector('body').style.opacity = 1
})