/**
 *
 * @param {*} child
 * @param {*} parent
 * @return outBounds, e.g. [{boundingSide : 'left', resetIncrement : 123}]
 */
const childOutsideParent = (child, parent) => {
  const c = child.getBoundingClientRect();
  const p = parent.getBoundingClientRect();
  const outBounds = [];
  if (c.left <= p.left + 10) {
    outBounds.push({
      boundingSide: "left",
      offset: "offsetLeft",
      resetIncrement: p.left + 5 - c.left,
    });
  }
  if (c.right >= p.right - 10) {
    outBounds.push({
      boundingSide: "left",
      offset: "offsetLeft",
      resetIncrement: p.right - 5 - c.right,
    });
  }
  if (c.top <= p.top + 10) {
    outBounds.push({
      boundingSide: "top",
      offset: "offsetTop",
      resetIncrement: p.top + 5 - c.top,
    });
  }
  if (c.bottom >= p.bottom - 10) {
    outBounds.push({
      boundingSide: "top",
      offset: "offsetTop",
      resetIncrement: p.bottom - 5 - c.bottom,
    });
  }
  return outBounds;
};
export default childOutsideParent;
