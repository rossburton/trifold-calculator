'use strict';

function Layout() {
    this.pageWidth = undefined;
    this.pageHeight = undefined;
    this.margin = undefined;
    this.gutter = undefined;
    this.folds = null;
    this.panels = null;
}

function getOutsideMetrics(layout) {
    const thirds = layout.pageWidth / 3;
    const widePanel = thirds + 1;
    const narrowPanel = layout.pageWidth - widePanel * 2;

    /* TODO: Can likely generalise this logic further to just iterate over the folds */
    layout.folds = [narrowPanel, narrowPanel + widePanel];
    layout.panels = [
      { x: layout.margin, y: layout.margin, w: narrowPanel - layout.margin * 2, h: layout.pageHeight - layout.margin * 2 },
      { x: narrowPanel + layout.margin, y: layout.margin, w: widePanel - layout.margin * 2, h: layout.pageHeight - layout.margin * 2 },
      { x: narrowPanel + widePanel + layout.margin, y: layout.margin, w: widePanel - layout.margin * 2, h: layout.pageHeight - layout.margin * 2 }
    ];
    return layout;
}

function getInsideMetrics(layout) {
    const thirds = layout.pageWidth / 3;
    const widePanel = thirds + 1;
    const narrowPanel = layout.pageWidth - widePanel * 2;
    // If gutter is unset then use the margin
    if (layout.gutter == undefined)
        layout.gutter = layout.margin;

    layout.folds = [widePanel, widePanel + widePanel];
    layout.panels = [
      { x: layout.margin, y: layout.margin, w: widePanel-layout.margin - layout.gutter/2, h: layout.pageHeight - layout.margin * 2 },
      { x: widePanel + layout.gutter / 2, y: layout.margin, w: widePanel-layout.gutter, h: layout.pageHeight - layout.margin * 2 },
      { x: widePanel * 2 + layout.gutter / 2, y: layout.margin, w: narrowPanel-layout.margin - layout.gutter/2, h: layout.pageHeight - layout.margin * 2 }
    ];
    return layout;
}

function drawMetrics(layout) {
  let draw = SVG().addTo('body').size(2*layout.pageWidth, 2*layout.pageHeight).viewbox(0, 0, layout.pageWidth + 5 , layout.pageHeight + 5)

  /* TODO Use CSS. Dotted grey for folds, solid grey for margins, drop shadow on outline */
  for (let fold of layout.folds)
    draw.line(fold, 0, fold, layout.pageHeight).stroke('#aaa');
  for (let p of layout.panels)
    draw.rect(p.w, p.h).move(p.x, p.y).fill('transparent').stroke('#aaa');
  /* TODO off-by-one with the origin again. transform to offset everything 5px in for the shadow? */
  draw.rect(layout.pageWidth, layout.pageHeight).move(0, 0).fill('transparent').stroke('#000');
}
