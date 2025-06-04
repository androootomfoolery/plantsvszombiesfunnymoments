/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.plugins.add('keybind',
{
  requires: 'dialog',
  lang: 'en,fr',
  icons: 'keybind,unkeybind',

  init: function(editor)
  {
    // Ajout des commandes
    editor.addCommand('keybind', new CKEDITOR.dialogCommand('keybind',
    {
      refresh: function(editor, path)
      {
        // Despite our initial hope, document.queryCommandEnabled() does not work
        // for this in Firefox. So we must detect the state by element paths.

        var element = path.lastElement && path.lastElement.getAscendant('code', true);

        if (element == null)
          this.setState(CKEDITOR.TRISTATE_OFF);
        else if (element.getName() != 'code' || element.getAttribute('class') == "keybind")
          this.setState(CKEDITOR.TRISTATE_ON);
        else
          this.setState(CKEDITOR.TRISTATE_DISABLED);
      },

      contextSensitive: 1,
      startDisabled: 1,
    }));
    editor.addCommand('unkeybind', new CKEDITOR.unkeybindCommand());

    // Ajout des raccourcis claviers
    //editor.setKeystroke(CKEDITOR.CTRL + 72 /*H*/, 'scoreboard');

    // Ajout des boutons
    if (editor.ui.addButton)
    {
      editor.ui.addButton('keybind',
      {
        label: editor.lang.keybind.keybindButton,
        command: 'keybind',
        toolbar: 'keybind,10'
      });
      editor.ui.addButton('unkeybind',
      {
        label: editor.lang.keybind.unkeybindButton,
        command: 'unkeybind',
        toolbar: 'keybind,10'
      });
    }

    // Ajout des fenetres de config
    CKEDITOR.dialog.add('keybind', this.path + 'dialogs/keybind.js' );

    // En cas de double click: ouvrir l'édition du lien
    editor.on('doubleclick', function(evt)
    {
      // selection du lien
      var element = CKEDITOR.plugins.keybind.getSelectedKeybind(editor) || evt.data.element;

      if (!element.isReadOnly())
      {
        if (element.is('code') && element.getAttribute('class') == 'keybind')
        {
          evt.data.dialog = 'keybind';

          // Pass the link to be selected along with event data.
          evt.data.keybind = element;
        }
      }
    }, null, null, 0 );

    // If event was cancelled, link passed in event data will not be selected.
    editor.on('doubleclick', function( evt )
    {
      if (evt.data.dialog in {keybind: 1} && evt.data.keybind)
        editor.getSelection().selectElement(evt.data.keybind);
    }, null, null, 20 );

  },
});

// Loads the parameters in a selected link to the link dialog fields.
var advAttrNames = {
  'class': 'advCSSClasses',
};

function unescapeSingleQuote(str)
{
  return str.replace(/\\'/g, '\'');
}

function escapeSingleQuote(str)
{
  return str.replace(/'/g, '\\$&');
}


/**
 * Set of Link plugin helpers.
 *
 * @class
 * @singleton
 */
CKEDITOR.plugins.keybind =
{
  /**
   * Get the surrounding link element of the current selection.
   *
   *    CKEDITOR.plugins.link.getSelectedLink( editor );
   *
   *    // The following selections will all return the link element.
   *
   *    <a href="#">li^nk</a>
   *    <a href="#">[link]</a>
   *    text[<a href="#">link]</a>
   *    <a href="#">li[nk</a>]
   *    [<b><a href="#">li]nk</a></b>]
   *    [<a href="#"><b>li]nk</b></a>
   *
   * @since 3.2.1
   * @param {CKEDITOR.editor} editor
   */
  getSelectedKeybind: function(editor)
  {
    var selection = editor.getSelection();
    var selectedElement = selection.getSelectedElement();
    if (selectedElement && selectedElement.is('code'))
      return selectedElement;

    var range = selection.getRanges()[0];

    if (range)
    {
      range.shrink(CKEDITOR.SHRINK_TEXT);
      return editor.elementPath(range.getCommonAncestor()).contains('code', 1);
    }
    return null;
  },

  /**
   * Parses attributes of the link element and returns an object representing
   * the current state (data) of the link. This data format is accepted e.g. by
   * the Link dialog window and {@link #getLinkAttributes}.
   *
   * @since 4.4
   * @param {CKEDITOR.editor} editor
   * @param {CKEDITOR.dom.element} element
   * @returns {Object} An object of link data.
   */
  parseKeybindAttributes: function(editor, element)
  {
    var value = (element && element.data('value')) || '';
    var type = (element && (element.getAttribute('class'))) || '';

    if (!type || type != 'keybind')
    {
      // si aucune selection, ou pas de lien
      return null;
    }

    return (element && element.data('keycode')) || '';
  },

  /**
   * Converts link data into an object which consists of attributes to be set
   * (with their values) and an array of attributes to be removed. This method
   * can be used to synthesise or to update any link element with the given data.
   *
   * @since 4.4
   * @param {CKEDITOR.editor} editor
   * @param {Object} data Data in {@link #parseLinkAttributes} format.
   * @returns {Object} An object consisting of two keys, i.e.:
   *
   *    {
   *      // Attributes to be set.
   *      set: {
   *        href: 'http://foo.bar',
   *        target: 'bang'
   *      },
   *      // Attributes to be removed.
   *      removed: [
   *        'id', 'style'
   *      ]
   *    }
   *
   */
  getKeybindAttributes: function(editor, data)
  {
    var set = {};
    var value = '';

    set['data-keycode'] = (CKEDITOR.tools.trim(data)) || '';

    set['class'] = 'keybind';

    var removed = {
      'data-keycode': 1,
    };

    // Remove all attributes which are currently set.
    for (var s in set)
      delete removed[s];

    return {
      set: set,
      removed: CKEDITOR.tools.objectKeys(removed),
    };
  }
};


// TODO Much probably there's no need to expose these as public objects.
CKEDITOR.unkeybindCommand = function() {};
CKEDITOR.unkeybindCommand.prototype =
{
  exec: function(editor)
  {
    var plugin = CKEDITOR.plugins.keybind;
    var element;

    if (element = plugin.getSelectedKeybind(editor))
      element.remove();

    // http://docs.ckeditor.com/#!/api/CKEDITOR.style-property-alwaysRemoveElement
    // http://docs.ckeditor.com/#!/guide/dev_styles ==> Style Rules
    var style = new CKEDITOR.style({element: 'code', type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1});
    editor.removeStyle(style);
  },

  refresh: function(editor, path)
  {
    // Despite our initial hope, document.queryCommandEnabled() does not work
    // for this in Firefox. So we must detect the state by element paths.

    var element = path.lastElement && path.lastElement.getAscendant('code', true);

    if (element && element.getName() == 'code' && element.getAttribute('class') == "keybind")
      this.setState(CKEDITOR.TRISTATE_OFF);
    else
      this.setState(CKEDITOR.TRISTATE_DISABLED);
  },

  contextSensitive: 1,
  startDisabled: 1,
  //requiredContent: 'ins[class]'
};

