/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

(function()
{
  CKEDITOR.plugins.add('mclink',
  {
    requires: 'dialog',
    //lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn',
    lang: 'en,fr',
    icons: 'mclink,mcunlink',

    // onLoad: function()
    // {
    //   // Add the CSS styles for anchor placeholders.
    //   // [...]
    // },

    init: function(editor)
    {
      var allowed = 'a[!href]';
      var required = 'a[href]';

      // Ajout des onglets autorisé
      // if (CKEDITOR.dialog.isTabEnabled(editor, 'mclink', 'advanced'))
      //   allowed = allowed.replace( ']', ',accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)' );
      // if (CKEDITOR.dialog.isTabEnabled( editor, 'mclink', 'target'))
      //   allowed = allowed.replace( ']', ',target,onclick]' );

      // Ajout des commandes
      editor.addCommand('mclink', new CKEDITOR.dialogCommand('mclink',
      {
        refresh: function(editor, path)
        {
          // Despite our initial hope, document.queryCommandEnabled() does not work
          // for this in Firefox. So we must detect the state by element paths.

          var element = path.lastElement;
          var element_a = element && element.getAscendant('a', true);

          if (element_a && element.getName() == 'a' && element.getAttribute('href') && element.getChildCount())
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
      editor.addCommand('mcunlink', new CKEDITOR.mcunlinkCommand());

      // Ajout des raccourcis claviers
      editor.setKeystroke(CKEDITOR.CTRL + 76 /*L*/, 'mclink');

      // Ajout des boutons
      if (editor.ui.addButton)
      {
        editor.ui.addButton('mclink',
        {
          label: editor.lang.mclink.mclinkButton,
          command: 'mclink',
          toolbar: 'links,10'
        });
        editor.ui.addButton('mcunlink',
        {
          label: editor.lang.mclink.mcunlinkButton,
          command: 'mcunlink',
          toolbar: 'links,20'
        });
      }

      // Ajout des fenetres de config
      CKEDITOR.dialog.add('mclink', this.path + 'dialogs/link.js' );

      // En cas de double click: ouvrir l'édition du lien
      editor.on('doubleclick', function(evt)
      {
        // selection du lien
        var element = CKEDITOR.plugins.mclink.getSelectedLink(editor) || evt.data.element;

        if (!element.isReadOnly())
        {
          if (element.is('a'))
          {
            evt.data.dialog = 'mclink';

            // Pass the link to be selected along with event data.
            evt.data.link = element;
          }
        }
      }, null, null, 0 );

      // If event was cancelled, link passed in event data will not be selected.
      editor.on('doubleclick', function( evt )
      {
        // Make sure both links and anchors are selected (#11822).
        if (evt.data.dialog in {mclink: 1, anchor: 1} && evt.data.link)
          editor.getSelection().selectElement(evt.data.link);
      }, null, null, 20 );

    },

    // afterInit: function(editor)
    // {

    // }
  });

  // Loads the parameters in a selected link to the link dialog fields.
  var advAttrNames = {
    id: 'advId',
    dir: 'advLangDir',
    accessKey: 'advAccessKey',
    name: 'advName',
    lang: 'advLangCode',
    tabindex: 'advTabIndex',
    title: 'advTitle',
    type: 'advContentType',
    'class': 'advCSSClasses',
    charset: 'advCharset',
    style: 'advStyles',
    rel: 'advRel'
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
  CKEDITOR.plugins.mclink =
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
    getSelectedLink: function(editor)
    {
      var selection = editor.getSelection();
      var selectedElement = selection.getSelectedElement();
      if (selectedElement && selectedElement.is('a'))
        return selectedElement;

      var range = selection.getRanges()[0];

      if (range)
      {
        range.shrink(CKEDITOR.SHRINK_TEXT);
        return editor.elementPath(range.getCommonAncestor()).contains('a', 1);
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
    parseLinkAttributes: function(editor, element)
    {
      var value = (element && (element.data('value') || element.getAttribute('href'))) || '';
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
        case 'openurl':
          retval.url = { url: value };
          break;
        case 'suggestcommand':
        case 'runcommand':
          retval.command = { text: value };
          break;
        case "insert":
          retval.insert = { text: value };
          break;
        case "copyclipboard":
          retval.copyclipboard = { text: value };
          break;
        case "changepage":
          retval.changepage = { page: value };
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
    getLinkAttributes: function(editor, data)
    {
      var set = {};
      var value = '';

      // Compose the URL.
      switch (data.type)
      { //  'openurl', 'suggestcommand', 'runcommand', 'insert', 'changepage'
        case 'openurl':
          value = (data.url && CKEDITOR.tools.trim(data.url.url)) || '';
          break;
        case 'suggestcommand':
        case 'runcommand':
          value = (data.command && CKEDITOR.tools.trim(data.command.text)) || '';
          break;
        case 'insert':
          value = (data.insert && CKEDITOR.tools.trim(data.insert.text)) || '';
          break;
        case 'copyclipboard':
          value = (data.copyclipboard && CKEDITOR.tools.trim(data.copyclipboard.text)) || '';
          break;
        case "changepage":
          value = (data.changepage && data.changepage.page) || '';
          break;
      }

      set['data-' + data.type] = value;
      set['class'] = data.type;
      set['href'] = value;

      var removed = {
        target: 1,
        onclick: 1,
        'data-openurl': 1,
        'data-suggestcommand': 1,
        'data-runcommand': 1,
        'data-insert': 1,
        'data-copyclipboard': 1,
        'data-changepage': 1,
      };

      if (data.advanced)
        CKEDITOR.tools.extend(removed, advAttrNames);

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
  CKEDITOR.mcunlinkCommand = function() {};
  CKEDITOR.mcunlinkCommand.prototype =
  {
    exec: function(editor)
    {
      // http://docs.ckeditor.com/#!/api/CKEDITOR.style-property-alwaysRemoveElement
      // http://docs.ckeditor.com/#!/guide/dev_styles ==> Style Rules
      var style = new CKEDITOR.style({element: 'a', type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1});
      editor.removeStyle(style);
    },

    refresh: function(editor, path)
    {
      // Despite our initial hope, document.queryCommandEnabled() does not work
      // for this in Firefox. So we must detect the state by element paths.

      var element = path.lastElement && path.lastElement.getAscendant('a', true);

      if (element && element.getName() == 'a' && element.getAttribute('href') && element.getChildCount())
        this.setState(CKEDITOR.TRISTATE_OFF);
      else
        this.setState(CKEDITOR.TRISTATE_DISABLED);
    },

    contextSensitive: 1,
    startDisabled: 1,
    requiredContent: 'a[href]'
  };

})();
