'use strict';

function Layout(pageWidth, pageHeight, vmargin, hmargin, gutter) {
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
    this.vmargin = vmargin;
    this.hmargin = hmargin ?? vmargin;
    this.gutter = gutter ?? this.hmargin;
    this.folds = null;
    this.panels = null;
}

function checkLayout(layout) {
    if (layout.pageWidth == undefined)
        throw "Page width not set";
    if (layout.pageHeight == undefined)
        throw "Page height not set";
    if (layout.vmargin == undefined && layout.hmargin == undefined)
        throw "At least one margin not set";
}

function getOutsideMetrics(layout) {
    /* TODO sanity check input */
    const thirds = layout.pageWidth / 3;
    const widePanel = thirds + 1;
    const narrowPanel = layout.pageWidth - widePanel * 2;

    /* TODO: Can likely generalise this logic further to just iterate over the folds */
    layout.folds = [narrowPanel, narrowPanel + widePanel];
    layout.panels = [
      { x: layout.hmargin, y: layout.vmargin, w: narrowPanel - layout.hmargin * 2, h: layout.pageHeight - layout.vmargin * 2 },
      { x: narrowPanel + layout.hmargin, y: layout.vmargin, w: widePanel - layout.hmargin * 2, h: layout.pageHeight - layout.vmargin * 2 },
      { x: narrowPanel + widePanel + layout.hmargin, y: layout.vmargin, w: widePanel - layout.hmargin * 2, h: layout.pageHeight - layout.vmargin * 2 }
    ];
    return layout;
}

function getInsideMetrics(layout) {
    /* TODO sanity check input */
    const thirds = layout.pageWidth / 3;
    const widePanel = thirds + 1;
    const narrowPanel = layout.pageWidth - widePanel * 2;
    // If gutter is unset then use the margin
    if (layout.gutter == undefined)
        layout.gutter = layout.hmargin || layout.vmargin;

    layout.folds = [widePanel, widePanel + widePanel];
    layout.panels = [
      { x: layout.hmargin, y: layout.vmargin, w: widePanel-layout.hmargin - layout.gutter/2, h: layout.pageHeight - layout.vmargin * 2 },
      { x: widePanel + layout.gutter / 2, y: layout.vmargin, w: widePanel-layout.gutter, h: layout.pageHeight - layout.vmargin * 2 },
      { x: widePanel * 2 + layout.gutter / 2, y: layout.vmargin, w: narrowPanel-layout.hmargin - layout.gutter/2, h: layout.pageHeight - layout.vmargin * 2 }
    ];
    return layout;
}

function drawMetrics(element, layout) {
  let draw = SVG(element);
  draw.clear();
  draw.size(2*layout.pageWidth, 2*layout.pageHeight).viewbox(0, 0, layout.pageWidth + 5 , layout.pageHeight + 5)

  /* TODO Use CSS. Dotted grey for folds, solid grey for margins, drop shadow on outline */
  for (let fold of layout.folds)
    draw.line(fold, 0, fold, layout.pageHeight).stroke('#aaa');
  for (let p of layout.panels)
    draw.rect(p.w, p.h).move(p.x, p.y).fill('transparent').stroke('#aaa');
  /* TODO off-by-one with the origin again. transform to offset everything 5px in for the shadow? */
  draw.rect(layout.pageWidth, layout.pageHeight).move(0, 0).fill('transparent').stroke('#000');
}
