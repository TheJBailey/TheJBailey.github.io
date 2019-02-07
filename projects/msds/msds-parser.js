window.onload = function() {
  var
    field = document.getElementById('field')
    submit = document.getElementById('submit')

  var chems = []

  submit.onclick = function() {
    var url = "https://cors-anywhere.herokuapp.com/" + field.value
    var data = ""
    fetch(url).then(function(response){return response.text()}).then(function(text){createEntry(text)})
  }

};

var htmlStruct = `
<div class="chem">
  <div class="top">
    <span class="name"></span>
    <span class="formula"></span>
    <span class="cas"></span>
  </div>
  <div class="info">
    <span class="weight"></span>
    <div class="props">
      <span class="melt"></span>
      <span class="boil"></span>
      <span class="density"></span>
    </div>
    <div class="safety">
      <span class="health"></span>
      <span class="fire"></span>
      <span class="react"></span>
    </div>
    <span class="risks"></span>
    <span class="aid"></span>
  </div>
</div>
`

var newObj = {
  name:"",
  weight:"",
  formula:"",
  cas:"",
  phys:{melt:"",boil:"",density:""},
  info:{health:"",flame:"",react:""},
  aid:""
}

function createEntry(data) {
  var parser = new DOMParser()
  var text = parser.parseFromString(data,"text/html").body.innerText
  //console.log(text);
  var obj = newObj
  obj.name = /MSDS Name:(.*)/g.exec(text)[1]
  obj.weight = /Molecular Weight:(.*)/g.exec(text)[1]
  obj.formula = /Molecular Formula:(.*)/g.exec(text)[1]
  obj.phys.melt = /Freezing\/Melting Point:(.*)/g.exec(text)[1]
  obj.phys.density = /Density:(.*)/g.exec(text)[1]
  obj.phys.boil = /Boiling Point:(.*)/g.exec(text)[1].trim()
  info_temp = /Health:(.*)/g.exec(text)[0].split(';') //TODO substring parse
  console.log(info_temp[2].trim().split(' ')[1]);
  obj.info = {
    health:info_temp[0].trim().split(' ')[1],
    flame:info_temp[1].trim().split(' ')[1],
    react:info_temp[2].trim().split(' ')[1]
  }
  obj.aid = text.substring(
    text.indexOf("Section 4 - First Aid Measures")+30,
    text.indexOf("Section 5 - Fire Fighting Measures")).trim()
  obj.cas = text.substring(
    text.indexOf("CAS#", text.indexOf("CAS#")+1)+4,
    text.indexOf(":",
      text.indexOf("CAS#", text.indexOf("CAS#")+4))).trim()
  console.log('obj created')

  var name = create('span', 'name', obj.name)
  var formula = create('span', 'formula', ' '+obj.formula)
  var cas = create('span', 'cas', ' '+obj.cas)
  var weight = create('span', 'weight', 'MW: '+obj.weight)
  var melt = create('span', 'melt', 'Phys. Properties: m.p. = '+obj.phys.melt)
  var boil = create('span', 'boil', ', BP = '+obj.phys.boil)
  var dense = create('span', 'dense', ', d = '+obj.phys.density)
  var health = create('span', 'health', 'Safety Info: Health - '+obj.info.health)
  var flame = create('span', 'flame', ', Fire - '+obj.info.flame)
  var react = create('span', 'react', ', Reactivity - '+obj.info.react)
  var aid = create('span', 'aid', 'First Aid:'+obj.aid)
  console.log('nodes created')

  var wrapper = create('div', 'wrapper', '')
  var top = create('div', 'top', '')
  top.appendChild(name)
  top.appendChild(formula)
  top.appendChild(cas)
  var info = create('div', 'info', '')
  info.appendChild(weight)
  var props = create('div', 'props', '')
  props.appendChild(melt)
  props.appendChild(boil)
  props.appendChild(dense)
  var safety = create('div', 'safety', '')
  safety.appendChild(health)
  safety.appendChild(flame)
  safety.appendChild(react)
  info.appendChild(props)
  info.appendChild(safety)
  info.appendChild(aid)
  wrapper.appendChild(top)
  wrapper.appendChild(info)

  document.body.appendChild(wrapper)
  console.log('nodes added')
}

function create(type, title, data) {
  var node = document.createElement(type)
  node.classList.add(title)
  node.appendChild(document.createTextNode(data))
  return node
}
