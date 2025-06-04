/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

(function()
{
  CKEDITOR.plugins.add('scoreboard',
  {
    requires: 'dialog',
    lang: 'en,fr',
    icons: 'scoreboard,unscoreboard',

    init: function(editor)
    {
      // Ajout des commandes
      editor.addCommand('scoreboard', new CKEDITOR.dialogCommand('scoreboard',
      {
        refresh: function(editor, path)
        {
          // Despite our initial hope, document.queryCommandEnabled() does not work
          // for this in Firefox. So we must detect the state by element paths.

          var element = path.lastElement && path.lastElement.getAscendant('code', true);

          if (element == null)
            this.setState(CKEDITOR.TRISTATE_OFF);
          else if (element.getName() != 'code' || element.getAttribute('class') == "scoreboard")
            this.setState(CKEDITOR.TRISTATE_ON);
          else
            this.setState(CKEDITOR.TRISTATE_DISABLED);
        },

        contextSensitive: 1,
        startDisabled: 1,
      }));
      editor.addCommand('unscoreboard', new CKEDITOR.unscoreboardCommand());

      // Ajout des raccourcis claviers
      //editor.setKeystroke(CKEDITOR.CTRL + 72 /*H*/, 'scoreboard');

      // Ajout des boutons
      if (editor.ui.addButton)
      {
        editor.ui.addButton('scoreboard',
        {
          label: editor.lang.scoreboard.scoreboardButton,
          command: 'scoreboard',
          toolbar: 'scoreboard,10'
        });
        editor.ui.addButton('unscoreboard',
        {
          label: editor.lang.scoreboard.unscoreboardButton,
          command: 'unscoreboard',
          toolbar: 'scoreboard,20'
        });
      }

      // Ajout des fenetres de config
      CKEDITOR.dialog.add('scoreboard', this.path + 'dialogs/scoreboard.js' );

      // En cas de double click: ouvrir l'édition du lien
      editor.on('doubleclick', function(evt)
      {
        // selection du lien
        var element = CKEDITOR.plugins.scoreboard.getSelectedScoreboard(editor) || evt.data.element;

        if (!element.isReadOnly())
        {
          if (element.is('code') && element.getAttribute('class') == 'scoreboard')
          {
            evt.data.dialog = 'scoreboard';

            // Pass the link to be selected along with event data.
            evt.data.scoreboard = element;
          }
        }
      }, null, null, 0 );

      // If event was cancelled, link passed in event data will not be selected.
      editor.on('doubleclick', function( evt )
      {
        if (evt.data.dialog in {scoreboard: 1} && evt.data.scoreboard)
          editor.getSelection().selectElement(evt.data.scoreboard);
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
  CKEDITOR.plugins.scoreboard =
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
    getSelectedScoreboard: function(editor)
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
    parseScoreboardAttributes: function(editor, element)
    {
      var value = (element && element.data('value')) || '';
      var type = (element && (element.getAttribute('class'))) || '';
      var retval = {};

      if (!type || type != 'scoreboard')
      {
        // si aucune selection, ou pas de lien
        return retval;
      }

      var player = (element && element.data('player')) || '';
      var objective = (element && element.data('objective')) || '';
      retval =
      {
        player: player,
        objective: objective,
        scoreboard: player + ":" + objective,
      };

      return retval;
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
    getScoreboardAttributes: function(editor, data)
    {
      var set = {};
      var value = '';

      set['data-player'] = (CKEDITOR.tools.trim(data.player)) || '';
      set['data-objective'] = (CKEDITOR.tools.trim(data.objective)) || '';
      set['data-scoreboard'] = set['data-player'] + '§§' + set['data-objective'];

      set['class'] = 'scoreboard';

      var removed = {
        'data-player': 1,
        'data-objective': 1,
        'data-scoreboard': 1,
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
  CKEDITOR.unscoreboardCommand = function() {};
  CKEDITOR.unscoreboardCommand.prototype =
  {
    exec: function(editor)
    {
      var plugin = CKEDITOR.plugins.scoreboard;
      var element;

      if (element = plugin.getSelectedScoreboard(editor))
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

      if (element && element.getName() == 'code' && element.getAttribute('class') == "scoreboard")
        this.setState(CKEDITOR.TRISTATE_OFF);
      else
        this.setState(CKEDITOR.TRISTATE_DISABLED);
    },

    contextSensitive: 1,
    startDisabled: 1,
    //requiredContent: 'ins[class]'
  };

})();
