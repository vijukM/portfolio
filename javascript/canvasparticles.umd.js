!(function (t, i) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = i())
    : "function" == typeof define && define.amd
      ? define(i)
      : ((t =
          "undefined" != typeof globalThis
            ? globalThis
            : t || self).CanvasParticles = i());
})(this, function () {
  "use strict";
  function t(t, i, e, s) {
    if (null == i) return e;
    const { min: a = -1 / 0, max: n = 1 / 0 } = s ?? {};
    return (
      i < a
        ? console.warn(`option.${t} was clamped to ${a} as ${i} is too low`)
        : i > n &&
          console.warn(`option.${t} was clamped to ${n} as ${i} is too high`),
      (function (t, i) {
        return isNaN(+t) ? i : +t;
      })(Math.min(Math.max(i ?? e, a), n), e)
    );
  }
  const i = 2 * Math.PI;
  const e =
    ((s = (4294967296 * Math.random()) | 0),
    function () {
      let t = (s += 1831565813);
      return (
        (t = Math.imul(t ^ (t >>> 15), 1 | t)),
        (t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)),
        ((t ^ (t >>> 14)) >>> 0) / 4294967296
      );
    });
  var s;
  class CanvasParticles {
    static version = "4.5.6";
    static MAX_DT = 1e3 / 30;
    static BASE_DT = 1e3 / 60;
    static interactionType = Object.freeze({ NONE: 0, SHIFT: 1, MOVE: 2 });
    static generationType = Object.freeze({ OFF: 0, NEW: 1, MATCH: 2 });
    static canvasIntersectionObserver = new IntersectionObserver(
      (t) => {
        for (const i of t) {
          const t = i.target,
            e = t.instance;
          if (!e.options?.animation) return;
          (t.inViewbox = i.isIntersecting)
            ? e.option.animation?.startOnEnter && e.start({ auto: !0 })
            : e.option.animation?.stopOnLeave &&
              e.stop({ auto: !0, clear: !1 });
        }
      },
      { rootMargin: "-1px" },
    );
    static canvasResizeObserver = new ResizeObserver((t) => {
      for (const i of t) {
        i.target.instance.updateCanvasRect();
      }
      const i = window.devicePixelRatio || 1;
      for (const e of t) {
        e.target.instance.#t(i);
      }
    });
    static instances = new Set();
    canvas;
    ctx;
    enableAnimating = !1;
    isAnimating = !1;
    lastAnimationFrame = 0;
    particles = [];
    hasManualParticles = !1;
    clientX = 1 / 0;
    clientY = 1 / 0;
    mouseX = 1 / 0;
    mouseY = 1 / 0;
    dpr = 1;
    width;
    height;
    offX;
    offY;
    option;
    color;
    constructor(t, i = {}) {
      let e;
      if (t instanceof HTMLCanvasElement) e = t;
      else {
        if ("string" != typeof t)
          throw new TypeError(
            "selector is not a string and neither a HTMLCanvasElement itself",
          );
        if (
          ((e = document.querySelector(t)), !(e instanceof HTMLCanvasElement))
        )
          throw new Error("selector does not point to a canvas");
      }
      ((this.canvas = e),
        (this.canvas.instance = this),
        (this.canvas.inViewbox = !0));
      const s = this.canvas.getContext("2d");
      if (!s) throw new Error("failed to get 2D context from canvas");
      ((this.ctx = s),
        (this.options = i),
        CanvasParticles.instances.add(this),
        CanvasParticles.canvasIntersectionObserver.observe(this.canvas),
        CanvasParticles.canvasResizeObserver.observe(this.canvas));
    }
    updateCanvasRect() {
      const {
        top: t,
        left: i,
        width: e,
        height: s,
      } = this.canvas.getBoundingClientRect();
      this.canvas.rect = { top: t, left: i, width: e, height: s };
    }
    handleMouseMove(t) {
      this.enableAnimating &&
        ((this.clientX = t.clientX),
        (this.clientY = t.clientY),
        this.isAnimating && this.updateMousePos());
    }
    handleScroll() {
      this.enableAnimating &&
        (this.updateCanvasRect(), this.isAnimating && this.updateMousePos());
    }
    updateMousePos() {
      const { top: t, left: i } = this.canvas.rect;
      ((this.mouseX = this.clientX - i), (this.mouseY = this.clientY - t));
    }
    #t(t = window.devicePixelRatio || 1) {
      t < 1 && (t = 1);
      const i = (this.canvas.width = this.canvas.rect.width * t),
        e = (this.canvas.height = this.canvas.rect.height * t);
      (t > 1 && this.ctx.scale(t, t),
        (this.mouseX = 1 / 0),
        (this.mouseY = 1 / 0),
        (this.width = Math.max(i + 2 * this.option.particles.connectDist, 1)),
        (this.height = Math.max(e + 2 * this.option.particles.connectDist, 1)),
        (this.offX = (i - this.width) / 2),
        (this.offY = (e - this.height) / 2));
      const s = this.option.particles.generationType;
      (s !== CanvasParticles.generationType.OFF &&
        (s === CanvasParticles.generationType.NEW || 0 === this.particles.length
          ? this.newParticles()
          : s === CanvasParticles.generationType.MATCH &&
            this.matchParticleCount({ updateBounds: !0 })),
        this.isAnimating && this.#i());
    }
    resizeCanvas(t = !0) {
      (t && this.updateCanvasRect(), this.#t());
    }
    #e() {
      let t = Math.round(
        (this.option.particles.ppm * this.width * this.height) / 1e6,
      );
      if (((t = Math.min(this.option.particles.max, t)), !isFinite(t)))
        throw new RangeError("particleCount must be finite");
      return 0 | t;
    }
    newParticles({ keepAuto: t = !1, keepManual: i = !0 } = {}) {
      const e = this.#e();
      if (
        (this.hasManualParticles && (t || i)
          ? ((this.particles = this.particles.filter(
              (e) => (t && !e.isManual) || (i && e.isManual),
            )),
            (this.hasManualParticles = this.particles.length > 0))
          : (this.particles = []),
        !t)
      )
        for (let t = 0; t < e; t++) this.#s();
    }
    matchParticleCount({ updateBounds: t = !1 } = {}) {
      const i = this.#e();
      if (this.hasManualParticles) {
        const t = [];
        let e = 0;
        for (const s of this.particles)
          s.isManual ? t.push(s) : e < i && (t.push(s), e++);
        this.particles = t;
      } else this.particles = this.particles.slice(0, i);
      if (t) for (const t of this.particles) this.#a(t);
      for (let t = this.particles.length; t < i; t++) this.#s();
    }
    #s() {
      const t = e() * this.width,
        s = e() * this.height;
      this.createParticle(
        t,
        s,
        e() * i,
        (0.5 + 0.5 * e()) * this.option.particles.relSpeed,
        (0.5 + 2 * Math.pow(e(), 5)) * this.option.particles.relSize,
        !1,
      );
    }
    createParticle(t, i, e, s, a, n = !0) {
      const o = {
        posX: t,
        posY: i,
        x: t,
        y: i,
        velX: 0,
        velY: 0,
        offX: 0,
        offY: 0,
        dir: e,
        speed: s,
        size: a,
        gridPos: { x: 1, y: 1 },
        isVisible: !1,
        isManual: n,
        bounds: {
          top: -a,
          right: this.canvas.width + a,
          bottom: this.canvas.height + a,
          left: -a,
        },
      };
      (this.particles.push(o), (this.hasManualParticles = !0));
    }
    #n(t) {
      ((t.bounds.top = -t.size),
        (t.bounds.right = this.canvas.width + t.size),
        (t.bounds.bottom = this.canvas.height + t.size),
        (t.bounds.left = -t.size));
    }
    #a(t) {
      ((t.bounds.right = this.canvas.width + t.size),
        (t.bounds.bottom = this.canvas.height + t.size));
    }
    updateParticles() {
      const t = this.option.particles.relSpeed,
        i = this.option.particles.relSize;
      for (const s of this.particles)
        ((s.speed = (0.5 + 0.5 * e()) * t),
          (s.size = (0.5 + 2 * Math.pow(e(), 5)) * i),
          this.#n(s));
    }
    #o(t) {
      const i = this.option.gravity.repulsive > 0,
        e = this.option.gravity.pulling > 0;
      if (!i && !e) return;
      const s = this.particles,
        a = s.length,
        n = this.option.particles.connectDist,
        o = n * this.option.gravity.repulsive * t,
        r = n * this.option.gravity.pulling * t,
        c = (n / 2) ** 2,
        l = n ** 2 / 256;
      for (let t = 0; t < a; t++) {
        const i = s[t];
        for (let n = t + 1; n < a; n++) {
          const t = s[n],
            a = i.posX - t.posX,
            h = i.posY - t.posY,
            p = a * a + h * h;
          if (p >= c && !e) continue;
          const d = 1 / Math.sqrt(p + l),
            u = d * d * d;
          if (p < c) {
            const e = u * o,
              s = -a * e,
              n = -h * e;
            ((i.velX -= s), (i.velY -= n), (t.velX += s), (t.velY += n));
          }
          if (!e) continue;
          const g = u * r,
            v = -a * g,
            f = -h * g;
          ((i.velX += v), (i.velY += f), (t.velX -= v), (t.velY -= f));
        }
      }
    }
    #r(t) {
      const e = this.width,
        s = this.height,
        a = this.offX,
        n = this.offY,
        o = this.mouseX,
        r = this.mouseY,
        c =
          this.option.mouse.interactionType ===
          CanvasParticles.interactionType.NONE,
        l =
          this.option.mouse.interactionType ===
          CanvasParticles.interactionType.MOVE,
        h = this.option.mouse.connectDist,
        p = this.option.mouse.distRatio,
        d = this.option.particles.rotationSpeed * t,
        u = this.option.gravity.friction,
        g = this.option.gravity.maxVelocity,
        v = 1 - Math.pow(3 / 4, t);
      for (const f of this.particles) {
        ((f.dir += 2 * (Math.random() - 0.5) * d * t), (f.dir %= i));
        const m = Math.sin(f.dir) * f.speed,
          x = Math.cos(f.dir) * f.speed;
        (g > 0 &&
          (f.velX > g && (f.velX = g),
          f.velX < -g && (f.velX = -g),
          f.velY > g && (f.velY = g),
          f.velY < -g && (f.velY = -g)),
          (f.posX += (m + f.velX) * t),
          (f.posY += (x + f.velY) * t),
          (f.posX %= e),
          f.posX < 0 && (f.posX += e),
          (f.posY %= s),
          f.posY < 0 && (f.posY += s),
          (f.velX *= Math.pow(u, t)),
          (f.velY *= Math.pow(u, t)));
        const y = f.posX + a - o,
          b = f.posY + n - r;
        if (!c) {
          const t = h / Math.hypot(y, b);
          p < t
            ? ((f.offX += (t * y - y - f.offX) * v),
              (f.offY += (t * b - b - f.offY) * v))
            : ((f.offX -= f.offX * v), (f.offY -= f.offY * v));
        }
        ((f.x = f.posX + f.offX),
          (f.y = f.posY + f.offY),
          l && ((f.posX = f.x), (f.posY = f.y)),
          (f.x += a),
          (f.y += n),
          (f.gridPos.x = +(f.x >= f.bounds.left) + +(f.x > f.bounds.right)),
          (f.gridPos.y = +(f.y >= f.bounds.top) + +(f.y > f.bounds.bottom)),
          (f.isVisible = 1 === f.gridPos.x && 1 === f.gridPos.y));
      }
    }
    #c() {
      const t = this.ctx,
        e = window.devicePixelRatio || 1;
      for (const s of this.particles)
        s.isVisible &&
          (s.size > 1 / e
            ? (t.beginPath(),
              t.arc(s.x, s.y, s.size, 0, i),
              t.fill(),
              t.closePath())
            : t.fillRect(s.x - s.size, s.y - s.size, 2 * s.size, 2 * s.size));
    }
    #l(t, i) {
      const e = this.particles,
        s = e.length,
        a = new Map();
      for (let n = 0; n < s; n++) {
        const s = e[n],
          o = ((s.x * i) | 0) + Math.imul(s.y * i, t),
          r = a.get(o);
        r ? r.push(n) : a.set(o, [n]);
      }
      return a;
    }
    static #h(t, i) {
      return (
        !(!t.isVisible && !i.isVisible) ||
        !(
          (t.gridPos.x === i.gridPos.x && 1 !== t.gridPos.x) ||
          (t.gridPos.y === i.gridPos.y && 1 !== t.gridPos.y)
        )
      );
    }
    #p() {
      const t = this.particles,
        i = t.length,
        e = this.ctx,
        s = this.option.particles.connectDist,
        a = s ** 2,
        n = (s / 2) ** 2,
        o = 1 / s,
        r = Math.ceil(this.width * o),
        c = Math.ceil(this.height * o),
        l = s >= Math.min(this.canvas.width, this.canvas.height),
        h = a * this.option.particles.maxWork,
        p = this.color.alpha,
        d = this.color.alpha * s,
        u = [],
        g = this.#l(r, o);
      let v = 0,
        f = !0;
      function m(t, i, s, o) {
        const r = t - s,
          c = i - o,
          l = r * r + c * c;
        l > a ||
          (l > n
            ? ((e.globalAlpha = d / Math.sqrt(l) - p),
              e.beginPath(),
              e.moveTo(t, i),
              e.lineTo(s, o),
              e.stroke())
            : u.push(t, i, s, o),
          (v += l),
          (f = v < h));
      }
      function x(i, e, s) {
        for (const a of i) {
          if (e >= a) continue;
          const i = t[a];
          if ((l || CanvasParticles.#h(s, i)) && (m(s.x, s.y, i.x, i.y), !f))
            break;
        }
      }
      function y(i, e) {
        for (const s of i) {
          const i = t[s];
          if ((l || CanvasParticles.#h(e, i)) && (m(e.x, e.y, i.x, i.y), !f))
            break;
        }
      }
      for (let e = 0; e < i; e++) {
        ((v = 0), (f = !0));
        let s,
          a = t[e],
          n = (a.x * o) | 0,
          l = (a.y * o) | 0,
          h = n + Math.imul(l, r);
        if (
          ((s = g.get(h + 1)) && y(s, a),
          f &&
            ((s = g.get(h + r)) && y(s, a),
            f &&
              ((s = g.get(h + r + 1)) && y(s, a),
              f &&
                ((s = g.get(h + r - 1)) && y(s, a),
                f &&
                  n >= 0 &&
                  l >= 0 &&
                  n < r - 2 &&
                  l < c - 2 &&
                  (s = g.get(h)) &&
                  x(s || [], e, a)))),
          ++e >= i)
        )
          break;
        if (
          ((v = 0),
          (f = !0),
          (a = t[e]),
          (n = (a.x * o) | 0),
          (l = (a.y * o) | 0),
          (h = n + Math.imul(l, r)),
          (s = g.get(h + r + 1)) && y(s, a),
          f &&
            ((s = g.get(h + r - 1)) && y(s, a),
            f &&
              ((s = g.get(h + 1)) && y(s, a),
              f &&
                ((s = g.get(h + r)) && y(s, a),
                f &&
                  n >= 0 &&
                  l >= 0 &&
                  n < r - 2 &&
                  l < c - 2 &&
                  (s = g.get(h)) &&
                  x(s || [], e, a)))),
          ++e >= i)
        )
          break;
        ((v = 0),
          (f = !0),
          (a = t[e]),
          (n = (a.x * o) | 0),
          (l = (a.y * o) | 0),
          (h = n + Math.imul(l, r)),
          (s = g.get(h + r)) && y(s, a),
          f &&
            ((s = g.get(h + 1)) && y(s, a),
            f &&
              (n >= 0 &&
                l >= 0 &&
                n < r - 2 &&
                l < c - 2 &&
                (s = g.get(h)) &&
                x(s || [], e, a),
              f &&
                ((s = g.get(h + r - 1)) && y(s, a),
                f && (s = g.get(h + r + 1)) && y(s, a)))));
      }
      if (u.length) {
        ((e.globalAlpha = p), e.beginPath());
        for (let t = 0; t < u.length; t += 4)
          (e.moveTo(u[t], u[t + 1]), e.lineTo(u[t + 2], u[t + 3]));
        e.stroke();
      }
    }
    #d(t) {
      const i = this.ctx,
        { width: e, height: s } = this.canvas;
      (i.save(), (i.globalAlpha = 0.5), i.beginPath());
      for (let a = 0.5; a <= e; a += t) (i.moveTo(a, 0), i.lineTo(a, s));
      for (let a = 0.5; a <= s; a += t) (i.moveTo(0, a), i.lineTo(e, a));
      (i.stroke(), i.restore());
    }
    #u() {
      const t = this.ctx,
        i = this.particles,
        e = i.length;
      (t.save(),
        (t.globalAlpha = 1),
        (t.fillStyle = "#fff"),
        (t.textAlign = "center"),
        (t.textBaseline = "middle"));
      for (let s = 0; s < e; s++) {
        const e = i[s];
        t.fillText(String(s), e.x, e.y);
      }
      t.restore();
    }
    #g() {
      const t = performance.now(),
        i =
          Math.min(t - this.lastAnimationFrame, CanvasParticles.MAX_DT) /
          CanvasParticles.BASE_DT;
      (this.#o(i), this.#r(i), (this.lastAnimationFrame = t));
    }
    #i() {
      (this.ctx.clearRect(
        0,
        0,
        this.canvas.rect.width,
        this.canvas.rect.height,
      ),
        (this.ctx.globalAlpha = this.color.alpha),
        (this.ctx.fillStyle = this.color.hex),
        (this.ctx.strokeStyle = this.color.hex),
        (this.ctx.lineWidth = 1),
        this.#c(),
        this.option.particles.drawLines && this.#p(),
        this.option.debug.drawGrid &&
          this.#d(this.option.particles.connectDist),
        this.option.debug.drawIndexes && this.#u());
    }
    #v() {
      this.isAnimating &&
        (requestAnimationFrame(() => this.#v()), this.#g(), this.#i());
    }
    start({ auto: t = !1 } = {}) {
      return (
        this.isAnimating ||
          (t && !this.enableAnimating) ||
          ((this.enableAnimating = !0),
          (this.isAnimating = !0),
          this.updateCanvasRect(),
          requestAnimationFrame(() => this.#v())),
        !this.canvas.inViewbox &&
          this.option.animation.startOnEnter &&
          (this.isAnimating = !1),
        this
      );
    }
    stop({ auto: t = !1, clear: i = !0 } = {}) {
      return (
        t || (this.enableAnimating = !1),
        (this.isAnimating = !1),
        !1 !== i &&
          this.ctx.clearRect(
            0,
            0,
            this.canvas.rect.width,
            this.canvas.rect.height,
          ),
        !0
      );
    }
    destroy() {
      (this.stop(),
        CanvasParticles.instances.delete(this),
        CanvasParticles.canvasIntersectionObserver.unobserve(this.canvas),
        CanvasParticles.canvasResizeObserver.unobserve(this.canvas),
        this.canvas?.remove(),
        Object.keys(this).forEach((t) => delete this[t]));
    }
    set options(i) {
      const e = t;
      ((this.option = {
        background: i.background ?? !1,
        animation: {
          startOnEnter: !!(i.animation?.startOnEnter ?? 1),
          stopOnLeave: !!(i.animation?.stopOnLeave ?? 1),
        },
        mouse: {
          interactionType: ~~e(
            "mouse.interactionType",
            i.mouse?.interactionType,
            CanvasParticles.interactionType.MOVE,
            { min: 0, max: 2 },
          ),
          connectDist: 1,
          distRatio: e("mouse.distRatio", i.mouse?.distRatio, 2 / 3, {
            min: 0,
          }),
        },
        particles: {
          generationType: ~~e(
            "particles.generationType",
            i.particles?.generationType,
            CanvasParticles.generationType.MATCH,
            { min: 0, max: 2 },
          ),
          drawLines: !!(i.particles?.drawLines ?? 1),
          color: i.particles?.color ?? "black",
          ppm: ~~e("particles.ppm", i.particles?.ppm, 100),
          max: Math.round(
            e("particles.max", i.particles?.max, 1 / 0, { min: 0 }),
          ),
          maxWork: Math.round(
            e("particles.maxWork", i.particles?.maxWork, 1 / 0, { min: 0 }),
          ),
          connectDist: ~~e(
            "particles.connectDistance",
            i.particles?.connectDistance,
            150,
            { min: 1 },
          ),
          relSpeed: e("particles.relSpeed", i.particles?.relSpeed, 1, {
            min: 0,
          }),
          relSize: e("particles.relSize", i.particles?.relSize, 1, { min: 0 }),
          rotationSpeed:
            e("particles.rotationSpeed", i.particles?.rotationSpeed, 2, {
              min: 0,
            }) / 100,
        },
        gravity: {
          repulsive: e("gravity.repulsive", i.gravity?.repulsive, 0, {
            min: 0,
          }),
          pulling: e("gravity.pulling", i.gravity?.pulling, 0, { min: 0 }),
          friction: e("gravity.friction", i.gravity?.friction, 0.8, {
            min: 0,
            max: 1,
          }),
          maxVelocity: e("gravity.maxVelocity", i.gravity?.maxVelocity, 1 / 0, {
            min: 0,
          }),
        },
        debug: {
          drawGrid: !!i.debug?.drawGrid,
          drawIndexes: !!i.debug?.drawIndexes,
        },
      }),
        this.setBackground(this.option.background),
        this.setMouseConnectDistMult(i.mouse?.connectDistMult),
        this.setParticleColor(this.option.particles.color));
    }
    get options() {
      return this.option;
    }
    setBackground(t) {
      if (t) {
        if ("string" != typeof t)
          throw new TypeError("background is not a string");
        this.canvas.style.background = this.option.background = t;
      }
    }
    setMouseConnectDistMult(i) {
      const e = t("mouse.connectDistMult", i, 2 / 3, { min: 0 });
      this.option.mouse.connectDist = this.option.particles.connectDist * e;
    }
    setParticleColor(t) {
      if (((this.ctx.fillStyle = t), "#" === String(this.ctx.fillStyle)[0]))
        this.color = { hex: String(this.ctx.fillStyle), alpha: 1 };
      else {
        let t = String(this.ctx.fillStyle).split(",").at(-1);
        ((t = t?.slice(1, -1) ?? "1"),
          (this.ctx.fillStyle =
            String(this.ctx.fillStyle).split(",").slice(0, -1).join(",") +
            ", 1)"),
          (this.color = {
            hex: String(this.ctx.fillStyle),
            alpha: isNaN(+t) ? 1 : +t,
          }));
      }
    }
  }
  return (
    window.addEventListener(
      "mousemove",
      (t) => {
        for (const i of CanvasParticles.instances) i.handleMouseMove(t);
      },
      { passive: !0 },
    ),
    window.addEventListener(
      "scroll",
      () => {
        for (const t of CanvasParticles.instances) t.handleScroll();
      },
      { passive: !0 },
    ),
    CanvasParticles
  );
});
