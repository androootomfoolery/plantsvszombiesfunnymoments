/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

(function()
{
  CKEDITOR.plugins.add('mchover',
  {
    requires: 'dialog',
    lang: 'en,fr',
    icons: 'mchover,mcunhover',

    // onLoad: function()
    // {
    //   // Add the CSS styles for anchor placeholders.
    //   // [...]
    // },

    init: function(editor)
    {
      var allowed = 'ins[!class]';
      var required = 'ins[class]';

      // Ajout des onglets autorisé
      // if (CKEDITOR.dialog.isTabEnabled(editor, 'mclink', 'advanced'))
      //   allowed = allowed.replace( ']', ',accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)' );
      // if (CKEDITOR.dialog.isTabEnabled( editor, 'mclink', 'target'))
      //   allowed = allowed.replace( ']', ',target,onclick]' );

      // Ajout des commandes
      editor.addCommand('mchover', new CKEDITOR.dialogCommand('mchover',
      {
        refresh: function(editor, path)
        {
          // Despite our initial hope, document.queryCommandEnabled() does not work
          // for this in Firefox. So we must detect the state by element paths.

          var element = path.lastElement;
          var element_a = element && element.getAscendant('ins', true);

          if (element_a && element.getName() == 'ins' && element.getChildCount())
            this.setState(CKEDITOR.TRISTATE_ON);
          else if (element)
            this.setState(CKEDITOR.TRISTATE_OFF);
          else
            this.setState(CKEDITOR.TRISTATE_DISABLED);
        },

        contextSensitive: 1,
        startDisabled: 1,
        // allowedContent: allowed,
        // requiredContent: required,
      }));
      editor.addCommand('mcunhover', new CKEDITOR.mcunhoverCommand());

      // Ajout des raccourcis claviers
      editor.setKeystroke(CKEDITOR.CTRL + 72 /*H*/, 'mchover');

      // Ajout des boutons
      if (editor.ui.addButton)
      {
        editor.ui.addButton('mchover',
        {
          label: editor.lang.mchover.mchoverlinkButton,
          command: 'mchover',
          toolbar: 'hovers,10'
        });
        editor.ui.addButton('mcunhover',
        {
          label: editor.lang.mchover.mcunhoverlinkButton,
          command: 'mcunhover',
          toolbar: 'hovers,20'
        });
      }

      // Ajout des fenetres de config
      CKEDITOR.dialog.add('mchover', this.path + 'dialogs/hover.js' );

      // En cas de double click: ouvrir l'édition du lien
      editor.on('doubleclick', function(evt)
      {
        // selection du lien
        var element = CKEDITOR.plugins.mchover.getSelectedHover(editor) || evt.data.element;

        if (!element.isReadOnly())
        {
          if (element.is('ins'))
          {
            evt.data.dialog = 'mchover';

            // Pass the link to be selected along with event data.
            evt.data.hover = element;
          }
        }
      }, null, null, 0 );

      // If event was cancelled, link passed in event data will not be selected.
      editor.on('doubleclick', function( evt )
      {
        // Make sure both links and anchors are selected (#11822).
        if (evt.data.dialog in {mchover: 1} && evt.data.hover)
          editor.getSelection().selectElement(evt.data.hover);
      }, null, null, 20 );

    },

    // afterInit: function(editor)
    // {

    // }
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
  CKEDITOR.plugins.mchover =
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
    getSelectedHover: function(editor)
    {
      var selection = editor.getSelection();
      var selectedElement = selection.getSelectedElement();
      if (selectedElement && selectedElement.is('ins'))
        return selectedElement;

      var range = selection.getRanges()[0];

      if (range)
      {
        range.shrink(CKEDITOR.SHRINK_TEXT);
        return editor.elementPath(range.getCommonAncestor()).contains('ins', 1);
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
    parseHoverAttributes: function(editor, element)
    {
      var value = (element && element.data('value')) || '';
      var type = (element && (element.getAttribute('class'))) || '';
      var retval = {};

      if (!type)
      {
        // si aucune selection, ou pas de lien
        return retval;
      }

      retval.type = type;
      switch (type)
      {
        case "text":
          retval.text = (element && element.data(type)) || '';
          break;
        case "item":
          retval.item = (element && element.data(type)) || '';
          break;
        case "achievement":
          retval.achievement = (element && element.data(type)) || '';
          break;
        case "statistic":
          retval.statistic = (element && element.data(type)) || '';
          break;
        case 'entity':
          var eType = (element && element.data('etype')) || '';
          var eName = (element && element.data('ename')) || '';
          var eId = (element && element.data('eid')) || '';
          retval.entity =
          {
            type: eType,
            name: eName,
            id: eId,
          };
          break;
      }

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
    getHoverAttributes: function(editor, data)
    {
      var set = {};
      var value = '';

      // Compose the URL.
      switch (data.type)
      {
        case "text":
          value = (CKEDITOR.tools.trim(data.text)) || '';
          set['data-text'] = value;
          break;
        case "item":
          value = (CKEDITOR.tools.trim(data.item)) || '';
          set['data-item'] = value;
          break;
        case "achievement":
          value = (CKEDITOR.tools.trim(data.achievement)) || '';
          set['data-achievement'] = value;
          break;
        case "statistic":
          value = (CKEDITOR.tools.trim(data.statistic)) || '';
          set['data-statistic'] = value;
          break;
        case 'entity':
          set['data-etype'] = (data.entity && CKEDITOR.tools.trim(data.entity.type)) || '';
          set['data-ename'] = (data.entity && CKEDITOR.tools.trim(data.entity.name)) || '';
          set['data-eid'] = (data.entity && CKEDITOR.tools.trim(data.entity.id)) || '';
          set['data-entity'] = set['data-etype'] + '§§' + set['data-ename'] + '§§' + set['data-eid'];
          break;
      }

      set['class'] = data.type;

      var removed = {
        'data-text': 1,
        'data-item': 1,
        'data-achievement': 1,
        'data-statistic': 1,
        'data-etype': 1,
        'data-ename': 1,
        'data-eid': 1,
        'data-entity': 1,
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
  CKEDITOR.mcunhoverCommand = function() {};
  CKEDITOR.mcunhoverCommand.prototype =
  {
    exec: function(editor)
    {
      // http://docs.ckeditor.com/#!/api/CKEDITOR.style-property-alwaysRemoveElement
      // http://docs.ckeditor.com/#!/guide/dev_styles ==> Style Rules
      var style = new CKEDITOR.style({element: 'ins', type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1});
      editor.removeStyle(style);
    },

    refresh: function(editor, path)
    {
      // Despite our initial hope, document.queryCommandEnabled() does not work
      // for this in Firefox. So we must detect the state by element paths.

      var element = path.lastElement && path.lastElement.getAscendant('ins', true);

      if (element && element.getName() == 'ins' && element.getChildCount())
        this.setState(CKEDITOR.TRISTATE_OFF);
      else
        this.setState(CKEDITOR.TRISTATE_DISABLED);
    },

    contextSensitive: 1,
    startDisabled: 1,
    //requiredContent: 'ins[class]'
  };

})();
