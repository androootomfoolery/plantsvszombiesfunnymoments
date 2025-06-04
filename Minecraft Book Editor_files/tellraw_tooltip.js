function tellraw_tooltip_init(zone)
{
  // cancel click on <a> tags
  zone.find('a').attr('href', '');
  zone.find('a').on('click', function() { return false;});

  zone.find('a.openurl')       .each(function() { tellraw_tooltip_set_tooltip(this, "Click", "OpenURL", $(this).attr('data-openurl')); });
  zone.find('a.runcommand')    .each(function() { tellraw_tooltip_set_tooltip(this, "Click", "RunCommand", $(this).attr('data-runcommand')); });
  zone.find('a.suggestcommand').each(function() { tellraw_tooltip_set_tooltip(this, "Click", "SuggestCommand", $(this).attr('data-suggestcommand')); });
  zone.find('a.changepage')    .each(function() { tellraw_tooltip_set_tooltip(this, "Click", "ChangePage", $(this).attr('data-changepage')); });
  zone.find('a.copyclipboard') .each(function() { tellraw_tooltip_set_tooltip(this, "Click", "CopyToClipboard", $(this).attr('data-copyclipboard')); });

  zone.find('a.insert')        .each(function() { tellraw_tooltip_set_tooltip(this, "ShiftClick", "Insert", $(this).attr('data-insert')); });

  zone.find('ins.text')        .each(function() { tellraw_tooltip_set_tooltip(this, "Hover", "Text", $(this).attr('data-text')); });
  zone.find('ins.item')        .each(function() { tellraw_tooltip_set_tooltip(this, "Hover", "Item", $(this).attr('data-item')); });
  zone.find('ins.achievement') .each(function() { tellraw_tooltip_set_tooltip(this, "Hover", "Achievement", $(this).attr('data-achievement')); });
  zone.find('ins.statistic')   .each(function() { tellraw_tooltip_set_tooltip(this, "Hover", "Statistic", $(this).attr('data-statistic')); });
  zone.find('ins.entity')      .each(function() { tellraw_tooltip_set_tooltip(this, "Hover", "Entity", $(this).attr('data-entity')); });

  zone.find('code.selector')   .each(function() { tellraw_tooltip_set_tooltip(this, "Selector", "", $(this).text()); });
  zone.find('code.scoreboard') .each(function() { tellraw_tooltip_set_tooltip(this, "Score", "", $(this).attr('data-scoreboard')); });
  zone.find('code.keybind')    .each(function() { tellraw_tooltip_set_tooltip(this, "Keybind", "", $(this).attr('data-keycode')); });
}

function tellraw_tooltip_set_tooltip(obj, eventname, commandtype, datas)
{
  if (eventname == "Hover" && commandtype == "Entity")
  {
    var split = datas.split('§§');
    datas = "<u>Type:</u> " + split[0] + "<br>"
          + "<u>Name:</u> " + split[1] + "<br>"
          + "<u>UUID:</u> " + split[2];
  }
  else if (eventname == "Score")
  {
    var split = datas.split('§§');
    datas = "<u>Selector:</u> " + split[0] + "<br>"
          + "<u>Objective:</u> " + split[1];
  }
  else if (eventname == "Keybind")
  {
    // try
    // {
    //   datas = CKEDITOR.currentInstance.lang.keybind[datas.replace(/\./g,'_')];
    // }
    // catch(ex) {}
  }

  var tooltipclass = eventname.toLowerCase();
  var content =
    "<div class='" + tooltipclass + "'>"+
      "<strong>" + eventname + ":" +
      "" + commandtype + "</strong><br>" +
      datas +
    "</div>";

  var position;
  if (eventname == "Hover")
    position = "top";
  else if (eventname == "Selector" || eventname == "Score" || eventname == "Keybind")
    position = "bottom";
  else
    position = "right";

  $(obj).addClass('tooltip');

  //http://iamceege.github.io/tooltipster/#getting-started
  $(obj).tooltipster(
  {
    content: $(content),
    position: position,
  });
}