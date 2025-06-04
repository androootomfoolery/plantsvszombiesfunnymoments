var current_page = 1;
var pages_content = [];
var last_command = null;

function get_page_count()
{
  return $('.pages .page').length;
}

function add_page()
{
  var new_id = get_page_count() + 1;
  var html = // HTML page tab
    '<div class="page" id="tab_page' + new_id + '" data-id="' + new_id + '">' +
    '  <input type="hidden" id="page' + new_id + '" name="page' + new_id + '"/>' +
    '  <span class="tab_title">Page ' + new_id + '</span>' +
    '  <span class="delete">X</span>' +
    '</div>';
  $(html).insertBefore(".pages #add_page");
  pages_content[new_id] = "";
  select_page(new_id);
}

function flush_pages()
{
  if (current_page == 0)
    return;

  var book_data = clean_CKEditor_input(CKEDITOR.instances.book.getData());
  // sauvegarde le contenu de la page en cours
  pages_content[current_page] = book_data;
  $(".pages #page" + current_page).val(book_data);
}

function select_page(page_id)
{
  flush_pages();

  $(".pages #tab_page" + current_page).removeClass("selected");

  current_page = page_id;
  $(".pages #tab_page" + current_page).addClass("selected");
  CKEDITOR.instances.book.setData(pages_content[current_page]);
  update_preview();
}

function remove_page(page_id)
{
  flush_pages();
  var count = get_page_count();
  if (count == 1) return; // laisser au moins une page
  for (var i = page_id; i < count; i++)
  {
    pages_content[i] = pages_content[i + 1];
  }
  pages_content[count] = null;

  $(".pages #tab_page" + current_page).removeClass("selected"); // on décalle les pages pour ne pas faire de trou
  $(".pages #tab_page" + count).remove(); // suppression du dernier onglet
  current_page = 0;

  if (page_id == count) page_id--; // si on a effacé la dernière page, on revient à la page précédente, sinon la suivante
  select_page(page_id);
}

function update_preview()
{
  var book = pages_content[current_page];
  $(".preview_zone .preview_book").html(book);
  tellraw_tooltip_init($(".preview_zone .preview_book")); // génération des tooltips
  update_nav();
}

function update_nav()
{
  var count = get_page_count(); // nombre total de page
  $(".preview_zone .nav .left").toggle(current_page > 1);
  $(".preview_zone .nav .right").toggle(current_page < count);
  $(".preview_zone .page .npage").text(current_page);
  $(".preview_zone .page .totalpage").text(count);
}


function generate_book_command(new_state)
{
  $("#result_frame").hide();
  $(".give .content").text("");

  $('#book').val(clean_CKEditor_input(CKEDITOR.instances.book.getData()));

  $.ajax({
    url: "ajax/book-generator.php",
    method: "POST",
    dataType: "json",
    data: $('#form_book').serialize()
  }).done(function(ret)
  {
    last_command = ret;

    $('#but_show_old_version').show();
    $("#result_frame").show();

    $(version_list).each(function()
    {
      $("#command_give_" + this).html(ret["give_" + this].replace(/  /g, ' \u00a0'));
    });

    $("#section_command_book_quill").show();
    var escaped = $('<div>').text(ret.write.replace(/  /g, ' \u00a0')).text(); // escape html
    $("#command_book_quill").html(escaped.replace(/\n/g, "<br>"));

    $(".save").show();

    var gen_book = clean_CKEditor_input(CKEDITOR.instances.book.getData());
    var gen_title = $('#title').val();
    var gen_author = $('#author').val();

    if (new_state)
      $('html, body').animate({ scrollTop: $("#section_command_give").offset().top });
  });
}
