/**
 * Client DOM Patch
 * Prevents third-party scripts (Google Translate, browser extensions, password managers)
 * from crashing React's reconciliation engine when they mutate or wrap DOM text nodes.
 */

if (typeof window !== "undefined") {
  // Patch Node.prototype.removeChild
  if (typeof Node !== "undefined" && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (child && child.parentNode !== this) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(
            "[DOM Patch] Suppressed removeChild error: Node was modified by an external script/translator."
          );
        }
        return child;
      }
      return originalRemoveChild.apply(this, arguments);
    };

    // Patch Node.prototype.insertBefore
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(
            "[DOM Patch] Suppressed insertBefore error: Reference node was modified by an external script/translator."
          );
        }
        return newNode;
      }
      return originalInsertBefore.apply(this, arguments);
    };
  }
}

export default function initDomPatch() {
  // no-op function for explicit imports
  return true;
}
