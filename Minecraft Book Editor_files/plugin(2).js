CKEDITOR.plugins.add('obfuscated',
{
  icons: 'obfuscated',
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

    var style = new CKEDITOR.style( styleDefiniton ),
      forms = contentForms[ commandName ];

    // Put the style as the most important form.
    forms.unshift( style );

    // Listen to contextual style activation.
    editor.attachStyleStateChange( style, function( state ) {
      !editor.readOnly && editor.getCommand( commandName ).setState( state );
    } );

    // Create the command that can be used to apply the style.
    editor.addCommand( commandName, new CKEDITOR.styleCommand( style, {
      contentForms: forms
    } ) );

    // Register the button, if the button plugin is loaded.
    if ( editor.ui.addButton ) {
      editor.ui.addButton( buttonName, {
        label: buttonLabel,
        command: commandName,
        toolbar: 'basicstyles,100'
      } );
    }
  };

  var contentForms =
  {
    obfuscated:
    [
      [
        'span',
        function(el)
        {
          var fw = el.classes;
          return (fw.length == 1 && fw[0] == 'obfuscated');
        }
      ]
    ],
  },
  config = editor.config,
  lang = editor.lang.obfuscated;

  addButtonCommand( 'obfuscated', lang.obfuscated, 'obfuscated', config.coreStyles_obfuscated);
  }
});

// Basic Inline Styles.

/**
 * The style definition that applies the **bold** style to the text.
 *
 *    config.coreStyles_bold = { element: 'b', overrides: 'strong' };
 *
 *    config.coreStyles_bold = {
 *      element: 'span',
 *      attributes: { 'class': 'Bold' }
 *    };
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.coreStyles_obfuscated =
{
  element: 'span',
  attributes: { 'class': 'obfuscated' }
};
