var $leftNav  = $('#nav-left')
    $rightNav = $('#nav-right')
    $current  = $('.current')
    $document = $(document)
    $displays = $('.display')

updateScroll();
fixNav();

function fixNav() {
  if(scroll != $current.offset().left) {
    for(var i = 0; i < $displays; i++) {
      var $elem = $displays.eq(i);
      if (scroll == $elem.offset().left) {
        
      }
    }
  }
}

function updateNav() {
  console.log();
}

function updateScroll() {
  scroll = $document.scrollLeft();
}

function navigateTo(element) {
  if (element.length == 0) return;
  $current.removeClass('current');
  $current = element;
  $current.addClass('current');
  console.log("new disp elem + ", $current);
  $('html, body').animate({
    scrollLeft: $current.offset().left,
    complete:fixNav
  }, 500);
  updateNav();
}

function getPreviousElement() {
  var $elem = $current.prev('.display');
  return $elem;
}

function getNextElement() {
  var $elem = $current.next('.display');
  return $elem;
}


function navPrev() {
  navigateTo(getPreviousElement());
}

function navNext() {
  navigateTo(getNextElement());
}

$leftNav.on('click', navPrev);
$rightNav.on('click', navNext);
$document.on('scroll', updateScroll);
