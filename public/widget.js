(function () {
  "use strict";

  var API_BASE = "https://praisegrid.com/api/public/widget/";
  var currentScript = document.currentScript;
  if (!currentScript) return;

  var locationId = currentScript.getAttribute("data-location");
  var style = currentScript.getAttribute("data-style") || "badge";
  if (!locationId) return;

  var host = document.createElement("div");
  currentScript.parentNode.insertBefore(host, currentScript.nextSibling);
  var root = host.attachShadow({ mode: "open" });

  var styleEl = document.createElement("style");
  styleEl.textContent =
    ":host{all:initial}" +
    ".pg-wrap{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a}" +
    ".pg-badge{display:inline-flex;align-items:center;gap:12px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;padding:12px 16px;box-shadow:0 1px 3px rgba(0,0,0,.08)}" +
    ".pg-rating{display:flex;align-items:center;gap:6px}" +
    ".pg-rating-num{font-size:18px;font-weight:700}" +
    ".pg-stars{display:flex;gap:1px}" +
    ".pg-star{width:14px;height:14px}" +
    ".pg-meta{font-size:11px;color:#64748b;margin-top:2px}" +
    ".pg-row{display:flex;gap:12px;overflow-x:auto;padding:4px 2px}" +
    ".pg-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}" +
    ".pg-card{width:200px;flex:0 0 auto;border:1px solid #e2e8f0;border-radius:10px;background:#fff;padding:12px;box-shadow:0 1px 3px rgba(0,0,0,.06)}" +
    ".pg-quote{font-size:12px;line-height:1.5;color:#334155;margin:8px 0 6px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}" +
    ".pg-name{font-size:11px;font-weight:600;color:#94a3b8}" +
    ".pg-empty{font-size:12px;color:#94a3b8}";
  root.appendChild(styleEl);

  var wrap = document.createElement("div");
  wrap.className = "pg-wrap";
  root.appendChild(wrap);

  function starsSvg(filled) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "pg-star");
    svg.setAttribute("fill", filled ? "#fbbf24" : "#e2e8f0");
    var path = document.createElementNS(ns, "path");
    path.setAttribute(
      "d",
      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    );
    svg.appendChild(path);
    return svg;
  }

  function starsRow(rating) {
    var row = document.createElement("div");
    row.className = "pg-stars";
    for (var i = 0; i < 5; i++) {
      row.appendChild(starsSvg(i < Math.round(rating)));
    }
    return row;
  }

  function renderBadge(data) {
    var badge = document.createElement("div");
    badge.className = "pg-badge";

    var col = document.createElement("div");
    var ratingRow = document.createElement("div");
    ratingRow.className = "pg-rating";
    var num = document.createElement("span");
    num.className = "pg-rating-num";
    num.textContent = data.avgRating > 0 ? data.avgRating.toFixed(1) : "—";
    ratingRow.appendChild(num);
    ratingRow.appendChild(starsRow(data.avgRating));
    col.appendChild(ratingRow);

    var meta = document.createElement("p");
    meta.className = "pg-meta";
    meta.textContent = data.totalReviews.toLocaleString() + " reviews · Powered by Praisegrid";
    col.appendChild(meta);

    badge.appendChild(col);
    wrap.appendChild(badge);
  }

  function snippetCard(review) {
    var card = document.createElement("div");
    card.className = "pg-card";
    card.appendChild(starsRow(review.rating));

    var quote = document.createElement("p");
    quote.className = "pg-quote";
    quote.textContent = '“' + review.text + '”';
    card.appendChild(quote);

    var name = document.createElement("p");
    name.className = "pg-name";
    name.textContent = review.reviewerName || "Verified customer";
    card.appendChild(name);

    return card;
  }

  function renderCarousel(data) {
    var row = document.createElement("div");
    row.className = "pg-row";
    data.reviews.forEach(function (r) {
      row.appendChild(snippetCard(r));
    });
    wrap.appendChild(row);
  }

  function renderGrid(data) {
    var grid = document.createElement("div");
    grid.className = "pg-grid";
    data.reviews.slice(0, 4).forEach(function (r) {
      grid.appendChild(snippetCard(r));
    });
    wrap.appendChild(grid);
  }

  function renderEmpty() {
    var p = document.createElement("p");
    p.className = "pg-empty";
    p.textContent = "No reviews yet.";
    wrap.appendChild(p);
  }

  fetch(API_BASE + encodeURIComponent(locationId))
    .then(function (res) {
      if (!res.ok) throw new Error("widget fetch failed");
      return res.json();
    })
    .then(function (data) {
      if (style === "carousel" || style === "grid") {
        if (!data.reviews || data.reviews.length === 0) {
          renderEmpty();
          return;
        }
        if (style === "carousel") renderCarousel(data);
        else renderGrid(data);
      } else {
        renderBadge(data);
      }
    })
    .catch(function () {
      // Fails silently — a broken third-party embed shouldn't throw visible
      // errors on someone else's site.
    });
})();
