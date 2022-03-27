# 模板编译3：optimize 优化器

优化器的作用是在 AST 中找出静态节点并打上标记。
- 静态节点指的是那些永远都不会发生变化的节点，比如 `<p>这是一个静态节点</p>`
- 静态根节点指的是如果节点下面的所有的子节点都是静态节点，那当前作为父节点就是静态根节点。如 ul 就是静态根节点： `<ul><li>1</li><li>2</li></ul>`

标记静态节点有两点好处:
- 每次重新渲染时，不需要为静态节点创建新节点，而是克隆首次渲染生成的节点；
- 在虚拟 DOM 更新中打补丁 (patch) 的过程中可以跳过不作对比。

所以优化器的实现主要是两个步骤：
- 深层遍历 AST ，找出所有静态节点，标记为 `static:true`
- 深层遍历 AST，找出所有静态根节点，标记为 `staticRoot:true`

```js
// 首先声明一个判断是否是静态节点的函数
function isStatic (node) {
  if (node.type === 2) { // expression 带变量的节点类型一定不是静态节点
    return false
  }
  if (node.type === 3) { // text 纯文本节点是静态节点
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings 没有动态绑定的属性 v- @ : 开头的属性
    !node.if && !node.for && // not v-if or v-for or v-else 没有 v-if v-for v-else
    !isBuiltInTag(node.tag) && // not a built-in 不是内置标签 slot component等
    isPlatformReservedTag(node.tag) && // not a component 不是组件标签，即标签名是保留标签，如 div 及 svg中的标签名
    !isDirectChildOfTemplateFor(node) && // 当前父节点不能是带 v-for 的 template 标签
    Object.keys(node).every(isStaticKey) // 节点中不存在动态节点才会有的属性
  ))
}

// optimize
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    // 要使节点符合静态根节点要求，它必须有子节点
    // 这个子节点不能是只有一个静态文本的节点，否则优化成本将超过收益
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}
```