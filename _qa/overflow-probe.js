(() => {
  const list = Array.from(document.querySelectorAll('*')).map(el => {
    const b = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      cls: (el.className || '').toString().slice(0, 90),
      right: Math.round(b.right),
      left: Math.round(b.left),
      width: Math.round(b.width),
      pos: getComputedStyle(el).position,
      tf: getComputedStyle(el).transform.slice(0, 40)
    };
  }).filter(o => o.right > window.innerWidth + 1).sort((a, b) => b.right - a.right).slice(0, 12);
  return {
    path: location.pathname,
    viewport: window.innerWidth + 'x' + window.innerHeight,
    innerWidth: window.innerWidth,
    docScrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    htmlOverflowX: getComputedStyle(document.documentElement).overflowX,
    bodyOverflowX: getComputedStyle(document.body).overflowX,
    offenders: list
  };
})()