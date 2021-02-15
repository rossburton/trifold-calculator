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
  let svg = SVG(element);
  svg.clear();
  svg.size(2*layout.pageWidth, 2*layout.pageHeight).viewbox(0, 0, layout.pageWidth + 5 , layout.pageHeight + 5)

  let container = svg.nested()
  for (let fold of layout.folds)
    container.line(fold, 0, fold, layout.pageHeight).attr({'stroke': '#aaa', 'stroke-width': '0.5', 'stroke-dasharray': '5,5'});
  for (let p of layout.panels)
    container.rect(p.w, p.h).move(p.x, p.y).fill('transparent').attr({'stroke': '#aaa', 'stroke-width': '0.5', 'stroke-dasharray': '2,2'});
  container.rect(layout.pageWidth, layout.pageHeight).move(0, 0).attr({'fill': 'transparent', 'stroke': '#000', 'stroke-width': '1'});

  container.move(5, 5);
}
