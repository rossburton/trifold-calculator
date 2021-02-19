/*
* Copyright (C) 2021 Ross Burton
* Licensed under the MIT license
*/

'use strict';

SVG.extend(SVG.Element, {
    addOutline: function() {
      this.clone().attr({'stroke': 'white', 'stroke-width': '8', 'stroke-linejoin': 'round'}).insertBefore(this);
    }
  });

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

function round(layout) {
  layout.folds = layout.folds.map(i => Math.round(i));
  for (let p of layout.panels) {
    for (const i in p) {
      p[i] = Math.round(p[i]);
    }
  }
}

function getOutsideMetrics(layout) {
    /* TODO sanity check input */
    const thirds = layout.pageWidth / 3;
    const widePanel = thirds + 1;
    const narrowPanel = layout.pageWidth - widePanel * 2;

    /* TODO: Can likely generalise this logic further to just iterate over the folds */

    /* Calculate everything in float first for accuracy */
    layout.folds = [narrowPanel, narrowPanel + widePanel];
    layout.panels = [
      { x: layout.hmargin, y: layout.vmargin, w: narrowPanel - layout.hmargin * 2, h: layout.pageHeight - layout.vmargin * 2 },
      { x: narrowPanel + layout.hmargin, y: layout.vmargin, w: widePanel - layout.hmargin * 2, h: layout.pageHeight - layout.vmargin * 2 },
      { x: narrowPanel + widePanel + layout.hmargin, y: layout.vmargin, w: widePanel - layout.hmargin * 2, h: layout.pageHeight - layout.vmargin * 2 }
    ];

    /* Then round to whole units */
    round(layout);

    return layout;
}

function getInsideMetrics(layout) {
    /* TODO sanity check input */
    const thirds = layout.pageWidth / 3;
    const widePanel = thirds + 1;
    const narrowPanel = layout.pageWidth - widePanel * 2;

    /* Calculate everything in float first for accuracy */
    layout.folds = [widePanel, widePanel + widePanel];
    layout.panels = [
      { x: layout.hmargin, y: layout.vmargin, w: widePanel-layout.hmargin - layout.gutter/2, h: layout.pageHeight - layout.vmargin * 2 },
      { x: widePanel + layout.gutter / 2, y: layout.vmargin, w: widePanel-layout.gutter, h: layout.pageHeight - layout.vmargin * 2 },
      { x: widePanel * 2 + layout.gutter / 2, y: layout.vmargin, w: narrowPanel-layout.hmargin - layout.gutter/2, h: layout.pageHeight - layout.vmargin * 2 }
    ];

    /* Then round to whole units */
    round(layout);

    return layout;
}

function drawMetrics(element, layout, outside) {
  if (outside == undefined)
    outside = true;

  const labelMap = [
    ["Inside Left", "Inside Middle", "Inside Right"],
    ["Inside Cover", "Back Cover", "Front Cover"]
  ];

  let svg = SVG(element);
  svg.clear();
  svg.size(2*layout.pageWidth, 2*layout.pageHeight).viewbox(0, 0, layout.pageWidth + 5 , layout.pageHeight + 5)

  let container = svg.nested()
  for (let fold of layout.folds) {
    container.line(fold, 0, fold, layout.pageHeight).attr({'stroke': 'grey', 'stroke-width': '0.5', 'stroke-dasharray': '5,5'});
    container.plain(`${fold}mm`).font({family: 'sans-serif', size: 7}).center(fold, layout.pageHeight/3).rotate(90).addOutline();
  }

  for (const [index, p] of layout.panels.entries()) {
    container.rect(p.w, p.h).move(p.x, p.y).fill('transparent').attr({'stroke': 'grey', 'stroke-width': '0.5', 'stroke-dasharray': '2,2'});

    /* Only draw the horizontal rulers on the middle panel */
    if (index == 1) {
      container.plain(`${p.y}mm`).font({family: 'sans-serif', size: 7}).center(p.x + p.w/2, p.y).addOutline();
      container.plain(`${p.y+p.h}mm`).font({family: 'sans-serif', size: 7}).center(p.x + p.w/2, p.y + p.h).addOutline();
    }

    /* Draw just the vertical rulers here so we don't repeat the horizontal ones */
    container.plain(`${p.x}mm`).font({family: 'sans-serif', size: 7}).center(p.x, layout.pageHeight/2).rotate(90).addOutline();
    container.plain(`${p.x+p.w}mm`).font({family: 'sans-serif', size: 7}).center(p.x+p.w, layout.pageHeight/2).rotate(90).addOutline();
    container.plain(labelMap[outside ? 1 : 0][index]).font({family: 'serif', size: 12}).cx(p.x + p.w/2).y(p.y+15).addOutline();
  }

  container.rect(layout.pageWidth, layout.pageHeight).move(0, 0).attr({'fill': 'transparent', 'stroke': 'black', 'stroke-width': '1'});

  container.move(5, 5);
}
