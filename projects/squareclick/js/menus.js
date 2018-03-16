function Menu (data) {
  this.data = this.parse(data);
}

//TODO
Menu.prototype.parse = function (data) {
  data.items.forEach(function(item, index, array) {
    context.font = item.size+'px Montserrat';
    var text_width = Math.round(context.measureText(item.text).width);
    if(item.w != null) {
      array[index].textX = item.x + ((item.w - text_width) / 2);
      array[index].textY = item.y + ((item.h+item.size-6) / 2);
    } else {
      array[index].textX = item.x;
      array[index].textY = item.y;
    }
  })
  return data;
}

Menu.prototype.update = function (delta) {
  this.data.items.forEach(function(item, index, array) {
    switch (item.type) {
      case 'button':
        if ((mouse.x >= item.x && mouse.x <= item.x + item.width) &&
            (mouse.y >= item.y && mouse.y <= item.y + item.size)) {

        }
        break;
      default:

    }
  })

}

Menu.prototype.render = function(interpPerc) {
  this.data.items.forEach(function(item) {
    context.label(item);
  })
}

var optionsData = {
  x:-1,y:-1,
  items: [
    {
      type: 'title',
      x:150,y: 125,
      size: 72,
      color: '#36FBB3',
      text: "options"
    },
    {
      type:'button',
      x:220,y:400,
      w:150,h:50,
      size: 16,
      bg:'#36FBB3',
      color:'#ffffff',
      text:'back'
    }
  ]
}
