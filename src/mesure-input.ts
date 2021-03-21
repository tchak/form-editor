const GHOST_ELEMENT_ID = '__autosizeInputGhost';

const characterEntities: Record<string, string> = {
  ' ': 'nbsp',
  '<': 'lt',
  '>': 'gt',
};

function mapSpecialCharacterToCharacterEntity(
  specialCharacter: string
): string {
  return '&' + characterEntities[specialCharacter] + ';';
}

function escapeSpecialCharacters(str: string): string {
  return str.replace(/\s|<|>/g, mapSpecialCharacterToCharacterEntity);
}

// Create `ghostElement`, with inline styles to hide it and ensure that the text is all
// on a single line.
function createGhostElement(): HTMLElement {
  const ghostElement = document.createElement('div');
  ghostElement.id = GHOST_ELEMENT_ID;
  ghostElement.style.cssText =
    'display:inline-block;height:0;overflow:hidden;position:absolute;top:0;visibility:hidden;white-space:nowrap;';
  document.body.appendChild(ghostElement);
  return ghostElement;
}

export function mesureInput(input: HTMLInputElement, value?: string): string {
  const elementStyle = getComputedStyle(input);

  const elementCssText =
    'box-sizing:' +
    elementStyle.boxSizing +
    ';border-left:' +
    elementStyle.borderLeftWidth +
    ' solid red' +
    ';border-right:' +
    elementStyle.borderRightWidth +
    ' solid red' +
    ';font-family:' +
    elementStyle.fontFamily +
    ';font-feature-settings:' +
    elementStyle.fontFeatureSettings +
    ';font-kerning:' +
    elementStyle.fontKerning +
    ';font-size:' +
    elementStyle.fontSize +
    ';font-stretch:' +
    elementStyle.fontStretch +
    ';font-style:' +
    elementStyle.fontStyle +
    ';font-variant:' +
    elementStyle.fontVariant +
    ';font-variant-caps:' +
    elementStyle.fontVariantCaps +
    ';font-variant-ligatures:' +
    elementStyle.fontVariantLigatures +
    ';font-variant-numeric:' +
    elementStyle.fontVariantNumeric +
    ';font-weight:' +
    elementStyle.fontWeight +
    ';letter-spacing:' +
    elementStyle.letterSpacing +
    ';margin-left:' +
    elementStyle.marginLeft +
    ';margin-right:' +
    elementStyle.marginRight +
    ';padding-left:' +
    elementStyle.paddingLeft +
    ';padding-right:' +
    elementStyle.paddingRight +
    ';text-indent:' +
    elementStyle.textIndent +
    ';text-transform:' +
    elementStyle.textTransform;

  const string = value ?? (input.value || input.placeholder || '');
  // Check if the `ghostElement` exists. If no, create it.
  const ghostElement =
    document.getElementById(GHOST_ELEMENT_ID) || createGhostElement();
  // Copy all width-affecting styles to the `ghostElement`.
  ghostElement.style.cssText += elementCssText;
  ghostElement.innerHTML = escapeSpecialCharacters(string);
  // Copy the width of `ghostElement` to `element`.
  return getComputedStyle(ghostElement).width;
}
