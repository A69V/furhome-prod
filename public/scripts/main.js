const nav_menu = document.querySelector(".nav-menu");
const nav_menu_close = document.querySelector(".nav-menu-close");
document.querySelector(".menu-btn").addEventListener("click", function(){
nav_menu.classList.toggle("closed-nav-menu");
nav_menu_close.classList.toggle("nav-menu-close-fade");
});
  // Create a Hammer.js instance
  let webBody = new Hammer(document.body);
  let nav_menuHammer = new Hammer(nav_menu);
  // Add a tap event listener
  webBody.on('swiperight', function() {
    openNavMenu();
  });
nav_menuHammer.on('swipeleft', function() {
    closeNavMenu();
  });
function openNavMenu(){
nav_menu.classList.remove("closed-nav-menu");
nav_menu_close.classList.remove("nav-menu-close-fade");
}
function closeNavMenu(){
nav_menu.classList.add("closed-nav-menu");
nav_menu_close.classList.add("nav-menu-close-fade");
}

