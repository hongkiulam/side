const isChildInParent = (child, parent) => {
  const c = child.getBoundingClientRect();
  const p = parent.getBoundingClientRect();
  if (c.left <= p.left + 10) {
    return false;
  }
  if (c.right >= p.right - 10) {
    return false;
  }
  if (c.top <= p.top + 10) {
    return false;
  }
  if (c.bottom >= p.bottom + 10) {
    return false;
  }
  return true;
};
export default isChildInParent;
