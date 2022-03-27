# VueRouter源码5: router-link 导航组件 

router-link 组件主要是在导航元素上注册 click 事件，事件回调函数中调用 `this.$router.push(url)` 

```js
const toTypes = [String, Object];
const eventTypes = [String, Array];
const noop = () => {};

var Link = {
  name: 'RouterLink',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    ariaCurrentValue: {
      type: String,
      default: 'page'
    },
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render (h) {
    const router = this.$router;
    const current = this.$route;
    const { location, route, href } = router.resolve(
      this.to,
      current,
      this.append
    );

    /**
     * class 类处理
    */
    const classes = {};
    const globalActiveClass = router.options.linkActiveClass;
    const globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    const activeClassFallback =
      globalActiveClass == null ? 'router-link-active' : globalActiveClass;
    const exactActiveClassFallback =
      globalExactActiveClass == null
        ? 'router-link-exact-active'
        : globalExactActiveClass;
    const activeClass =
      this.activeClass == null ? activeClassFallback : this.activeClass;
    const exactActiveClass =
      this.exactActiveClass == null
        ? exactActiveClassFallback
        : this.exactActiveClass;

    const compareTarget = route.redirectedFrom
      ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    const ariaCurrentValue = classes[exactActiveClass] ? this.ariaCurrentValue : null;

    // 点击事件处理句柄
    const handler = e => {
      if (guardEvent(e)) {
        if (this.replace) {
          router.replace(location, noop);
        } else {
          router.push(location, noop);
        }
      }
    };

    const on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(e => {
        on[e] = handler;
      });
    } else {
      on[this.event] = handler;
    }

    const data = { class: classes };

    const scopedSlot =
      !this.$scopedSlots.$hasNormal &&
      this.$scopedSlots.default &&
      this.$scopedSlots.default({
        href,
        route,
        navigate: handler,
        isActive: classes[activeClass],
        isExactActive: classes[exactActiveClass]
      });

    if (scopedSlot) {
      if (scopedSlot.length === 1) {
        return scopedSlot[0]
      } else if (scopedSlot.length > 1 || !scopedSlot.length) {
        {
          warn(
            false,
            `RouterLink with to="${
              this.to
            }" is trying to use a scoped slot but it didn't provide exactly one child. Wrapping the content with a span element.`
          );
        }
        return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot)
      }
    }

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href, 'aria-current': ariaCurrentValue };
    } else {
      // find the first <a> child and apply listener and href
      const a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        const aData = (a.data = extend({}, a.data));
        aData.on = aData.on || {};
        // transform existing events in both objects into arrays so we can push later
        for (const event in aData.on) {
          const handler = aData.on[event];
          if (event in on) {
            aData.on[event] = Array.isArray(handler) ? handler : [handler];
          }
        }
        // append new listeners for router-link
        for (const event in on) {
          if (event in aData.on) {
            // on[event] is always a function
            aData.on[event].push(on[event]);
          } else {
            aData.on[event] = handler;
          }
        }

        const aAttrs = (a.data.attrs = extend({}, a.data.attrs));
        aAttrs.href = href;
        aAttrs['aria-current'] = ariaCurrentValue;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

VueRouter.prototype.resolve = function(
  to,
  current,
  append
) {
  current = current || this.history.current;
  const location = normalizeLocation(to, current, append, this);
  const route = this.match(location, current);
  const fullPath = route.redirectedFrom || route.fullPath;
  const base = this.history.base;
  const href = createHref(base, fullPath, this.mode);
  return {
    location,
    route,
    href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
}

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) return
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) return
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    let child;
    for (let i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}
```