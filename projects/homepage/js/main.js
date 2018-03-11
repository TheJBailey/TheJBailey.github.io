$(function() {
  console.log("loaded!")
  var groups = ['reddit', 'steam', 'chan', 'google', 'film', 'dev']
  var $links = $('.links')
  var $icons = $('.icon')


  groups.forEach(function(element, group_index) {
    var $icon = $('.'+element)
    var $linkgroup = $('#'+element)

    if(group_index == 0) {
      $icon.toggleClass('active')
      $linkgroup.children().toggleClass("active")
    }

    $linkgroup.children('div').each(function(index, child) {
      var delay = (50*Math.abs(group_index-index));
      $(child).children().css('transition-delay', (delay)+'ms')
    })
    $icon.mouseenter(function() {
      $icons.removeClass('active')
      $links.children().removeClass('active')

      $icon.toggleClass('active')
      $linkgroup.children().toggleClass("active")
    })
  })

})
