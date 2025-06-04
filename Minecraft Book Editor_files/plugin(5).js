CKEDITOR.plugins.add('selector',
{
  icons: 'selector',
  lang: 'en,fr',
  init: function( editor )
  {

    // All buttons use the same code to register. So, to avoid
    // duplications, let's use this tool function.
    var addButtonCommand = function( buttonName, buttonLabel, commandName, styleDefiniton )
    {
      // Disable the command if no definition is configured.
      if ( !styleDefiniton )
      	return;

      var style = new CKEDITOR.style(styleDefiniton),
      	forms = contentForms[commandName];

      // Put the style as the most important form.
      forms.unshift(style);

      // Listen to contextual style activation.
      editor.attachStyleStateChange(style, function(state)
      {
      	!editor.readOnly && editor.getCommand(commandName).setState(state);
      } );

      // Create the command that can be used to apply the style.
      editor.addCommand(commandName, new CKEDITOR.styleCommand(style,
      {
      	contentForms: forms,

        //allowedContent: allowed,
        //requiredContent: required,
        refresh: function(editor, path)
        {
          // Despite our initial hope, document.queryCommandEnabled() does not work
          // for this in Firefox. So we must detect the state by element paths.

          var element = path.lastElement && path.lastElement.getAscendant('code', true);

          var new_state = null;
          if (element != null && element.getName() == 'code')
          {
            if (element.getAttribute('class') == "selector")
              new_state = CKEDITOR.TRISTATE_ON; // bouton enfoncé
            else
              new_state = CKEDITOR.TRISTATE_DISABLED; // bouton desactivé
          }
          else
          {
            new_state = CKEDITOR.TRISTATE_OFF; // bouton relaché
          }

          var but = this;
          var tempo = setInterval(function()
          {
            but.setState(new_state);
            clearInterval(tempo);
          }, 10);
          this.setState(new_state);

        },

        contextSensitive: 1,
        startDisabled: 1,
      } ) );

      // Register the button, if the button plugin is loaded.
      if (editor.ui.addButton)
      {
      	editor.ui.addButton(buttonName, {
      		label: buttonLabel,
      		command: commandName,
      		toolbar: 'selectors,10'
      	} );
      }
    };

    var contentForms =
    {
      selector:
      [
//        'code'
        [
          'code',
          function(el)
          {
            var fw = el.classes;
            return (fw.length == 1 && fw[0] == 'selector');
          }
        ]
      ],
    },
    config = editor.config,
    lang = editor.lang.selector;

    addButtonCommand('selector', lang.selector, 'selector', config.coreStyles_selector);
	}
});

// Basic Inline Styles.

/**
 * The style definition that applies the **bold** style to the text.
 *
 *		config.coreStyles_bold = { element: 'b', overrides: 'strong' };
 *
 *		config.coreStyles_bold = {
 *			element: 'span',
 *			attributes: { 'class': 'Bold' }
 *		};
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.coreStyles_selector =
{
	element: 'code',
	attributes: { 'class': 'selector' }
};
