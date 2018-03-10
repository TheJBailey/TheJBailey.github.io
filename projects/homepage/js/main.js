$(function() {
  console.log("loaded!")
  var groups = ['reddit', 'steam', 'chan', 'google', 'film', 'dev']
  var $links = $('.links')
  var $icons = $('.icon')


  groups.forEach(function(element, index) {
    var $icon = $('.'+element)
    var $linkgroup = $('#'+element)

    if(index == 0) {
      $icon.toggleClass('active')
      $linkgroup.children().toggleClass("active")
    }

    $linkgroup.children('div').each(function(index, child) {
      $(child).children().css('transition-delay', ((40*index))+'ms')
    })
    $icon.mouseenter(function() {
      $icons.removeClass('active')
      $links.children().removeClass('active')

      $icon.toggleClass('active')
      $linkgroup.children().toggleClass("active")
    })
  })

})
