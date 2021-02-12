'use strict';

const margin = 10;
const pageWidth = 297;
const pageHeight = 210;
const thirds = pageWidth / 3;

let widePanel = thirds+1;
let narrowPanel = pageWidth - widePanel * 2;

function getOutsideMetrics() {
  return {
    pageWidth: pageWidth,
    pageHeight: pageHeight,
    margin: margin,
    folds: [narrowPanel, narrowPanel + widePanel],
    panels: [
      { x: margin, y: margin, w: narrowPanel - margin * 2, h: pageHeight - margin * 2 },
      { x: narrowPanel + margin, y: margin, w: widePanel - margin * 2, h: pageHeight - margin * 2 },
      { x: narrowPanel + widePanel + margin, y: margin, w: widePanel - margin * 2, h: pageHeight - margin * 2 }
   ]
  };
}

function getInsideMetrics() {
  return {
    pageWidth: pageWidth,
    pageHeight: pageHeight,
    margin: margin,
    folds: [widePanel, widePanel + widePanel],
    panels: [
      { x: margin, y: margin, w: widePanel-margin*1.5, h: pageHeight - margin * 2 },
      { x: widePanel + margin / 2, y: margin, w: widePanel-margin, h: pageHeight - margin * 2 },
      { x: widePanel * 2 + margin / 2, y: margin, w: narrowPanel-margin*1.5, h: pageHeight - margin * 2 }
   ]
  };
}

function drawMetrics(metrics) {
  let draw = SVG().addTo('body').size(2*pageWidth, 2*pageHeight).viewbox(0, 0, pageWidth + 5 , pageHeight + 5)

  /* TODO Use CSS. Dotted grey for folds, solid grey for margins, drop shadow on outline */
  for (let fold of metrics.folds)
    draw.line(fold, 0, fold, metrics.pageHeight).stroke('#aaa');
  for (let p of metrics.panels)
    draw.rect(p.w, p.h).move(p.x, p.y).fill('transparent').stroke('#aaa');
  /* TODO off-by-one with the origin again. transform to offset everything 5px in for the shadow? */
  draw.rect(metrics.pageWidth, metrics.pageHeight).move(0, 0).fill('transparent').stroke('#000');
}
