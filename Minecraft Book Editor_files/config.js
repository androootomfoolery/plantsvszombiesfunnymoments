/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

var CKEDITOR_PLUGINS = 'colorbutton,colordialog,obfuscated,mclink,mchover,selector,scoreboard,specialchar,keybind'; //,removeformat

var minecraftfont = 
  "@font-face {\n" +
  "  font-family: 'minecraftiaregular';\n" +
  "  src: url('css/font/minecraftia/minecraftia-webfont.eot');\n" +
  "  src: url('css/font/minecraftia/minecraftia-webfont.eot?#iefix') format('embedded-opentype'),\n" +
  "       url('css/font/minecraftia/minecraftia-webfont.woff') format('woff'),\n" +
  "       url('css/font/minecraftia/minecraftia-webfont.ttf') format('truetype'),\n" + 
  "       url('css/font/minecraftia/minecraftia-webfont.svg#minecraftiaregular') format('svg');\n" + 
  "  font-weight: normal;\n" +
  "  font-style: normal;\n" +
  "}\n" +
  "\n" +
  "@font-face {\n" +
  "    font-family: 'Code2000';\n" +
  "    src: url('css/font/code2000/Code2000.woff') format('woff'),\n" +
  "         url('css/font/code2000/Code2000.ttf') format('truetype'),\n" +
  "         url('css/font/code2000/Code2000.svg') format('svg');\n" +
  "    font-weight: normal;\n" +
  "    font-style: normal;\n" +
  "}\n";

CKEDITOR.addCss(minecraftfont);

