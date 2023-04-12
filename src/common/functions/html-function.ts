const initScrollTop = () => {
    window.onscroll = function () {
        scrollFunction();
      };
    
      function scrollFunction() {
        if (
          document.body.scrollTop > document.body.clientHeight / 2 ||
          document.documentElement.scrollTop > 20
        ) {
          document
            .querySelector(".button-scroll-to-top")
            ?.setAttribute("style", "display:block");
        } else {
          document
            .querySelector(".button-scroll-to-top")
            ?.setAttribute("style", "display:none");
        }
      }
    
      document
        .querySelector(".button-scroll-to-top")
        ?.addEventListener("click", () => {
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        });
}

export {
    initScrollTop
}