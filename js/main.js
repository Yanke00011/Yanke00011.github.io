/* ============================================================
   YP 个人网站 — 全局脚本
   导航 / 滚动动画 / 返回顶部 / 灯箱
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 导航栏 ---------- */
  var navbar = document.querySelector(".navbar");
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.querySelector(".nav-menu");

  // 滚动后加阴影
  function onScroll() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 12);
    var btt = document.querySelector(".back-to-top");
    if (btt) btt.classList.toggle("show", window.scrollY > 360);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 移动端菜单
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    // 点击菜单项后收起
    navMenu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 当前页高亮
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (navMenu) {
    navMenu.querySelectorAll("a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (href === page) a.classList.add("active");
    });
  }

  /* ---------- 滚动渐入 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 返回顶部 ---------- */
  var btt = document.querySelector(".back-to-top");
  if (btt) {
    btt.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 灯箱（照片墙） ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var lbCount = document.getElementById("lightboxCount");
  var current = 0;
  var items = [];

  function collectItems() {
    items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item img"));
  }
  function openLightbox(index) {
    if (!lightbox || !items.length) return;
    current = index;
    renderLightbox();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  function stepLightbox(dir) {
    if (!items.length) return;
    current = (current + dir + items.length) % items.length;
    renderLightbox();
  }
  function renderLightbox() {
    var img = items[current];
    lbImg.src = img.getAttribute("data-full") || img.src;
    lbImg.alt = img.alt || "";
    if (lbCount) lbCount.textContent = (current + 1) + " / " + items.length;
  }

  // 点击缩略图打开
  document.addEventListener("click", function (e) {
    var t = e.target.closest(".gallery-item img");
    if (t) {
      collectItems();
      openLightbox(items.indexOf(t));
    }
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.closest(".lb-close")) closeLightbox();
      else if (e.target.closest(".lb-prev")) stepLightbox(-1);
      else if (e.target.closest(".lb-next")) stepLightbox(1);
    });
    // 键盘
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });
  }

  /* ---------- 页脚年份 ---------- */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
