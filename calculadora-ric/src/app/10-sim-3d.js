  function simCreate(wrap) {
    const coarse = matchMedia("(pointer:coarse)").matches, cv = wrap.querySelector("canvas"), R = new THREE.WebGLRenderer({ canvas: cv, antialias: !coarse || (window.devicePixelRatio || 1) < 2, powerPreference: "high-performance" });
    const Q = simQual(coarse), dpr = window.devicePixelRatio || 1;
    R.setPixelRatio(Math.min(Q === "baja" ? 1 : Q === "media" ? 1.5 : 2, dpr));
    if (Q === "alta") {
      R.shadowMap.enabled = true;
      R.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    const sc = new THREE.Scene(), cs = getComputedStyle(document.documentElement);
    sc.background = new THREE.Color((cs.getPropertyValue("--surface2") || "#f5f7f9").trim());
    const cam = new THREE.PerspectiveCamera(45, 1, 0.05, 150);
    sc.add(new THREE.HemisphereLight(16777215, 9082531, 0.72));
    const d1 = new THREE.DirectionalLight(16777215, 0.5);
    d1.position.set(8, 12, 10);
    if (Q === "alta") {
      d1.castShadow = true;
      d1.intensity = 0.62;
      d1.shadow.mapSize.set(2048, 2048);
      Object.assign(d1.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 45 });
      d1.shadow.bias = -6e-4;
      d1.shadow.normalBias = 0.02;
    }
    sc.add(d1);
    const d2 = new THREE.DirectionalLight(16777215, 0.22);
    d2.position.set(-6, 7, -4);
    sc.add(d2);
    const M = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85, metalness: 0 }, o || {}));
    const G = { duct: new THREE.CylinderGeometry(0.03, 0.03, 1, 8), wire: new THREE.CylinderGeometry(68e-4, 68e-4, 1, 6), hit: new THREE.CylinderGeometry(0.065, 0.065, 1, 6), joint: new THREE.SphereGeometry(0.03, 8, 6), cord: new THREE.CylinderGeometry(5e-3, 5e-3, 1, 5) };
    const MAT = { F: M(13840175), N: M(15921906), PE: M(3055172), R: M(9313051), duct: M(11187389, { transparent: true, opacity: 0.3, depthWrite: false }), sel: M(15237690, { transparent: true, opacity: 0.55, depthWrite: false, emissive: 11555370, emissiveIntensity: 0.4 }), hot: M(16757504, { emissive: 16748288, emissiveIntensity: 1 }), hit: new THREE.MeshBasicMaterial({ visible: false }), white: M(16250871), dark: M(2236962), box: M(13686234), cord: M(2236962) };
    MAT.F.color.setHex(FASE_COL[simFasePref()] || FASE_COL.rojo);
    {
      const c2 = document.createElement("canvas");
      c2.width = 64;
      c2.height = 4;
      const x2 = c2.getContext("2d");
      x2.fillStyle = "#2E9E44";
      x2.fillRect(0, 0, 64, 4);
      x2.fillStyle = "#E8C300";
      x2.fillRect(40, 0, 16, 4);
      const tPE = new THREE.CanvasTexture(c2);
      tPE.wrapS = tPE.wrapT = THREE.RepeatWrapping;
      MAT.PE = M(16777215, { map: tPE });
    }
    Object.keys(CNAME).forEach((k) => {
      if (!MAT[k]) MAT[k] = M(CNAME[k][3]);
    });
    const box = (w, h, d, m) => new THREE.Mesh(geoC("b" + w + "|" + h + "|" + d, () => new THREE.BoxGeometry(w, h, d)), m);
    const stat = [], place = [], ground = new THREE.Mesh(new THREE.PlaneGeometry(HW + 8, HD + 7), M(10465418));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(HW / 2, -0.01, HD / 2);
    sc.add(ground);
    const ftex = (kind) => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const x = c.getContext("2d");
      if (kind === "wood") {
        x.fillStyle = "#b88a5c";
        x.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 4; i++) {
          const y = i * 64;
          x.fillStyle = ["#b4855a", "#bd9063", "#ad7f52", "#b98c5f"][i];
          x.fillRect(0, y, 256, 64);
          x.strokeStyle = "rgba(70,40,20,.18)";
          for (let k = 0; k < 9; k++) {
            x.beginPath();
            const yy = y + 6 + k * 6.5;
            x.moveTo(0, yy);
            for (let t2 = 0; t2 <= 256; t2 += 32) x.lineTo(t2, yy + Math.sin((t2 + i * 40 + k * 13) / 30) * 1.6);
            x.stroke();
          }
          x.fillStyle = "rgba(60,35,15,.55)";
          x.fillRect(0, y, 256, 2);
          x.fillRect(i * 97 % 256, y, 2, 64);
        }
      } else {
        x.fillStyle = "#e9e5dc";
        x.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
          x.fillStyle = (i + j) % 2 ? "#e3ded4" : "#ece8df";
          x.fillRect(i * 64 + 2, j * 64 + 2, 60, 60);
        }
        x.fillStyle = "#b9b2a5";
        for (let i = 0; i <= 4; i++) {
          x.fillRect(i * 64 - 1, 0, 3, 256);
          x.fillRect(0, i * 64 - 1, 256, 3);
        }
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      return t;
    };
    const WOOD = ftex("wood"), TILE = ftex("tile"), FLG1 = new THREE.Group(), FG = (f) => f ? FLG1 : sc;
    sc.add(FLG1);
    ROOMS.forEach((r) => {
      if (r.f && r.t === "escalera") return;
      const wet = ["cocina", "bano", "lavadero"].includes(r.t), tx2 = (wet ? TILE : WOOD).clone();
      tx2.needsUpdate = true;
      tx2.repeat.set((r.x1 - r.x0) / (wet ? 1.2 : 1.6), (r.z1 - r.z0) / (wet ? 1.2 : 1.6));
      const f = new THREE.Mesh(new THREE.PlaneGeometry(r.x1 - r.x0, r.z1 - r.z0), new THREE.MeshStandardMaterial({ map: tx2, roughness: wet ? 0.55 : 0.8 }));
      f.rotation.x = -Math.PI / 2;
      f.position.set((r.x0 + r.x1) / 2, 5e-3 + (r.f || 0) * FH, (r.z0 + r.z1) / 2);
      f.userData = { k: "floor", room: r.id, fl: r.f || 0 };
      FG(r.f).add(f);
      place.push(f);
    });
    ROOMS.forEach((r) => {
      const z = bathZone(r);
      if (!z) return;
      const w = z.x1 - z.x0, l = z.z1 - z.z0, cx = (z.x0 + z.x1) / 2, cz = (z.z0 + z.z1) / 2, oy = (r.f || 0) * FH, g2 = FG(r.f);
      const tr = box(w, 0.06, l, M(16777215));
      tr.position.set(cx, 0.03 + oy, cz);
      g2.add(tr);
      const v1 = box(w, 2.25, l, M(4433868, { transparent: true, opacity: 0.16, depthWrite: false }));
      v1.position.set(cx, 1.125 + oy, cz);
      g2.add(v1);
      const e0 = Math.max(r.x0, z.x0 - 0.6), e1 = Math.min(r.x1, z.x1 + 0.6), f0 = Math.max(r.z0, z.z0 - 0.6), f1 = Math.min(r.z1, z.z1 + 0.6);
      const v2 = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(e1 - e0, 2.25, f1 - f0)), new THREE.LineBasicMaterial({ color: 15237690, transparent: true, opacity: 0.6 }));
      v2.position.set((e0 + e1) / 2, 1.125 + oy, (f0 + f1) / 2);
      g2.add(v2);
      const sh = box(0.02, 1.9, l, M(13689855, { transparent: true, opacity: 0.25, depthWrite: false }));
      sh.position.set(z.x0 > r.x0 + 0.01 ? z.x0 : z.x1, 0.95 + oy, cz);
      g2.add(sh);
    });
    const boardM = M(13212506, { roughness: 0.85 }), wallM = M(15986663, { transparent: true, opacity: 0.32, depthWrite: false }), ceilM = M(16513782, { transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
    ROOMS.forEach((r) => {
      if (NFL > 1 && !r.f && r.t === "escalera" || PANEL) return;
      const c = new THREE.Mesh(new THREE.PlaneGeometry(r.x1 - r.x0, r.z1 - r.z0), ceilM);
      c.rotation.x = Math.PI / 2;
      c.position.set((r.x0 + r.x1) / 2, WH + (r.f || 0) * FH, (r.z0 + r.z1) / 2);
      c.userData = { k: "ceil", room: r.id, fl: r.f || 0 };
      c.renderOrder = 1;
      FG(r.f).add(c);
      place.push(c);
    });
    WALLS.forEach((wa) => {
      const [x0, z0, x1, z1, wt] = wa, wf = wa.f || 0;
      if (PANEL && !(Math.abs(z0) < 0.01 && Math.abs(z1) < 0.01)) return;
      const lx = Math.abs(x1 - x0), lz = Math.abs(z1 - z0), t = wt || 0.12, w = box(lx > 0 ? lx + t : t, WH, lz > 0 ? lz + t : t, PANEL ? boardM : wallM);
      w.position.set((x0 + x1) / 2, WH / 2 + wf * FH, (z0 + z1) / 2);
      w.userData = { k: "wall", t, fl: wf };
      w.renderOrder = 1;
      FG(wf).add(w);
      place.push(w);
    });
    const zoc = M(8019008), frm = M(10188371);
    if (PANEL) {
      [0.04, HW - 0.04].forEach((x) => {
        const leg = box(0.07, WH + 0.1, 0.07, M(9067569));
        leg.position.set(x, WH / 2, -0.08);
        sc.add(leg);
      });
      const fl2 = new THREE.Mesh(new THREE.PlaneGeometry(HW + 3, 7), M(11908533, { roughness: 0.95 }));
      fl2.rotation.x = -Math.PI / 2;
      fl2.position.set(HW / 2, 3e-3, 3.5);
      sc.add(fl2);
      const tit = txtSprite("Panel de pr\xE1ctica", { fixed: true, h: 0.035 });
      tit.position.set(HW / 2, WH + 0.15, 0.05);
      sc.add(tit);
    } else WALLS.forEach((wa) => {
      const [x0, z0, x1, z1, wt] = wa, wf = wa.f || 0;
      const lx = Math.abs(x1 - x0), lz = Math.abs(z1 - z0), t = (wt || 0.12) + 0.03, b = box(lx > 0 ? lx : t, 0.08, lz > 0 ? lz : t, zoc);
      b.position.set((x0 + x1) / 2, 0.04 + wf * FH, (z0 + z1) / 2);
      FG(wf).add(b);
    });
    DOORS.forEach(([ax, v, m0, m1, df]) => {
      const L = m1 - m0, mid = (m0 + m1) / 2, hd = WH - 2.08, sc = FG(df), oy = (df || 0) * FH;
      const top = box(ax === "x" ? 0.12 : L, hd, ax === "x" ? L : 0.12, wallM);
      top.position.set(ax === "x" ? v : mid, 2.08 + hd / 2 + oy, ax === "x" ? mid : v);
      top.renderOrder = 1;
      sc.add(top);
      const li = box(ax === "x" ? 0.15 : L + 0.1, 0.07, ax === "x" ? L + 0.1 : 0.15, frm);
      li.position.set(ax === "x" ? v : mid, 2.05 + oy, ax === "x" ? mid : v);
      sc.add(li);
      [m0, m1].forEach((m) => {
        const j = box(ax === "x" ? 0.15 : 0.05, 2.05, ax === "x" ? 0.05 : 0.15, frm);
        j.position.set(ax === "x" ? v : m, 1.025 + oy, ax === "x" ? m : v);
        sc.add(j);
      });
    });
    if (NFL > 1) {
      const slabM = M(12105912, { transparent: true, opacity: 0.55 }), stepM = M(11053224), railM = M(5592405);
      ROOMS.filter((r) => r.f === 1 && r.t !== "escalera").forEach((r) => {
        const sl = box(r.x1 - r.x0, FH - WH - 0.01, r.z1 - r.z0, slabM);
        sl.position.set((r.x0 + r.x1) / 2, (WH + FH) / 2, (r.z0 + r.z1) / 2);
        FLG1.add(sl);
      });
      ROOMS.filter((r) => !r.f && r.t === "escalera").forEach((r) => {
        const m = stairModel(r);
        m.steps.forEach((st) => {
          const h = st.slab ? 0.05 : st.top, b2 = box(st.w, h, st.l, stepM);
          b2.position.set(st.x, st.top - h / 2, st.z);
          b2.rotation.y = st.ry || 0;
          sc.add(b2);
          if (!st.slab) {
            const ns = box(st.w + 0.01, 0.012, st.l + 0.01, railM);
            ns.position.set(st.x, st.top + 6e-3, st.z);
            sc.add(ns);
          }
        });
        if (m.spiral) {
          const po = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, FH + 0.9, 12), railM);
          po.position.set(m.spiral.cx, (FH + 0.9) / 2, m.spiral.cz);
          sc.add(po);
          m.steps.forEach((st, i) => {
            if (i % 2) return;
            const a = -st.ry, R = m.spiral.R, b3 = box(0.025, 0.9, 0.025, railM);
            b3.position.set(m.spiral.cx + Math.cos(a) * (R - 0.04), st.top + 0.45, m.spiral.cz + Math.sin(a) * (R - 0.04));
            sc.add(b3);
          });
        } else if (m.rail) {
          const { az, neg, L, Wd } = m.rail, HL = Math.hypot(L, FH), rl = box(az ? 0.045 : HL, 0.045, az ? HL : 0.045, railM), ang = Math.atan2(FH, L), sx = r.x0 + 0.05 + Wd + 0.02, sz = r.z0 + 0.05 + Wd + 0.02;
          rl.position.set(az ? sx : neg ? r.x1 - 0.15 - L / 2 : r.x0 + 0.15 + L / 2, FH / 2 + 0.9, az ? neg ? r.z1 - 0.15 - L / 2 : r.z0 + 0.15 + L / 2 : sz);
          if (az) rl.rotation.x = neg ? ang : -ang;
          else rl.rotation.z = neg ? -ang : ang;
          sc.add(rl);
          m.steps.forEach((st, i) => {
            if (i % 3 !== 1) return;
            const po = box(0.03, 0.9, 0.03, railM);
            po.position.set(az ? sx : st.x, st.top + 0.45, az ? st.z : sz);
            sc.add(po);
          });
        }
      });
    }
    const med = box(0.34, 0.48, 0.16, M(14014684));
    med.position.set(TX - 1, 1.5, -0.14);
    med.userData = { k: "medidor" };
    sc.add(med);
    stat.push(med);
    const lm = txtSprite("Medidor", { fixed: true, h: 0.03 });
    lm.position.set(TX - 1, 1.86, -0.2);
    sc.add(lm);
    const cam2 = box(0.36, 0.04, 0.36, M(9410204));
    cam2.position.set(TX - 1.4, 0.02, -0.9);
    cam2.userData = { k: "rod" };
    sc.add(cam2);
    stat.push(cam2);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.28, 10), M(13137203, { metalness: 0.6, roughness: 0.4 }));
    rod.position.set(TX - 1.4, 0.14, -0.9);
    rod.userData = { k: "rod" };
    sc.add(rod);
    stat.push(rod);
    const lr = txtSprite("Tierra", { fixed: true, h: 0.03 });
    lr.position.set(TX - 1.4, 0.45, -0.9);
    sc.add(lr);
    const mk = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), new THREE.MeshBasicMaterial({ color: 14826797, depthTest: false }));
    mk.renderOrder = 12;
    mk.visible = false;
    sc.add(mk);
    const ghost = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), new THREE.MeshBasicMaterial({ color: 15237690, transparent: true, opacity: 0.6, depthTest: false }));
    ghost.visible = false;
    ghost.renderOrder = 12;
    sc.add(ghost);
    const dyn = new THREE.Group();
    sc.add(dyn);
    const V = { R, sc, cam, dyn, stat, place, pick: [], mk, ghost, M, G, MAT, box, wallM, ceilM, labels: false, glow: glowTex(), tmp: [], dirty: true, raf: 0, FLG1 };
    V.shadows = Q === "alta";
    V.applyFl = () => {
      FLG1.visible = flVis(1);
      const sm = S.sim2, by = new Map(sm.items.map((i) => [i.id, i]));
      dyn.traverse((o) => {
        const u = o.userData;
        if (u && (u.k === "item" || u.k === "edge") && u.id != null) {
          const it = by.get(u.id);
          if (it) o.visible = flVis(flY(it.p[1]));
        }
      });
      (V.rl || []).forEach((o) => {
        if (!flVis(o.r.f || 0)) o.sp.visible = false;
      });
      V.dirty = true;
    };
    V.setCut = (h) => {
      R.localClippingEnabled = true;
      V.cutH = h;
      const cp = h == null ? [] : [new THREE.Plane(new THREE.Vector3(0, -1, 0), h + (NFL > 1 && simFl > 0 ? FH : 0))];
      wallM.clippingPlanes = cp;
      ceilM.clippingPlanes = cp;
      wallM.needsUpdate = true;
      ceilM.needsUpdate = true;
      V.dirty = true;
    };
    V.HM = {};
    V.rl = [];
    V.okAt = (x, z) => okAt(x, z);
    V.updRL = () => {
      const wk = V.mode === "walk", far = !wk && V.c.rad > 8.5, wf = simFl > 0 ? 1 : 0, inr = wk ? roomOf(V.w.x, V.w.z, wf) : roomOf(V.c.x, V.c.z, wf);
      V.rl.forEach((o) => {
        o.sp.visible = flVis(o.r.f || 0) && (far || o.r === inr || o.err);
      });
    };
    V.c = { th: 0.55, ph: 0.85, rad: 15 * Math.max(1, Math.max(HW, HD) / 10), x: HW / 2, y: 0.6, z: HD / 2 };
    V.g = Object.assign({}, V.c);
    V.mode = "orbit";
    V.w = { x: TX + 0.8, z: 2, yaw: Math.PI, pit: -0.08 };
    V.wg = Object.assign({}, V.w);
    V.joy = { x: 0, y: 0 };
    V.keys = /* @__PURE__ */ new Set();
    const EY = 1.55;
    const mmap = wrap.querySelector("#mmp");
    let mmT = 0;
    const updMap = () => {
      if (!mmap) return;
      const wk = V.mode === "walk", x = wk ? V.w.x : V.c.x, z = wk ? V.w.z : V.c.z, yw = wk ? V.w.yaw : V.c.th + Math.PI;
      mmap.setAttribute("transform", "translate(".concat(x.toFixed(2), " ").concat(z.toFixed(2), ") rotate(").concat((-yw * 180 / Math.PI).toFixed(1), ")"));
      const inr = roomOf(x, z);
      wrap.querySelectorAll("#simmap [data-r]").forEach((e) => e.classList.toggle("here", !!inr && e.dataset.r === inr.id));
    };
    const apply = () => {
      if (V.mode === "walk") {
        const w = V.w, cp = Math.cos(w.pit);
        const ey = EY + (simFl > 0 ? FH : 0);
        cam.position.set(w.x, ey, w.z);
        cam.lookAt(w.x + Math.sin(w.yaw) * cp, ey + Math.sin(w.pit), w.z + Math.cos(w.yaw) * cp);
      } else {
        const c = V.c, sp = Math.sin(c.ph);
        cam.position.set(c.x + c.rad * sp * Math.sin(c.th), c.y + c.rad * Math.cos(c.ph), c.z + c.rad * sp * Math.cos(c.th));
        cam.lookAt(c.x, c.y, c.z);
      }
      V.updRL();
      const now = performance.now();
      if (now - mmT > 60) {
        mmT = now;
        updMap();
      }
      V.dirty = true;
    };
    const segD = (x, z, a) => {
      const dx = a[2] - a[0], dz = a[3] - a[1], L2 = dx * dx + dz * dz;
      let t = L2 ? ((x - a[0]) * dx + (z - a[1]) * dz) / L2 : 0;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz);
    };
    const okAt = (x, z) => {
      if (PANEL) return x > -1.2 && x < HW + 1.2 && z > 0.45 && z < 7;
      const wf = simFl > 0 ? 1 : 0;
      return x > 0.2 && x < HW - 0.2 && z > 0.2 && z < HD - 0.2 && !!roomOf(x, z, wf) && (roomOf(x, z, wf) || {}).t !== "escalera" && WALLS.every((a) => (a.f || 0) !== wf || segD(x, z, a) > 0.18);
    };
    const wMove = (o, dx, dz) => {
      const n = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.05));
      for (let i = 0; i < n; i++) {
        const sx = dx / n, sz = dz / n;
        if (okAt(o.x + sx, o.z + sz)) {
          o.x += sx;
          o.z += sz;
        } else if (okAt(o.x + sx, o.z)) o.x += sx;
        else if (okAt(o.x, o.z + sz)) o.z += sz;
        else break;
      }
    };
    const nYaw = (cur2, t) => cur2 + (((t - cur2) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
    V.wTo = (o) => {
      if (o.yaw != null) o.yaw = nYaw(V.wg.yaw, o.yaw);
      if (o.pit != null) o.pit = Math.max(-0.9, Math.min(0.9, o.pit));
      const far = o.x != null && Math.hypot(o.x - V.w.x, o.z - V.w.z) > 1;
      Object.assign(V.wg, o);
      if (far) {
        Object.assign(V.w, V.wg);
        apply();
        const fd = wrap.querySelector("#simfade");
        if (fd) {
          fd.classList.remove("on");
          void fd.offsetWidth;
          fd.classList.add("on");
        }
      }
    };
    V.wStep = (f, st) => {
      const y = V.wg.yaw;
      wMove(V.wg, Math.sin(y) * f - Math.cos(y) * st, Math.cos(y) * f + Math.sin(y) * st);
    };
    V.setMode = (m) => {
      if (m === V.mode) return;
      if (m === "walk") {
        let x = V.c.x, z = V.c.z, yaw = V.c.th + Math.PI;
        const rm = roomOf(x, z);
        if (PANEL) {
          x = Math.max(0.5, Math.min(HW - 0.5, V.c.x));
          z = 2.6;
          yaw = Math.PI;
        } else if (V.c.rad > 8 || !rm || !okAt(x, z)) {
          const r0 = roomOf(TX, 0.5) || ROOMS[0];
          x = (r0.x0 + r0.x1) / 2;
          z = (r0.z0 + r0.z1) / 2;
          yaw = Math.PI + 0.25;
        }
        V.w = { x, z, yaw, pit: -0.1 };
        V.wg = Object.assign({}, V.w);
        cam.fov = 68;
      } else {
        const y = V.w.yaw;
        cam.fov = 45;
        V.mode = "orbit";
        V.set({ x: V.w.x + Math.sin(y) * 1.2, y: 0.8, z: V.w.z + Math.cos(y) * 1.2, th: y + Math.PI, ph: 0.6, rad: 4.5 });
        V.offs ? V.offs() : cam.updateProjectionMatrix();
        apply();
        return;
      }
      V.mode = m;
      V.offs ? V.offs() : cam.updateProjectionMatrix();
      apply();
    };
    const clampG = () => {
      const g = V.g;
      g.ph = Math.min(1.52, Math.max(0.04, g.ph));
      g.rad = Math.min(32 * Math.max(1, Math.max(HW, HD) / 10), Math.max(1, g.rad));
      g.x = Math.min(HW + 3, Math.max(-3, g.x));
      g.z = Math.min(HD + 3, Math.max(-3, g.z));
      g.y = Math.min(3 + (NFL > 1 ? FH : 0), Math.max(0, g.y));
    };
    V.set = (o, instant) => {
      Object.assign(V.g, o);
      clampG();
      if (instant) {
        Object.assign(V.c, V.g);
        apply();
      }
    };
    V.offs = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (PANEL && V.mode !== "walk" && w && h && w / h < 0.9) cam.setViewOffset(w, h, 0, Math.round(h * 0.2), w, h);
      else cam.clearViewOffset();
    };
    V.view = (k) => {
      if (PANEL && (k === "g" || k === "p")) {
        if (V.mode === "walk") simSetMode("orbit");
        const tv = Math.tan(cam.fov * Math.PI / 360), asp = cam.aspect || 1.5, th2 = tv * asp, rd2 = Math.min(18, Math.max((WH / 2 + 0.45) / (tv * (asp < 0.9 ? 0.6 : 1)), (HW / 2 + 0.6) / th2));
        V.offs();
        V.set({ x: HW / 2, y: 1.25, z: 0.1, th: 0, ph: 1.45, rad: rd2 });
        return;
      }
      if (V.mode === "walk") {
        if (PANEL && k !== "t") {
          V.wTo({ x: HW / 2, z: 2.8, yaw: Math.PI, pit: -0.05 });
          return;
        }
        if (k === "t") {
          const hf = Math.tan(cam.fov * Math.PI / 360) * (cam.aspect || 1), d = Math.min(2.6, Math.max(0.9, (tabW(S.sim2) / 2 + 0.12) / hf));
          V.wTo({ x: TX, z: d, yaw: Math.PI, pit: -0.04 });
          return;
        }
        const r = ROOMS.find((q) => q.id === k);
        if (r && NFL > 1 && (r.f || 0) !== (simFl > 0 ? 1 : 0)) simSetFl(r.f || 0);
        if (r) {
          const cs2 = [[r.x0 + 0.45, r.z0 + 0.45], [r.x1 - 0.45, r.z0 + 0.45], [r.x0 + 0.45, r.z1 - 0.45], [r.x1 - 0.45, r.z1 - 0.45]].filter((c2) => okAt(c2[0], c2[1]));
          const c = (cs2.length ? cs2 : [[(r.x0 + r.x1) / 2, (r.z0 + r.z1) / 2]]).sort((a, b) => Math.hypot(a[0] - V.w.x, a[1] - V.w.z) - Math.hypot(b[0] - V.w.x, b[1] - V.w.z))[0];
          const ox = r.x0 + r.x1 - c[0], oz = r.z0 + r.z1 - c[1];
          V.wTo({ x: c[0], z: c[1], yaw: Math.atan2(ox - c[0], oz - c[1]), pit: -0.2 });
          return;
        }
        if (simMode !== "orbit") simSetMode("orbit");
      }
      const fit = Math.max(1, Math.min(1.7, 1.3 / (cam.aspect || 1.5)));
      const oyv = NFL > 1 && simFl > 0 ? FH : 0;
      if (k === "t" && simFl > 0) simSetFl(0);
      if (k === "t") V.set({ x: TX, y: simConn ? 1.42 : 1.5, z: 0.1, th: 0, ph: 1.5, rad: (simConn ? 1.8 : 1.55) * fit });
      else if (k === "p") V.set({ x: HW / 2, y: oyv, z: HD / 2, th: 0, ph: 0.05, rad: 14 * fit * Math.max(0.7, Math.max(HW / 10, HD / 7)) });
      else if (k === "g") V.set({ x: HW / 2, y: 0.6 + (NFL > 1 && simFl < 0 ? FH * 0.5 : oyv), z: HD / 2, th: 0.55, ph: 0.85, rad: 15 * fit * Math.max(0.7, Math.max(HW / 10, HD / 7)) });
      else {
        const r = ROOMS.find((q) => q.id === k);
        if (r && NFL > 1 && simFl >= 0 && (r.f || 0) !== simFl) simSetFl(r.f || 0);
        if (r) V.set({ x: (r.x0 + r.x1) / 2, y: 0.6 + (r.f || 0) * FH, z: (r.z0 + r.z1) / 2, th: 0.35, ph: 0.5, rad: (Math.max(r.x1 - r.x0, r.z1 - r.z0) * 1.1 + 3.2) * fit });
      }
    };
    V.focus = (p) => {
      if (V.mode === "walk") {
        V.wTo({ yaw: Math.atan2(p.x - V.w.x, p.z - V.w.z), pit: Math.atan2(p.y - EY - (simFl > 0 ? FH : 0), Math.hypot(p.x - V.w.x, p.z - V.w.z)) });
        return;
      }
      V.set({ x: p.x, y: Math.min(2 + flY(p.y) * FH, p.y), z: p.z, rad: Math.min(V.g.rad, 4) });
    };
    V.zoom = (f) => {
      if (V.mode === "walk") {
        V.wStep(f < 1 ? 0.6 : -0.6, 0);
        return;
      }
      V.set({ rad: V.g.rad * f });
    };
    V.rot = (a) => {
      if (V.mode === "walk") {
        V.wTo({ yaw: V.wg.yaw + a });
        return;
      }
      V.set({ th: V.g.th + a });
    };
    V.tilt = (a) => {
      if (V.mode === "walk") {
        V.wTo({ pit: V.wg.pit - a * 0.8 });
        return;
      }
      V.set({ ph: V.g.ph + a });
    };
    V.pan = (dx, dy) => {
      if (V.mode === "walk") {
        V.wStep(dy * 4e-3, dx * 4e-3);
        return;
      }
      const k = V.g.rad * 18e-4, th = V.g.th, rx = Math.cos(th), rz = -Math.sin(th), fx = -Math.sin(th), fz = -Math.cos(th);
      V.set({ x: V.g.x - rx * dx * k + fx * dy * k, z: V.g.z - rz * dx * k + fz * dy * k }, true);
    };
    const size = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      R.setSize(w, h, false);
      cam.aspect = w / h;
      V.offs();
      V.dirty = true;
    };
    const ro = new ResizeObserver(size);
    ro.observe(wrap);
    size();
    V.view("g");
    Object.assign(V.c, V.g);
    apply();
    const rc = new THREE.Raycaster(), v2 = new THREE.Vector2();
    const cast = (cx, cy, list) => {
      const r = cv.getBoundingClientRect();
      v2.set((cx - r.left) / r.width * 2 - 1, -(cy - r.top) / r.height * 2 + 1);
      rc.setFromCamera(v2, cam);
      return rc.intersectObjects(list, true).filter((h) => {
        for (let o = h.object; o; o = o.parent) if (!o.visible) return false;
        return true;
      });
    };
    const pickAt = (cx, cy) => {
      var _a;
      if (simTool === "place" && simPT === "reg") {
        const tp = V.pick.filter((o) => o.userData && o.userData.k === "tab"), h = cast(cx, cy, tp)[0];
        return h ? { k: "regpos", p: [h.point.x, h.point.y, h.point.z] } : null;
      }
      if (simTool === "place") {
        const KS = simPT === "lamp" ? PANEL || simPV.lamp === "pm" ? ["wall"] : ["floor", "ceil"] : simPT === "box" ? ["wall", "ceil"] : ["wall"];
        for (const h of cast(cx, cy, V.place.filter((o) => KS.includes(o.userData.k) && flPick(o.userData.fl || 0) && (o.userData.k !== "ceil" || simCeil > 0)))) {
          const u = h.object.userData, hf = u.fl || 0;
          if (u.k === "ceil") return { k: "ceil", p: [h.point.x, WH + hf * FH, h.point.z], n: [0, -1, 0] };
          if (u.k === "wall") {
            const n = h.face.normal;
            if (Math.abs(n.y) > 0.5) continue;
            const nx = Math.round(n.x), nz = Math.round(n.z), px = h.point.x, pz = h.point.z;
            if (roomOf(px + nx * 0.3, pz + nz * 0.3, hf)) return { k: "wall", p: [px + nx * 6e-3, h.point.y, pz + nz * 6e-3], n: [nx, 0, nz] };
            if (roomOf(px - nx * 0.42, pz - nz * 0.42, hf)) {
              const tt = (u.t || 0.12) + 6e-3;
              return { k: "wall", p: [px - nx * tt, h.point.y, pz - nz * tt], n: [-nx, 0, -nz] };
            }
            continue;
          }
          if (u.k === "floor") return { k: "floor", p: [h.point.x, hf * FH, h.point.z] };
        }
        return null;
      }
      if (simTool === "route" && simRoute != null) {
        for (const h of cast(cx, cy, V.place)) {
          const u = h.object.userData, sn = (v) => Math.round(v * 20) / 20;
          if (u.k === "wall") {
            const n = h.face.normal;
            if (Math.abs(n.y) > 0.5) continue;
            const nx = Math.round(n.x), nz = Math.round(n.z), px = h.point.x, pz = h.point.z, yy = Math.min(YC, Math.max(0.15, sn(h.point.y)));
            if (roomOf(px + nx * 0.3, pz + nz * 0.3)) return { k: "rpt", p: [nx ? px + nx * 0.03 : sn(px), yy, nz ? pz + nz * 0.03 : sn(pz)] };
            if (roomOf(px - nx * 0.42, pz - nz * 0.42)) return { k: "rpt", p: [nx ? px - nx * 0.15 : sn(px), yy, nz ? pz - nz * 0.15 : sn(pz)] };
            continue;
          }
          if (u.k === "floor") return { k: "rpt", p: [sn(h.point.x), YC, sn(h.point.z)] };
        }
        return null;
      }
      if (simTool === "look") {
        const hs = cast(cx, cy, V.pick.concat(V.stat, V.place));
        return hs[0] ? { k: "look", pt: hs[0].point } : null;
      }
      if (simTool === "wire") {
        for (const h of cast(cx, cy, V.pick.concat(V.stat))) {
          let o = h.object;
          while (o && !o.userData.k) o = o.parent;
          if (o && (o.userData.k === "item" || o.userData.k === "tm")) {
            mk.position.copy(h.point);
            mk.visible = true;
            V.dirty = true;
            return o.userData;
          }
        }
        return null;
      }
      const RK = { item: 0, gen: 1, dr: 1, tm: 1, rod: 2, medidor: 2, edge: 3, alim: 3, tab: 4 };
      let best = null, d0 = null;
      for (const h of cast(cx, cy, V.pick.concat(V.stat))) {
        let o = h.object;
        while (o && !o.userData.k) o = o.parent;
        if (!o) continue;
        if (d0 == null) d0 = h.distance;
        if (h.distance > d0 + 1.2) break;
        const r = (_a = RK[o.userData.k]) != null ? _a : 5;
        if (!best || r < best.r) best = { r, o, h };
      }
      if (best) {
        mk.position.copy(best.h.point);
        mk.visible = true;
        V.dirty = true;
        return best.o.userData;
      }
      return null;
    };
    const P = /* @__PURE__ */ new Map();
    let moved = 0, pinch = 0, lpT = 0, lpDone = false, lastTap = 0, lastXY = [0, 0];
    const pickAs = (t, cx, cy) => {
      const o = simTool;
      simTool = t;
      try {
        return pickAt(cx, cy);
      } finally {
        simTool = o;
      }
    };
    cv.addEventListener("pointerdown", (e) => {
      cv.setPointerCapture(e.pointerId);
      P.set(e.pointerId, { x: e.clientX, y: e.clientY, b: e.button });
      moved = 0;
      lpDone = false;
      ghost.visible = false;
      if (P.size === 2) {
        const a = [...P.values()];
        pinch = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
      }
      clearTimeout(lpT);
      if (P.size === 1 && e.button !== 2) {
        const cx = e.clientX, cy = e.clientY;
        lpT = setTimeout(() => {
          if (moved >= 8 || P.size !== 1) return;
          const ud = pickAs("info", cx, cy);
          if (!ud) return;
          lpDone = true;
          try {
            navigator.vibrate && navigator.vibrate(12);
          } catch (x) {
          }
          simIdentify(ud);
        }, 520);
      }
    });
    cv.addEventListener("pointermove", (e) => {
      const p = P.get(e.pointerId);
      if (!p) {
        if (simTool === "place" && e.pointerType === "mouse") {
          const h = pickAt(e.clientX, e.clientY);
          if (h && h.k !== "regpos" && (simPT === "lamp" && !(PANEL || simPV.lamp === "pm")) === (h.k === "floor")) {
            ghost.position.set(h.p[0], PANEL || simPT === "lamp" && simPV.lamp === "pm" ? h.p[1] : (simPT === "lamp" ? 2.42 : T_Y[simPT] || 0.3) + flY(h.p[1]) * FH, h.p[2]);
            ghost.visible = true;
          } else ghost.visible = false;
          V.dirty = true;
        }
        return;
      }
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      moved += Math.abs(dx) + Math.abs(dy);
      if (V.mode === "walk") {
        if (P.size === 1) {
          const w = { yaw: V.w.yaw - dx * 32e-4, pit: Math.max(-0.9, Math.min(0.9, V.w.pit - dy * 26e-4)) };
          Object.assign(V.w, w);
          Object.assign(V.wg, w);
          apply();
        } else if (P.size === 2) {
          p.x = e.clientX;
          p.y = e.clientY;
          const a = [...P.values()], d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
          if (pinch && d) {
            const y = V.w.yaw, f = (d - pinch) * 0.01;
            wMove(V.w, Math.sin(y) * f, Math.cos(y) * f);
            V.wg.x = V.w.x;
            V.wg.z = V.w.z;
            apply();
          }
          pinch = d;
          return;
        }
        p.x = e.clientX;
        p.y = e.clientY;
        return;
      }
      if (P.size === 1) {
        if (p.b === 2 || e.shiftKey) V.pan(dx, dy);
        else {
          V.set({ th: V.g.th - dx * 6e-3, ph: V.g.ph - dy * 5e-3 }, true);
        }
      } else if (P.size === 2) {
        p.x = e.clientX;
        p.y = e.clientY;
        const a = [...P.values()], d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
        if (pinch && d) {
          V.set({ rad: V.g.rad * pinch / d }, true);
        }
        pinch = d;
        V.pan(dx / 2, dy / 2);
        return;
      }
      p.x = e.clientX;
      p.y = e.clientY;
    });
    const up = (e) => {
      const p = P.get(e.pointerId);
      if (!p) return;
      clearTimeout(lpT);
      P.delete(e.pointerId);
      if (P.size < 2) pinch = 0;
      if (lpDone) {
        lpDone = false;
        return;
      }
      if (e.type === "pointerup" && moved < 8 && P.size === 0 && p.b !== 2) {
        const ud = pickAt(e.clientX, e.clientY);
        if (ud) simClick(ud);
        else {
          const now = performance.now(), dbl = now - lastTap < 330 && Math.hypot(e.clientX - lastXY[0], e.clientY - lastXY[1]) < 40;
          lastTap = now;
          lastXY = [e.clientX, e.clientY];
          if (dbl && simTool !== "place") {
            const lk = pickAs("look", e.clientX, e.clientY);
            if (lk && lk.pt) V.focus(lk.pt);
          } else if (simTool !== "place" && simTool !== "look") simShowHud(null);
        }
      }
    };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("contextmenu", (e) => e.preventDefault());
    cv.addEventListener("pointerleave", () => {
      if (ghost.visible) {
        ghost.visible = false;
        V.dirty = true;
      }
    });
    cv.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (V.mode === "walk") {
        V.wStep(e.deltaY > 0 ? -0.3 : 0.3, 0);
        return;
      }
      V.zoom(e.deltaY > 0 ? 1.12 : 0.89);
    }, { passive: false });
    V.updMap = updMap;
    const WK = { w: "f", W: "f", ArrowUp: "f", s: "b", S: "b", ArrowDown: "b", a: "l", A: "l", d: "r", D: "r", ArrowLeft: "tl", ArrowRight: "tr" };
    wrap.addEventListener("keyup", (e) => {
      if (WK[e.key]) V.keys.delete(WK[e.key]);
    });
    wrap.addEventListener("blur", () => V.keys.clear());
    const joy = wrap.querySelector("#simjoy");
    if (joy) {
      const kn = joy.querySelector(".jk");
      let jid = null;
      const jset = (e) => {
        const r = joy.getBoundingClientRect(), R2 = r.width / 2;
        let x = (e.clientX - r.left - R2) / R2, y = (e.clientY - r.top - R2) / R2;
        const m = Math.hypot(x, y);
        if (m > 1) {
          x /= m;
          y /= m;
        }
        V.joy = { x, y };
        kn.style.transform = "translate(".concat(x * R2 * 0.6, "px,").concat(y * R2 * 0.6, "px)");
      };
      joy.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        jid = e.pointerId;
        joy.setPointerCapture(jid);
        jset(e);
      });
      joy.addEventListener("pointermove", (e) => {
        if (e.pointerId === jid) jset(e);
      });
      const jup = (e) => {
        if (e.pointerId !== jid) return;
        jid = null;
        V.joy = { x: 0, y: 0 };
        kn.style.transform = "";
      };
      joy.addEventListener("pointerup", jup);
      joy.addEventListener("pointercancel", jup);
    }
    wrap.addEventListener("keydown", (e) => {
      if (e.target.tagName === "SELECT") return;
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        simUndoDo();
        return;
      }
      if (V.mode === "walk" && WK[e.key]) {
        e.preventDefault();
        V.keys.add(WK[e.key]);
        return;
      }
      const k = e.key, m = { ArrowLeft: [40, 0], a: [40, 0], A: [40, 0], ArrowRight: [-40, 0], d: [-40, 0], D: [-40, 0], ArrowUp: [0, 40], w: [0, 40], W: [0, 40], ArrowDown: [0, -40], s: [0, -40], S: [0, -40] };
      if (m[k]) {
        e.preventDefault();
        V.pan(m[k][0], m[k][1]);
      } else if (k === "+" || k === "=") {
        V.zoom(0.85);
      } else if (k === "-") {
        V.zoom(1.18);
      } else if (k === "q" || k === "Q") {
        V.rot(0.3);
      } else if (k === "e" || k === "E") {
        V.rot(-0.3);
      }
    });
    let lt = performance.now();
    const loop = () => {
      V.raf = requestAnimationFrame(loop);
      const now = performance.now(), dt = Math.min(0.1, (now - lt) / 1e3), f = 1 - Math.exp(-dt * 11);
      lt = now;
      let mv = false;
      if (V.mode === "walk") {
        const K = V.keys, fw = -V.joy.y + (K.has("f") ? 1 : 0) - (K.has("b") ? 1 : 0), st = V.joy.x + (K.has("r") ? 1 : 0) - (K.has("l") ? 1 : 0), tr = (K.has("tr") ? 1 : 0) - (K.has("tl") ? 1 : 0);
        if (tr) {
          V.w.yaw += tr * dt * 1.8;
          V.wg.yaw = V.w.yaw;
          mv = true;
        }
        if (Math.abs(fw) > 0.05 || Math.abs(st) > 0.05) {
          const sp = 1.7 * dt, y = V.w.yaw;
          wMove(V.w, (Math.sin(y) * fw - Math.cos(y) * st) * sp, (Math.cos(y) * fw + Math.sin(y) * st) * sp);
          V.wg.x = V.w.x;
          V.wg.z = V.w.z;
          mv = true;
        }
        for (const k in V.wg) {
          const d = V.wg[k] - V.w[k];
          if (Math.abs(d) > 1e-4) {
            V.w[k] = Math.abs(d) < 2e-3 ? V.wg[k] : V.w[k] + d * f;
            mv = true;
          }
        }
      } else for (const k in V.g) {
        const d = V.g[k] - V.c[k];
        if (Math.abs(d) > 1e-4) {
          V.c[k] = Math.abs(d) < 2e-3 ? V.g[k] : V.c[k] + d * f;
          mv = true;
        }
      }
      if (mv) apply();
      if (V.dirty) {
        V.dirty = false;
        const t0 = performance.now();
        R.render(sc, cam);
        const dtR = performance.now() - t0;
        V.slow = dtR > 28 ? (V.slow || 0) + 1 : Math.max(0, (V.slow || 0) - 1);
        if (V.slow > 18 && R.getPixelRatio() > 1) {
          V.slow = 0;
          R.setPixelRatio(Math.max(1, R.getPixelRatio() - 0.25));
          size();
        }
      }
    };
    loop();
    V.dispose = () => {
      cancelAnimationFrame(V.raf);
      ro.disconnect();
      sc.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      V.tmp.forEach((x) => x.dispose && x.dispose());
      R.dispose();
      if (R.forceContextLoss) R.forceContextLoss();
    };
    if (V.shadows) sc.traverse((o) => {
      if (o.isMesh && !(o.material && o.material.transparent)) {
        o.castShadow = !(o.geometry && /Cylinder|Sphere|Tube/.test(o.geometry.type));
        o.receiveShadow = true;
      }
    });
    return V;
  }
  function simBuild() {
    if (!SIMV) return;
    const V = SIMV, s = S.sim2, ev = simEval(s), { M, G, MAT, box } = V, g = V.dyn, V3 = THREE.Vector3, UPV = new V3(0, 1, 0);
    V.tmp.forEach((x) => x.dispose && x.dispose());
    V.tmp = [];
    g.traverse((o) => {
      if (o.geometry && !o.geometry.userData.keep && !Object.values(G).includes(o.geometry)) o.geometry.dispose();
    });
    while (g.children.length) g.remove(g.children[0]);
    V.pick = [];
    const tm = (m) => {
      V.tmp.push(m);
      if (m.map) V.tmp.push(m.map);
      return m;
    };
    const errs = simErrs(s), eItem = new Set(errs.filter((o) => o.id != null).map((o) => o.id)), eC = new Set(errs.filter((o) => o.cid != null).map((o) => o.cid)), eRoom = new Set(errs.filter((o) => o.room).map((o) => o.room)), eBox = new Set(errs.filter((o) => o.box != null).map((o) => o.box));
    const v = (a) => new V3(a[0], a[1], a[2]);
    const seg = (a, b, geo, mat) => {
      const d = new V3().subVectors(b, a), L = d.length();
      const o = new THREE.Mesh(geo, mat);
      o.scale.set(1, Math.max(L, 1e-3), 1);
      o.position.copy(a).addScaledVector(d, 0.5);
      if (L > 1e-6) o.quaternion.setFromUnitVectors(UPV, d.normalize());
      return o;
    };
    const spr = (t, o) => {
      const sp = txtSprite(t, o);
      tm(sp.material);
      return sp;
    };
    const wallItem = (grp, it, obj, y, out = 0) => {
      const n = it.n || [0, 0, 1];
      obj.position.set(it.p[0] + n[0] * out, y, it.p[2] + n[2] * out);
      obj.rotation.y = Math.atan2(n[0], n[2]);
      grp.add(obj);
      return obj;
    };
    const W = tabW(s), cz = 0.06, cy = 1.5;
    const plate = box(W, 0.95, 0.03, tm(M(6121589)));
    plate.position.set(TX, cy, cz + 0.015);
    plate.userData = { k: "tab" };
    g.add(plate);
    V.pick.push(plate);
    const fr = box(W + 0.05, 1, 0.02, tm(M(4081490)));
    fr.position.set(TX, cy, cz + 5e-3);
    g.add(fr);
    {
      if (!(s.tabImg && simTabView === "dis" && !simConn)) {
        const can = box(0.08, 0.9, 0.05, tm(M(10134445, { transparent: true, opacity: 0.45, depthWrite: false })));
        can.position.set(TX + W / 2 - 0.06, 1.5, cz + 0.06);
        g.add(can);
        const cl = spr("canaleta", { h: 0.014, bg: "rgba(90,98,108,.9)" });
        cl.position.set(TX + W / 2 - 0.06, 1.07, cz + 0.12);
        g.add(cl);
      }
      s.circuits.forEach((c, k) => {
        const xe = tabExit(k, W)[0], kn = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.03, 14), tm(M(2830648)));
        kn.position.set(xe, 1.965, 0.13);
        g.add(kn);
      });
    }
    const tabD = !!(s.tabImg && simTabView === "dis" && !simConn);
    if (tabD) {
      const tx3 = tabTex(s), ar = s.tabImg.h / s.tabImg.w, pw = Math.min(W - 0.04, 0.93 / ar), ph = pw * ar;
      if (tx3) {
        const mt = new THREE.MeshBasicMaterial({ map: tx3 });
        V.tmp.push(mt);
        const pl2 = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), mt);
        pl2.position.set(TX, cy, cz + 0.032);
        pl2.userData = { k: "tab" };
        g.add(pl2);
        V.pick.push(pl2);
      } else {
        const ld = spr("Cargando el dise\xF1o del tablero\u2026", { h: 0.03 });
        ld.position.set(TX, cy, cz + 0.08);
        g.add(ld);
      }
      const tg2 = spr("Dise\xF1o: " + s.tabImg.n + " piezas \xB7 " + s.tabImg.c + " cables", { h: 0.024, bg: "rgba(30,78,120,.9)" });
      tg2.position.set(TX, cy - 0.53, cz + 0.06);
      g.add(tg2);
    }
    if (!tabD) [1.72, 1.33].forEach((y) => {
      const r = box(W - 0.08, 0.03, 0.012, tm(M(11581632, { metalness: 0.6 })));
      r.position.set(TX, y, cz + 0.035);
      g.add(r);
    });
    const dev = (xc, y, mods, on, ud, lines, bg, label) => {
      if (tabD) return;
      const grp = new THREE.Group();
      grp.userData = ud;
      const w = 0.088 * mods - 6e-3;
      const body = box(w, 0.17, 0.075, tm(M(16053492)));
      body.position.set(xc, y, cz + 0.07);
      grp.add(body);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(w - 8e-3, 0.112), tm(new THREE.MeshBasicMaterial({ map: faceTex(lines, mods, bg) })));
      face.position.set(xc, y - 0.022, cz + 0.1085);
      grp.add(face);
      const lv = box(0.024, 0.03, 0.026, tm(M(on ? 2783304 : 11414049)));
      lv.position.set(xc, y + (on ? 0.068 : 0.05), cz + 0.12);
      grp.add(lv);
      g.add(grp);
      V.pick.push(grp);
      if (label) {
        const sp = spr(label, { h: 0.026 });
        sp.position.set(xc, y - (ud.alt ? 0.142 : 0.112), cz + 0.13);
        g.add(sp);
      }
    };
    const x0 = TX - W / 2 + 0.09;
    dev(x0 + 0.088, 1.72, 2, s.gen.on, { k: "gen" }, ["GENERAL", "".concat(s.gen.In, " A"), "2 polos \xB7 6 kA"], "#ffffff");
    simDRs(s).forEach((d, i) => {
      const cc = s.circuits.filter((c) => c.dr === d);
      dev(x0 + 0.29 + i * 0.19, 1.72, 2, !s.drOff[d], { k: "dr", dr: d }, [d, "".concat(drIn(s), " A \xB7 ").concat(Math.max(...cc.map((c) => +c.ds)), " mA"), "Clase ".concat(cc[0].cl)], "#e4eef7");
    });
    s.circuits.forEach((c, k) => dev(x0 + 0.044 + k * 0.09, 1.33, 1, c.on, { k: "tm", cid: c.id, alt: k % 2 === 1 }, ["C".concat(k + 1).concat(s.sys === "tri" ? " \xB7 " + (c.ph || "R") : ""), "".concat(c.In, " A"), "Curva ".concat(c.cv), "".concat(c.pc, " kA")], eC.has(c.id) ? "#fbd5d0" : "#ffffff", simConn ? "" : (c.n || "").slice(0, 9)));
    V.rl = [];
    if (!PANEL) ROOMS.forEach((r) => {
      const er = eRoom.has(r.id);
      const l = spr("".concat(er ? "\u26A0 " : "").concat(r.n, " \xB7 ").concat(n0(rArea(r)), " m\xB2"), { h: 0.26, depth: true, bg: er ? "rgba(174,42,33,.9)" : "rgba(255,255,255,.88)", fg: er ? "#fff" : "#24313d" });
      l.position.set((r.x0 + r.x1) / 2, 0.2 + (r.f || 0) * FH, (r.z0 + r.z1) / 2);
      g.add(l);
      V.rl.push({ sp: l, r, err: er });
    });
    V.updRL();
    if (simConn) {
      const zf = cz + 0.142, W2 = W / 2, w = (pts, mat) => {
        for (let i = 0; i < pts.length - 1; i++) g.add(seg(v([pts[i][0], pts[i][1], zf]), v([pts[i + 1][0], pts[i + 1][1], zf]), G.wire, mat));
      };
      const xIG = x0 + 0.088, L0 = TX - W2;
      w([[L0 + 5e-3, 1.5], [L0 + 0.04, 1.5], [L0 + 0.04, 1.85], [xIG - 0.02, 1.85], [xIG - 0.02, 1.81]], MAT.F);
      w([[L0 + 5e-3, 1.485], [L0 + 0.052, 1.485], [L0 + 0.052, 1.866], [xIG + 0.02, 1.866], [xIG + 0.02, 1.81]], MAT.N);
      const xa = x0 - 0.01, xR = TX + W2 - 0.075, yN = 1.125, yD = (i) => 1.1 - i * 0.022, yPE = 1.04, yb = 1.158;
      const bus = (y, mat, txt) => {
        const o = box(xR - xa, 0.014, 0.016, mat);
        o.position.set((xa + xR) / 2, y, cz + 0.12);
        g.add(o);
        const l = spr(txt, { h: 0.02 });
        l.position.set(xR - 0.04, y + 0.016, cz + 0.16);
        g.add(l);
      };
      w([[xIG + 0.02, 1.635], [xIG + 0.02, 1.565], [L0 + 0.064, 1.565], [L0 + 0.064, yN], [xa, yN]], MAT.N);
      bus(yN, MAT.N, "Barra N general");
      w([[L0 + 0.05, 1.02], [L0 + 0.05, yPE], [xa, yPE]], MAT.PE);
      bus(yPE, MAT.PE, "Barra PE (tierra)");
      simDRs(s).forEach((d, i) => {
        const xd = x0 + 0.29 + i * 0.19;
        w([[xIG - 0.02, 1.635], [xIG - 0.02, 1.595], [xd - 0.115, 1.595], [xd - 0.115, 1.85], [xd - 0.02, 1.85], [xd - 0.02, 1.81]], MAT.F);
        w([[xIG + 0.02, 1.635], [xIG + 0.02, 1.58], [xd - 0.103, 1.58], [xd - 0.103, 1.866], [xd + 0.02, 1.866], [xd + 0.02, 1.81]], MAT.N);
        const yb2 = 1.52 - i * 0.018, xr = TX + W2 - 0.03 - i * 0.014, xn = TX + W2 - 0.12 - i * 0.09;
        s.circuits.forEach((c, k) => {
          if (c.dr !== d) return;
          const xt = x0 + 0.044 + k * 0.09;
          w([[xd - 0.02, 1.635], [xd - 0.02, yb2], [xt, yb2], [xt, 1.415]], MAT.F);
        });
        w([[xd + 0.02, 1.635], [xd + 0.02, 1.545 - i * 0.018], [xr, 1.545 - i * 0.018], [xr, yD(i)], [xR, yD(i)]], MAT.N);
        bus(yD(i), MAT.N, "N ".concat(d));
      });
      s.circuits.forEach((c, k) => {
        if (c.dr !== "none") return;
        const xt = x0 + 0.044 + k * 0.09;
        w([[xIG - 0.02, 1.635], [xIG - 0.02, 1.595], [xt - 0.03, 1.595], [xt - 0.03, 1.45], [xt, 1.45], [xt, 1.415]], MAT.F);
      });
      const BUN = G.bun || (G.bun = new THREE.CylinderGeometry(55e-4, 55e-4, 1, 6)), BM = MAT.bun || (MAT.bun = M(4869975)), wb = (pts) => {
        for (let i = 0; i < pts.length - 1; i++) g.add(seg(v([pts[i][0], pts[i][1], zf + 4e-3]), v([pts[i + 1][0], pts[i + 1][1], zf + 4e-3]), BUN, BM));
      };
      s.circuits.forEach((c, k) => {
        const xt = x0 + 0.044 + k * 0.09, yk = 1.236 - k * 0.011, xc = TX + W2 - 0.088 + k * 75e-4, yt = 1.955 - k * 0.011, xe = tabExit(k, W)[0];
        wb([[xt + 0.036, yb], [xt + 0.036, yk], [xc, yk], [xc, yt], [xe, yt], [xe, 1.975]]);
        const tl2 = spr("C".concat(k + 1), { h: 0.016, bg: "rgba(74,79,87,.95)" });
        tl2.position.set(xe, 1.94, cz + 0.17);
        g.add(tl2);
      });
      const DRL = simDRs(s);
      s.circuits.forEach((c, k) => {
        const xt = x0 + 0.044 + k * 0.09;
        const bo = box(0.07, 0.016, 0.02, M(10134445));
        bo.position.set(xt, yb, cz + 0.13);
        g.add(bo);
        w([[xt, 1.245], [xt, yb]], MAT.F);
        const di = DRL.indexOf(c.dr);
        if (c.nc === "off") {
          w([[xt + 0.024, yb], [xt + 0.024, yb - 0.025]], MAT.N);
          const t = spr("\u2717 N de C".concat(k + 1, " suelto"), { h: 0.022, bg: "rgba(174,42,33,.92)" });
          t.position.set(xt, yb - 0.045, cz + 0.17);
          g.add(t);
        } else w([[xt + 0.024, yb], [xt + 0.024, di >= 0 && c.nc !== "bar" ? yD(di) : yN]], MAT.N);
        if (c.pe !== false) w([[xt - 0.024, yb], [xt - 0.024, yPE]], MAT.PE);
        else w([[xt - 0.024, yb], [xt - 0.024, yb - 0.02]], MAT.PE);
      });
      s.circuits.forEach((c, k) => {
        const xt = x0 + 0.044 + k * 0.09;
        if (c.dr !== "none" && c.nc === "bar") {
          const t = spr("\u2717 N de C".concat(k + 1, " en barra general"), { h: 0.024, bg: "rgba(174,42,33,.92)" });
          t.position.set(TX - 0.17, 0.99 - 0.028 * (k % 3), cz + 0.17);
          g.add(t);
        }
        if (c.pe === false) {
          const t = spr("\u2717 PE de C".concat(k + 1, " sin conectar"), { h: 0.024, bg: "rgba(174,42,33,.92)" });
          t.position.set(TX + 0.17, 0.99 - 0.028 * (k % 3), cz + 0.17);
          g.add(t);
        }
      });
      const fa = spr("Fase", { h: 0.022, bg: "rgba(211,47,47,.95)" });
      fa.position.set(L0 + 0.04, 1.53, cz + 0.15);
      g.add(fa);
    }
    if (!simConn && !tabD) {
      const cnt = { N: 0, PE: 0, F: 0, peine: 0 }, REGM = { N: tm(M(2051496)), PE: tm(M(3055172)), F: tm(M(13840175)), peine: tm(M(13136949, { metalness: 0.6, roughness: 0.35 })) };
      regOf(s).forEach((r, ri) => {
        cnt[r.t]++;
        const P2 = regPos(s, r, ri), ln2 = P2.L, x = TX + P2.x, y = P2.y;
        if (simTool === "place" && simPT === "reg" && ri === simRegSel) {
          const hl = box(ln2 + 0.03, 0.05, 0.004, MAT.sel);
          hl.position.set(x, y, cz + 0.045);
          g.add(hl);
        }
        const bb = box(ln2, r.t === "peine" ? 0.008 : 0.026, r.t === "peine" ? 0.01 : 0.022, REGM[r.t]);
        bb.position.set(x, y, cz + (r.t === "peine" ? 0.12 : 0.05));
        g.add(bb);
        if (r.t !== "peine") for (let k = 0; k < r.n; k++) {
          const sc2 = new THREE.Mesh(geoC("rgs", () => new THREE.CylinderGeometry(0.005, 0.005, 0.006, 8)), MAT.dark);
          sc2.rotation.x = Math.PI / 2;
          sc2.position.set(x - ln2 / 2 + 0.015 + k * ((ln2 - 0.03) / Math.max(1, r.n - 1)), y, cz + 0.064);
          g.add(sc2);
        }
        const lb = spr(REG_T[r.t][1] + " \xB7 " + r.n, { h: 0.024 });
        lb.position.set(r.t === "peine" ? x + ln2 / 2 + 0.06 : x, y - (r.t === "peine" ? 0 : 0.035), cz + 0.13);
        g.add(lb);
      });
    }
    const tl = spr("Tablero", { fixed: true, h: 0.032 });
    tl.position.set(TX, cy + 0.6, cz + 0.12);
    g.add(tl);
    const run = (pts, conds, ud, nrm, sel, hot, hm) => {
      const grp = new THREE.Group();
      grp.userData = ud;
      const dm = sel ? MAT.sel : hm || MAT.duct;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = v(pts[i]), b = v(pts[i + 1]), d = new V3().subVectors(b, a);
        if (d.length() < 1e-4) continue;
        d.normalize();
        let p;
        if (Math.abs(d.y) > 0.9) {
          p = new V3().crossVectors(d, v(nrm || [0, 0, 1]));
          if (p.length() < 0.1) p.set(1, 0, 0);
        } else p = new V3(0, 1, 0);
        p.normalize();
        const du = seg(a, b, G.duct, dm);
        du.renderOrder = 2;
        grp.add(du);
        grp.add(seg(a, b, G.hit, MAT.hit));
        if (i > 0) {
          const pd = new V3().subVectors(a, v(pts[i - 1])), bend = pd.length() > 1e-4 && Math.abs(pd.normalize().dot(d)) < 0.7, j = new THREE.Mesh(bend ? geoC("elb", () => new THREE.SphereGeometry(0.041, 14, 10)) : G.joint, dm);
          j.position.copy(a);
          j.renderOrder = 2;
          grp.add(j);
        }
        conds.forEach((ck, q) => {
          const o = p.clone().multiplyScalar((q - (conds.length - 1) / 2) * 0.016);
          grp.add(seg(a.clone().add(o), b.clone().add(o), G.wire, hot && ck === "F" ? MAT.hot : MAT[ck]));
        });
      }
      g.add(grp);
      V.pick.push(grp);
      return grp;
    };
    run([[TX - 1, 1.5, -0.06], [TX - 1, 1.5, 0.13], [TX - W / 2 - 0.02, 1.5, 0.13]], ["F", "N"], { k: "alim" }, [0, 0, 1], false, false);
    const pe = [[TX - W / 2 + 0.05, 1.02, 0.1], [TX - W / 2 + 0.05, 0.04, 0.1], [TX - W / 2 + 0.05, 0.04, -0.9], [TX - 1.4, 0.04, -0.9]];
    for (let i = 0; i < pe.length - 1; i++) g.add(seg(v(pe[i]), v(pe[i + 1]), G.wire, MAT.PE));
    {
      const DT = { pvc: [11187389, 0, 0.85], emt: [13620698, 0.85, 0.3], flex: [15239471, 0, 0.7] }[s.duct || "pvc"], dm = MAT.duct;
      const sol = simDuctSolid || PANEL && !simConn;
      dm.color.setHex(PANEL && (s.duct || "pvc") === "pvc" ? 15230238 : DT[0]);
      dm.metalness = DT[1];
      dm.roughness = DT[2];
      dm.transparent = !sol;
      dm.opacity = sol ? 1 : 0.3;
      dm.depthWrite = sol;
      dm.needsUpdate = true;
    }
    const HC = (v2) => V.HM[v2] || (V.HM[v2] = M(v2, { transparent: true, opacity: 0.88, depthWrite: false })), HEATC = [3055172, 15844367, 15105570, 12597547];
    const heatOf = (e) => {
      const c = s.circuits[e.ci];
      if (!simHeat || !c) return null;
      if (simHeat === 1) {
        const r = (ev.Ip[e.id] || 0) / ampOf(e.S);
        return HC(HEATC[r < 0.5 ? 0 : r < 0.8 ? 1 : r < 1 ? 2 : 3]);
      }
      const d = (V0 - (ev.Vp[e.id] == null ? V0 : ev.Vp[e.id])) / V0 * 100;
      return HC(HEATC[d < 1.5 ? 0 : d < 3 ? 1 : d < 5 ? 2 : 3]);
    };
    ev.E.forEach((e) => {
      const it = e.it;
      run(e.pts, e.cond, { k: "edge", id: e.id }, it.n || [1, 0, 0], simSel === "e" + e.id, ev.cs[e.ci].hot || simFxHot(e.cid), heatOf(e));
    });
    {
      const lg = document.getElementById("simleg");
      if (lg) {
        lg.hidden = !simHeat;
        if (simHeat) lg.innerHTML = "<b>".concat(simHeat === 1 ? "Carga del cable (I \xF7 Iz)" : "Ca\xEDda de tensi\xF3n acumulada", "</b>").concat((simHeat === 1 ? ["< 50 %", "50\u201380 %", "80\u2013100 %", "> 100 %"] : ["< 1,5 %", "1,5\u20133 %", "3\u20135 %", "> 5 %"]).map((t, i) => '<span><i style="background:#'.concat(HEATC[i].toString(16).padStart(6, "0"), '"></i>').concat(t, "</span>")).join(""));
      }
    }
    s.circuits.forEach((c, k) => {
      const x = ev.cs[k];
      if (!x.roots.length) return;
      const e = ev.ed.get(x.roots[0]);
      let bi = 0, bl = -1;
      for (let i = 0; i < e.pts.length - 1; i++) {
        const a = e.pts[i], b2 = e.pts[i + 1], l = Math.hypot(b2[0] - a[0], b2[2] - a[2]);
        if (l > bl) {
          bl = l;
          bi = i;
        }
      }
      const p = [(e.pts[bi][0] + e.pts[bi + 1][0]) / 2, (e.pts[bi][1] + e.pts[bi + 1][1]) / 2, (e.pts[bi][2] + e.pts[bi + 1][2]) / 2];
      const lb = spr(x.hot ? "C".concat(k + 1, " \xA1recalentado!") : "C".concat(k + 1, " ").concat(c.n || ""), { fixed: true, h: 0.022, bg: x.hot ? "rgba(174,42,33,.92)" : eC.has(c.id) ? "rgba(174,42,33,.85)" : "rgba(30,78,120,.9)" });
      lb.position.set(p[0], p[1] + 0.12, p[2]);
      g.add(lb);
    });
    s.items.forEach((it0) => {
      const oyF = flY(it0.p[1]) * FH, it = oyF ? Object.assign({}, it0, { p: [it0.p[0], it0.p[1] - oyF, it0.p[2]] }) : it0;
      const k = cIdx(s, it.c), x = ev.cs[k], lit = x && x.en && ev.act(it0) && (ev.V[it.id] || 0) > 1, grp = new THREE.Group();
      grp.position.y = oyF;
      grp.userData = { k: "item", id: it.id };
      const n = it.n || [0, 0, 1];
      if (isWL(it)) {
        const y = it.p[1], ho = new THREE.Group(), base = new THREE.Mesh(geoC("pmb", () => new THREE.CylinderGeometry(0.045, 0.05, 0.07, 16)), MAT.white), bulb = new THREE.Mesh(geoC("pmu", () => new THREE.SphereGeometry(0.055, 16, 12)), tm(M(16774870, { emissive: 16764762, emissiveIntensity: lit ? 1.6 : 0 })));
        base.rotation.x = Math.PI / 2;
        base.position.z = 0.035;
        bulb.position.z = 0.115;
        ho.add(base, bulb);
        wallItem(grp, it, ho, y, 0);
        if (lit) {
          const hl = new THREE.Sprite(tm(new THREE.SpriteMaterial({ map: V.glow, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })));
          hl.scale.set(0.8, 0.8, 1);
          hl.position.set(it.p[0] + n[0] * 0.12, y, it.p[2] + n[2] * 0.12);
          grp.add(hl);
        }
        const hb = new THREE.Mesh(geoC("hs13", () => new THREE.SphereGeometry(0.13, 8, 6)), MAT.hit);
        hb.position.set(it.p[0] + n[0] * 0.08, y, it.p[2] + n[2] * 0.08);
        grp.add(hb);
      } else if (it.t === "lamp" && it.v && it.v !== "s") {
        const p = it.p, dev = it.v === "ext" || it.v === "tim", em = tm(M(dev ? 14540253 : 16777215, { emissive: 16774870, emissiveIntensity: lit && !dev ? 1.3 : 0 }));
        const lm = it.v === "ext" ? box(0.26, 0.045, 0.26, em) : it.v === "tim" ? box(0.12, 0.07, 0.09, em) : it.v === "led" ? new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.035, 24), em) : it.v === "foco" ? new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16), em) : box(1.2, 0.04, 0.09, em);
        lm.position.set(p[0], WH - (it.v === "foco" ? 0.01 : 0.025), p[2]);
        grp.add(lm);
        if (it.v === "ext") for (let i = -2; i <= 2; i++) {
          const sl = box(0.2, 0.008, 0.012, MAT.dark);
          sl.position.set(p[0], WH - 0.05, p[2] + i * 0.04);
          grp.add(sl);
        }
        if (dev && lit) {
          const ind = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), tm(M(2783304, { emissive: 2783304, emissiveIntensity: 1.5 })));
          ind.position.set(p[0] + 0.05, WH - 0.05, p[2] + 0.05);
          grp.add(ind);
        }
        if (lit && !dev) {
          const hl = new THREE.Sprite(tm(new THREE.SpriteMaterial({ map: V.glow, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })));
          const sz = it.v === "tubo" ? 1.5 : it.v === "led" ? 1.1 : 0.55;
          hl.scale.set(sz, sz * (it.v === "tubo" ? 0.5 : 1), 1);
          hl.position.set(p[0], WH - 0.08, p[2]);
          grp.add(hl);
        }
        const hb = new THREE.Mesh(geoC("hs16", () => new THREE.SphereGeometry(0.16, 8, 6)), MAT.hit);
        hb.position.set(p[0], WH - 0.06, p[2]);
        grp.add(hb);
      } else if (it.t === "lamp") {
        const p = it.p;
        grp.add(seg(v([p[0], WH, p[2]]), v([p[0], 2.47, p[2]]), G.cord, MAT.cord));
        const sh = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.1, 16, 1, true), tm(M(16185078, { side: THREE.DoubleSide })));
        sh.position.set(p[0], 2.46, p[2]);
        grp.add(sh);
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), tm(M(16774870, { emissive: 16764762, emissiveIntensity: lit ? it.P >= 100 ? 2 : 1.4 : 0 })));
        bulb.position.set(p[0], 2.4, p[2]);
        grp.add(bulb);
        if (lit) {
          const hl = new THREE.Sprite(tm(new THREE.SpriteMaterial({ map: V.glow, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })));
          const sz = it.P >= 100 ? 1.2 : it.P >= 60 ? 0.9 : 0.6;
          hl.scale.set(sz, sz, 1);
          hl.position.copy(bulb.position);
          grp.add(hl);
        }
        const hb = new THREE.Mesh(geoC("hs16", () => new THREE.SphereGeometry(0.16, 8, 6)), MAT.hit);
        hb.position.set(p[0], 2.42, p[2]);
        grp.add(hb);
      } else {
        const y = it.p[1];
        if (it.t === "sw") {
          const ip = it.v === "ip", t3 = [n[2], 0, -n[0]];
          wallItem(grp, it, box(it.v === "t" ? 0.12 : it.v === "d" ? 0.1 : 0.08, 0.12, ip ? 0.034 : 0.016, ip ? tm(M(12895428)) : MAT.white), y, ip ? 0.017 : 8e-3);
          (it.v === "t" ? [[-0.034, it.on], [0, it.on2], [0.034, it.on3]] : it.v === "d" ? [[-0.022, it.on], [0.022, it.on2]] : [[0, it.on]]).forEach(([o, on]) => {
            const rk = box(it.v === "t" ? 0.03 : it.v === "d" ? 0.034 : 0.04, 0.06, 0.012, tm(M(on ? 2783304 : 8028038)));
            rk.rotation.x = on ? -0.25 : 0.25;
            wallItem(grp, it, rk, y, ip ? 0.038 : 0.02);
            rk.position.x += t3[0] * o;
            rk.position.z += t3[2] * o;
          });
          if (it.v === "pir" || it.v === "pul") {
            const dm = new THREE.Mesh(new THREE.SphereGeometry(it.v === "pir" ? 0.022 : 0.016, 12, 8), tm(M(it.v === "pir" ? 15790320 : it.on ? 2783304 : 9474192)));
            wallItem(grp, it, dm, y + (it.v === "pir" ? 0.02 : 0), 0.024);
          }
          if (it.v === "dim" || it.v === "c") {
            const mk = box(0.012, 0.012, 0.006, tm(M(it.v === "dim" ? 15237690 : 2056127)));
            wallItem(grp, it, mk, y - 0.045, 0.02);
          }
        } else if (it.t === "box" && n[1] < -0.5) {
          const bb = box(0.15, 0.055, 0.15, eBox.has(it.id) ? tm(M(14242639)) : MAT.box);
          bb.position.set(it.p[0], WH - 0.028, it.p[2]);
          grp.add(bb);
          const lid = box(0.13, 6e-3, 0.13, MAT.white);
          lid.position.set(it.p[0], WH - 0.058, it.p[2]);
          grp.add(lid);
          const nk = s.items.filter((i) => i.par === it.id).length, bl = spr("".concat(it.name, " \xB7 ").concat(nk, " deriv.").concat(eBox.has(it.id) ? " \u26A0" : ""), { h: 0.085, depth: true, bg: eBox.has(it.id) ? "rgba(174,42,33,.92)" : "rgba(255,255,255,.9)", fg: eBox.has(it.id) ? "#fff" : "#24313d" });
          bl.position.set(it.p[0], WH - 0.17, it.p[2]);
          grp.add(bl);
        } else if (it.t === "box") {
          wallItem(grp, it, box(0.15, 0.13, 0.055, eBox.has(it.id) ? tm(M(14242639)) : MAT.box), y, 0.028);
          wallItem(grp, it, box(0.13, 0.11, 6e-3, MAT.white), y, 0.057);
          const nk = s.items.filter((i) => i.par === it.id).length, bl = spr("".concat(it.name, " \xB7 ").concat(nk, " deriv.").concat(eBox.has(it.id) ? " \u26A0" : ""), { h: 0.085, depth: true, bg: eBox.has(it.id) ? "rgba(174,42,33,.92)" : "rgba(255,255,255,.9)", fg: eBox.has(it.id) ? "#fff" : "#24313d" });
          bl.position.set(it.p[0] + n[0] * 0.09, y - 0.12, it.p[2] + n[2] * 0.09);
          grp.add(bl);
        } else {
          const yo = it.t === "horno" ? 0.3 : y, ip = it.v === "ip", dbl = it.v === "d";
          wallItem(grp, it, box(dbl ? 0.16 : 0.09, 0.12, ip ? 0.036 : 0.016, ip ? tm(M(12895428)) : it.v === "f" ? tm(M(14211288)) : MAT.white), yo, ip ? 0.018 : 8e-3);
          const t = [n[2], 0, -n[0]], dz = ip ? 0.04 : 0.018;
          (it.v === "dat" ? [] : dbl ? [-0.06, -0.04, -0.02, 0.02, 0.04, 0.06] : [-0.026, 0, 0.026]).forEach((o) => {
            const h = box(0.011, 0.016, 6e-3, MAT.dark);
            h.position.set(it.p[0] + n[0] * dz + t[0] * o, yo, it.p[2] + n[2] * dz + t[2] * o);
            h.rotation.y = Math.atan2(n[0], n[2]);
            grp.add(h);
          });
          if (it.v === "dat") {
            const rj = box(0.022, 0.018, 6e-3, MAT.dark), co = box(0.014, 0.014, 6e-3, tm(M(3355443)));
            wallItem(grp, it, rj, yo + 0.02, 0.018);
            wallItem(grp, it, co, yo - 0.025, 0.018);
          }
          if (it.v === "usb") {
            const u = box(0.024, 0.008, 6e-3, MAT.dark);
            wallItem(grp, it, u, yo - 0.04, 0.018);
          }
          if (it.t === "horno") {
            const ov = box(0.6, 0.56, 0.5, tm(M(3882821, { metalness: 0.3 })));
            wallItem(grp, it, ov, 0.28, 0.3);
            const gl = box(0.44, 0.3, 0.01, tm(M(1118481, { emissive: 16742938, emissiveIntensity: lit ? 1.1 : 0 })));
            wallItem(grp, it, gl, 0.28, 0.556);
          } else if (it.a === "clima") {
            const ap = box(0.8, 0.28, 0.22, tm(M(16054007, { emissive: 6139362, emissiveIntensity: lit ? 0.25 : 0 })));
            wallItem(grp, it, ap, y + 0.32, 0.12);
            const al = spr("Aire acondicionado", { h: 0.024, fixed: true });
            al.position.set(it.p[0] + n[0] * 0.15, y + 0.6, it.p[2] + n[2] * 0.15);
            grp.add(al);
          } else if (it.a !== "none") {
            const high = y > 0.6;
            if (high) {
              const ct = box(0.45, 0.9, 0.5, tm(M(12169894)));
              ct.position.set(it.p[0] + n[0] * 0.25, 0.45, it.p[2] + n[2] * 0.25);
              ct.rotation.y = Math.atan2(n[0], n[2]);
              grp.add(ct);
            }
            const ap = box(0.26, 0.26, 0.22, tm(M(APPC[it.a] || 8947848, { emissive: 2780113, emissiveIntensity: lit ? 0.35 : 0 })));
            const ay = high ? 1.03 : 0.13;
            wallItem(grp, it, ap, ay, 0.3);
            grp.add(seg(v([it.p[0] + n[0] * 0.03, yo - 0.05, it.p[2] + n[2] * 0.03]), v([it.p[0] + n[0] * 0.3, ay + 0.05, it.p[2] + n[2] * 0.3]), G.cord, MAT.cord));
            const al = spr(APPL[it.a][0], { h: 0.024, fixed: true });
            al.position.set(it.p[0] + n[0] * 0.3, ay + 0.3, it.p[2] + n[2] * 0.3);
            grp.add(al);
          }
        }
        const hb = new THREE.Mesh(geoC("hs13", () => new THREE.SphereGeometry(0.13, 8, 6)), MAT.hit);
        hb.position.set(it.p[0] + n[0] * 0.05, it.t === "horno" ? 0.3 : y, it.p[2] + n[2] * 0.05);
        grp.add(hb);
      }
      if (simRoute === it.id && it.route) it.route.forEach((q, qi) => {
        const mk2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), tm(new THREE.MeshBasicMaterial({ color: 15237690 })));
        mk2.position.set(q[0], q[1], q[2]);
        g.add(mk2);
        const lb2 = spr(String(qi + 1), { fixed: true, h: 0.02, bg: "rgba(232,130,58,.95)" });
        lb2.position.set(q[0], q[1] + 0.1, q[2]);
        g.add(lb2);
      });
      if (simSel === "i" + it.id) {
        const hs = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), tm(new THREE.MeshBasicMaterial({ color: 15237690, transparent: true, opacity: 0.35, depthWrite: false })));
        const ap = anchor(it);
        hs.position.set(ap[0], it.t === "lamp" ? 2.4 : ap[1] - (it.t === "box" ? 0 : 0.07), ap[2]);
        grp.add(hs);
      }
      if (eItem.has(it.id)) {
        const ex = spr("!", { fixed: true, h: 0.03, bg: "rgba(174,42,33,.95)" });
        ex.position.set(it.p[0] + n[0] * 0.1, it.t === "lamp" ? 2.15 : it.p[1] + 0.28, it.p[2] + n[2] * 0.1);
        grp.add(ex);
      }
      if (V.labels || simSel === "i" + it.id) {
        const lb = spr(it.name, { fixed: true, h: 0.024, bg: "rgba(176,82,42,.92)" });
        lb.position.set(it.p[0] + n[0] * 0.1, it.t === "lamp" ? 2.25 : it.p[1] + 0.16, it.p[2] + n[2] * 0.1);
        grp.add(lb);
      }
      g.add(grp);
      V.pick.push(grp);
    });
    V.applyFl();
    if (V.shadows) V.dyn.traverse((o) => {
      if (o.isMesh && !(o.material && o.material.transparent)) {
        o.castShadow = !(o.geometry && /Cylinder|Sphere|Tube/.test(o.geometry.type));
        o.receiveShadow = true;
      }
    });
    V.dirty = true;
  }