CKEDITOR.editorConfig = function( config )
{
  // Define changes to default configuration here.
  // For complete reference see:
  // http://docs.ckeditor.com/#!/api/CKEDITOR.config
  config.extraPlugins = CKEDITOR_PLUGINS;

  config.autoParagraph = false; // supprimer les "<p>" et "<br/>"
  config.ignoreEmptyParagraph = true;
  config.enterMode = CKEDITOR.ENTER_BR;
  config.shiftEnterMode = CKEDITOR.ENTER_BR;

  //config.allowedContent = true; // désactive le filtre ACF
  config.extraAllowedContent = 'a(*){*}[*];ins(*){*}[*];code(*){*}[*]';
  config.disallowedContent = 'img font div p ul li ol iframe script noscript';
  config.removeFormatTags = 'div,font,p,ul,li,ol,img,iframe,script,noscript,big,del,dfn,kbd';

  // The toolbar groups arrangement, optimized for a single toolbar row.
  config.toolbarGroups = [
    //{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
    { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
    //{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup', 'obfuscated' ] },
    { name: 'insert' }, /* specialchar */
    { name: 'colors' },

/* TEMPS: */
        // { name: 'tools' },
        // { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
        // { name: 'others' },

    { name: 'mouse_events', groups: [ 'links', 'hovers' ] },
    { name: 'dynamictext', groups: [ 'selectors', 'scoreboard', 'keybind' ] },
    { name: 'removeformat' },
  ];

  config.height = '100px';
  config.uiColor = '#eeeeee';
  //config.uiColor = '#44AA44';

  config.colorButton_enableMore = true;

  // The default plugins included in the basic setup define some buttons that
  // are not needed in a basic editor. They are removed here.
  config.removeButtons = 'Font,BGColor,Cut,Copy,Paste,Subscript,Superscript,Anchor,Link,Unlink'; //Undo,Redo

  // Dialog windows are also simplified.
  //config.removeDialogTabs = 'link:advanced';


  // Font compatible avec Unicode : http://www.alanwood.net/unicode/fontsbyrange.html#u11100
  config.specialChars = 
  [
    //[ '&gt;', 'Custom label' ], // cf lang.js pour les trads
    '&para;', '&times;', '&Oslash;', '&THORN;', '&divide;', '&oslash;', '&thorn;',
    '&hellip;', '&trade;', '&#9658;', '&bull;', '&diams;', '&asymp;',

    '&#10075;', /* ❛ */
    '&#8728;', /* ∘ rond */
    '&#8729;', /* ∙ */
    '&#10047;', /* ✿ */
    '&#9864;', /* ⚈ */
    '&#8710;', /* ∆ */
    '&#8711;', /* ∇ */
    '&#8801;', /* ≡ */
    '&#8803;', /* ≣ */
    '&#8810;', /* ≣ << */
    '&#8811;', /* ≫ >> */
    '&#8920;', /* ⋘ <<< */
    '&#8921;', /* ⋙ >>> */
    '&#8225;', /* ‡ */
    '&#8362;', /* ₪ */
    '&#1769;', /* ۩ */
    '&#1758;', /* ۞ */
    '&#8983;', /* ⌗ # */
    '&#8984;', /* ⌘ */
    '&#8709;', /* ∅ empty set */
    '&#8719;', /* ∏ */
    '&#8721;', /* ∑ */
    '&#8730;', /* √ */
    '&#8734;', /* ∞ */
    '&#12336;', /* 〰 */
    '&#12349;', /* 〽 */
    '&#9585;', /* ╱ / */
    '&#9586;', /* ╲ \ */
    '&#9587;', /* ╳ X */
    '&#5941;', /* ╳ / */
    '&#5942;', /* ╳ // */
    '&#5771;', /* ᚋ */
    '&#5772;', /* ᚌ */
    '&#5773;', /* ᚍ */
    '&#5774;', /* ᚎ */
    '&#5775;', /* ᚏ */
    '&#8847;', /* ⊏ square */
    '&#8848;', /* ⊐ square */
    '&#8851;', /* ⊐ square */
    '&#8852;', /* ⊐ square */
    '&#8853;', /* ⊕ circled plus */
    '&#8854;', /* ⊖ circled minus */
    '&#8855;', /* ⊗ circled times */
    '&#8856;', /* ⊘ circled division slash */
    '&#8857;', /* ⊙ circled dot */
    '&#8862;', /* ⊞ square plus */
    '&#8863;', /* ⊟ square minus */
    '&#8864;', /* ⊠ square times */
    '&#8865;', /* ⊡ square dot */

    '&#9581;', /* ╭ round corner */
    '&#9582;', /* ╮ round corner */
    '&#9584;', /* ╰ round corner */
    '&#9583;', /* ╯ round corner */

    /* src: http://smiley.cool/fr/emoji-list.php */

    /* Flèches */
    '&#8592;', /* ← */
    '&#8593;', /* ↑ */
    '&#8594;', /* → */
    '&#8595;', /* ↓ */
    '&#8596;', /* ↔ */
    '&#8597;', /* ↕ */
    '&#8598;', /* ↖ diag 1 */
    '&#8599;', /* ↗ diag 2 */
    '&#8600;', /* ↘ diag 3 */
    '&#8601;', /* ↙ diag 4 */
    '&#8617;', /* ↩ ret 1 */
    '&#8618;', /* ↪ ret 2 */
    '&#9654;', /* ▶ */
    '&#9664;', /* ◀ */
    '&#10548;', /* ⤴ */
    '&#10549;', /* ⤵ */
    '&#8656;', /* ⇐ left */
    '&#8657;', /* ⇑ up */
    '&#8658;', /* ⇒ right */
    '&#8659;', /* ⇓ down */
    '&#8660;', /* ⇔ horizotal */
    '&#8661;', /* ⇕ vertical */

    '&#8678;', /* ⇦ left */
    '&#8679;', /* ⇧ up */
    '&#8680;', /* ⇨ right */
    '&#8681;', /* ⇩ down */

    '&#10145;', /* ➡ */
    '&#11013;', /* ⬅ */
    '&#11014;', /* ⬆ */
    '&#11015;', /* ⬇ */

    '&#9754;', /* ☚ */
    '&#9755;', /* ☛ */
    '&#9756;', /* ☜ */
    '&#9757;', /* ☝ */
    '&#9758;', /* ☞ */
    '&#9759;', /* ☟ */


    /* Forme */
    '&#8718;', /* ∎ carré */
    '&#9601;', /* ▁ carré 1 */
    '&#9602;', /* ▂ carré 2 */
    '&#9603;', /* ▃ carré 3 */
    '&#9604;', /* ▄ carré 4 */
    '&#9605;', /* ▅ carré 5 */
    '&#9606;', /* ▆ carré 6 */
    '&#9607;', /* ▇ carré 7 */
    '&#9608;', /* █ carré 8 */
    '&#9609;', /* ▉ carré 9 */
    '&#9610;', /* ▊ carré 10 */
    '&#9611;', /* ▋ carré 11 */
    '&#9612;', /* ▌ carré 12 */
    '&#9613;', /* ▍ carré 13 */
    '&#9614;', /* ▎ carré 14 */
    '&#9615;', /* ▏ carré 15 */
    '&#9616;', /* ▐ carré 16 */
    '&#9617;', /* ░ dithering */
    '&#9618;', /* ▒ dithering */
    '&#9619;', /* ▓ dithering */
    '&#9626;', /* ▚ 2 carré */
    '&#9630;', /* ▞ 2 carré */
    '&#9632;', /* ■ */
    '&#9633;', /* □ */
    '&#9634;', /* ▢ carré */
    '&#9635;', /* ▣ carré */
    '&#9636;', /* ▤ carré */
    '&#9637;', /* ▥ carré */
    '&#9638;', /* ▦ carré */
    //'&#9642;', /* ▪ */
    //'&#9643;', /* ▫ */
    '&#9703;', /* ◧ */
    '&#9704;', /* ◨ */
    '&#9705;', /* ◩ */
    '&#9706;', /* ◪ */

    '&#9650;', /* ▲ */
    '&#9651;', /* △ */
    '&#9654;', /* ▶ > */
    '&#9655;', /* ▷ > */

    '&#9670;', /* ◆ */
    '&#9671;', /* ◇ */
    '&#9674;', /* ◊ */

    '&#9675;', /* ○ */
    '&#9676;', /* ◌ */
    '&#9679;', /* ● */
    '&#9680;', /* ◐ */
    '&#9681;', /* ◑ */
    '&#9682;', /* ◒ */
    '&#9683;', /* ◓ */
    '&#9684;', /* ◔ */
    '&#9685;', /* ◕ */
    '&#9698;', /* ◢ triangle */
    '&#9699;', /* ◣ triangle */
    '&#9700;', /* ◤ triangle */
    '&#9701;', /* ◥ triangle */


    '&#9733;', /* ★ */
    '&#9734;', /* ☆ */
    '&#11088;', /* ⭐ étoile */

    '&#9723;', /* ◻ */
    '&#9724;', /* ◼ */
    '&#9725;', /* ◽ */
    '&#9726;', /* ◾ */
    '&#9898;', /* ⚪ */
    '&#9899;', /* ⚫ */
    '&#10035;', /* ✳ */
    '&#10036;', /* ✴ */
    '&#10055;', /* ❇ */
    '&#4960;', /* ፠ */
    '&#4962;', /* ። */
    '&#4967;', /* ፧ */
    '&#4968;', /* ፨ */
    '&#8258;', /* ⁂ asterism  */
    '&#8273;', /* ⁑ two asterisks aligned vertically  */
    '&#8270;', /* ⁎ low asterisk  */
    '&#5121;', /* ᐁ */
    '&#5123;', /* ᐃ */
    '&#5125;', /* ᐅ */
    '&#5130;', /* ᐊ */
    '&#5196;', /* ᑌ */
    '&#5198;', /* ᑎ */
    '&#5200;', /* ᑐ */
    '&#5205;', /* ᑕ */
    '&#5283;', /* ᒣ */
    '&#5285;', /* ᒥ */
    '&#5287;', /* ᒧ */
    '&#5290;', /* ᒪ */

    /* ... ==> http://graphemica.com/%E2%AC%95 */
    '&#11030;', /* ⬖ diamond with left half black */
    '&#11031;', /* ⬗ diamond with right half black */
    '&#11032;', /* ⬘ diamond with top half black */
    '&#11033;', /* ⬙ diamond with bottom half black */
    '&#11034;', /* ⬚ dotted square */
    '&#11035;', /* ⬛ black large square */
    '&#11036;', /* ⬜ white large square */
    '&#11037;', /* ⬟ black very small square */
    '&#11038;', /* ⬞ white very small square */
    '&#11039;', /* ⬟ black pentagon */
    '&#11040;', /* ⬠ white pentagon */
    '&#11041;', /* ⬠ white hexagon */
    '&#11042;', /* ⬢ black hexagon */
    '&#11043;', /* ⬣ horizontal black hexagon */
    '&#11044;', /* ⬤ black large circle */
    '&#11045;', /* ⬥ black medium diamond */
    '&#11046;', /* ⬦ white medium diamond */
    '&#11047;', /* ⬧ black medium lozenge */
    '&#11048;', /* ⬨ white medium lozenge */
    /*... ==> http://graphemica.com/%E2%AC%A9 */

    /* ... ==> http://graphemica.com/unicode/characters/page/39 (caractère de dessin) */


    /* Tableau */
    '&#x2500;', /* ─ */
    '&#x2502;', /* ┃ */
    '&#x2505;', /* ┅ --- */
    '&#x2507;', /* ┅ | */
    '&#x250C;', /* ┌ */
    '&#x2510;', /* ┐ */
    '&#x2514;', /* └ */
    '&#x2518;', /* ┘ */
    '&#x251C;', /* ├ */
    '&#x2524;', /* ┤ */
    '&#x252C;', /* ┬ */
    '&#x2534;', /* ┴ */
    '&#x253C;', /* ┼ */

    '&#x2550;', /* ═ */
    '&#x2551;', /* ║ */
    '&#x2554;', /* ╔ */
    '&#x2557;', /* ╗ */
    '&#x255A;', /* ╚ */
    '&#x255D;', /* ╝ */
    '&#x2560;', /* ╠ */
    '&#x2563;', /* ╣ */
    '&#x2567;', /* ╦ */
    '&#x2569;', /* ╩ */
    '&#x256C;', /* ╬ */


    /* Round number */
    '&#9450;', /* ⓪ */
    '&#9312;', /* ① */
    '&#9313;', /* ② */
    '&#9314;', /* ③ */
    '&#9315;', /* ④ */
    '&#9316;', /* ⑤ */
    '&#9317;', /* ⑥ */
    '&#9318;', /* ⑦ */
    '&#9319;', /* ⑧ */
    '&#9320;', /* ⑨ */
    '&#9321;', /* ⑩ */
    '&#9322;', /* ⑪ */
    '&#9323;', /* ⑫ */
    '&#9324;', /* ⑬ */
    '&#9325;', /* ⑭ */
    '&#9326;', /* ⑮ */
    '&#9327;', /* ⑯ */
    '&#9328;', /* ⑰ */
    '&#9329;', /* ⑱ */
    '&#9330;', /* ⑲ */
    '&#9331;', /* ⑳ */
    // 21 -> 35 ==> http://graphemica.com/%E3%89%91
    // 36 -> 50 ==> http://graphemica.com/%E3%8A%B1
    '&#9471;', /* ⓿ */
    '&#10102;', /* ❶ */
    '&#10103;', /* ❷ */
    '&#10104;', /* ❸ */
    '&#10105;', /* ❹ */
    '&#10106;', /* ❺ */
    '&#10107;', /* ❻ */
    '&#10108;', /* ❼ */
    '&#10109;', /* ❽ */
    '&#10110;', /* ❾ */
    '&#10111;', /* ❿ */
    '&#9451;', /* ⓫ */
    '&#9452;', /* ⓬ */
    '&#9453;', /* ⓭ */
    '&#9454;', /* ⓮ */
    '&#9455;', /* ⓯ */
    '&#9456;', /* ⓰ */
    '&#9457;', /* ⓱ */
    '&#9458;', /* ⓲ */
    '&#9459;', /* ⓳ */
    '&#9460;', /* ⓴ */
    '&#9461;', /* ⓵ ((1)) */
    '&#9462;', /* ⓶ ((2)) */
    '&#9463;', /* ⓷ ((3)) */
    '&#9464;', /* ⓸ ((4)) */
    '&#9465;', /* ⓹ ((5)) */
    '&#9466;', /* ⓺ ((6)) */
    '&#9467;', /* ⓻ ((7)) */
    '&#9468;', /* ⓼ ((8)) */
    '&#9469;', /* ⓽ ((9)) */
    '&#9470;', /* ⓾ ((10)) */

    /* tableau: http://graphemica.com/%E2%95%90 */

    /* Divers */
    '&#9744;', /* ☐ */
    '&#9745;', /* ☑ */
    '&#9746;', /* ☒ */
    '&#9872;', /* ⚐ drapeau blanc */
    '&#9873;', /* ⚑ drapeau noir */
    '&#9824;', /* ♠ */
    '&#9827;', /* ♣ */
    '&#9829;', /* ♥ */
    '&#9830;', /* ♦ */
    '&#10004;', /* ✔ */
    '&#10006;', /* ✖ */
    '&#10084;', /* ❤ */

    /* Pictogrammes */
    '&#169;', /* © */
    '&#174;', /* ® */
    '&#8252;', /* ‼ !! */
    '&#8265;', /* ⁉ !? */
    '&#8482;', /* ™ TM */
    '&#9410;', /* Ⓜ (M) */
    '&#9851;', /* ♻ recycle */
    '&#9888;', /* ⚠ /!\ */
    '&#9889;', /* ⚡ electric */
    '&#9760;', /* ☠ */
    '&#9762;', /* ☢ */
    '&#9774;', /* ☮ */
    '&#9775;', /* ☯ */
    '&#9786;', /* ☺ */
    '&#9787;', /* ☻ */
    '&#9785;', /* ☹ */
    '&#9792;', /* ♀ Femelle */
    '&#9794;', /* ♂ Male */
    '&#9833;', /* ♩ noir */
    '&#9834;', /* ♪ */
    '&#9835;', /* ♫ */
    '&#9836;', /* ♬ */
    '&#9856;', /* ⚀ dés 1 */
    '&#9857;', /* ⚁ dés 2 */
    '&#9858;', /* ⚂ dés 3 */
    '&#9859;', /* ⚃ dés 4 */
    '&#9860;', /* ⚄ dés 5 */
    '&#9861;', /* ⚅ dés 6 */

    /* Météo */
    '&#9728;', /* ☀ */
    '&#9729;', /* ☁ */
    '&#9730;', /* ☂ */
    '&#9748;', /* ☔ */
    '&#9731;', /* ☃ */
    '&#9788;', /* ☼ */
    '&#9789;', /* ☽ */
    '&#9790;', /* ☾ */
    '&#10052;', /* ❄ */

    /* Objets */
    '&#8986;', /* ⌚ montre */
    '&#8987;', /* ⌛ sablier */
    '&#9742;', /* ☎ */
    '&#9986;', /* ✂ */
    '&#9993;', /* ✉ */
    '&#9998;', /* ✎ */
    '&#9999;', /* ✏ */
    '&#10002;', /* ✒ */
    '&#9855;', /* ♿ fauteuill roulant */
    '&#9875;', /* ⚓ ancre marine */
    '&#9992;', /* ✈ */
    '&#9996;', /* ✌ */

    /* Nourriture */
    '&#9749;', /* ☕ */
    '&#9832;', /* ♨ */


    /* Smiley */
    '&#9786;', /* ☺ */

    /* Zodiaque */
    '&#9800;', /* ♈ */
    '&#9801;', /* ♉ */
    '&#9802;', /* ♊ */
    '&#9803;', /* ♋ */
    '&#9804;', /* ♌ */
    '&#9805;', /* ♍ */
    '&#9806;', /* ♎ */
    '&#9807;', /* ♏ */
    '&#9808;', /* ♐ */
    '&#9809;', /* ♑ */
    '&#9810;', /* ♒ */
    '&#9811;', /* ♓ */

  ];
};

function clean_CKEditor_input(content)
{
  const regex = /<script.*?<\/script>/gm;
  return content.replace(regex, '');
}