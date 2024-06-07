

document.addEventListener("DOMContentLoaded", function () {
  const sidebarLinks = document.querySelectorAll("#sidebar a");
  var titleChanger = document.querySelector('#titleChanger');
  if (titleChanger) {
    titleChanger.addEventListener("input", function () { // Corrected event type to "input"
      window.top.document.title = titleChanger.value;
    });
  } else {
    console.error("No input, is the page loaded?");
  }
  sidebarLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
          e.preventDefault();

          const targetSectionId = link.getAttribute("href").substring(1);

          const targetSection = document.getElementById(targetSectionId);

          if (targetSection) {
              window.scrollTo({
                  top: targetSection.offsetTop,
                  behavior: "smooth"
              });
          }
      });
  });
});



function resetData() {
  if(confirm("Are you sure you want to reset your data? This will treat you as a new user")) {
    localStorage.clear();
    window.top.location.reload();
  }
}
  function ab() {
    var ab = window.open(
      "",
      "myWindow1",
      "scrollbars=1,height=" + screen.availHeight + ",width=" + screen.availWidth,
    );
    ab.document.write(
      `<!DOCTYPE html>\n\
  <title>Google</title>\n\
  <iframe src=${window.top.location.host} frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%">\n\
  <script>\n\
  alert("");\n\
  <\x2fscript>`,
    );
    window.top.location.replace("https://classroom.google.com");
  }