
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".main-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const form = document.getElementById("estimate-form");
const result = document.getElementById("form-result");
function buildCrmDescription(data) {
  return [
    "Website estimate inquiry",
    "",
    "What needs to be removed or cleaned: " + (data.get("description") || ""),
    "Estimated amount: " + (data.get("volume") || ""),
    "Access: " + (data.get("access") || ""),
    "Stairs: " + (data.get("stairs") || ""),
    "Heavy or awkward items: " + (data.get("heavy") || ""),
    "Preferred timing: " + (data.get("timing") || ""),
    "Additional notes: " + (data.get("notes") || ""),
    "",
    "Baseline estimate request only. Final price and booking require confirmation."
  ].join("\n");
}
if (form) {
  form.addEventListener("submit", (event) => {
    const data = new FormData(form);
    const honeypot = form.elements.namedItem("aG9uZXlwb3Q");
    if (honeypot && honeypot.value) {
      event.preventDefault();
      return;
    }
    document.getElementById("crm-description").value = buildCrmDescription(data);
    // Native form POST lets Zoho validate and display its confirmation page.
    if (result) {
      result.hidden = false;
      result.textContent = "Sending your request for review…";
    }
  });
}

/* Service area map with county boundaries from U.S. Census Bureau TIGERweb. */
const mapElement = document.getElementById("service-map");

if (mapElement && window.L) {
  const map = L.map("service-map", {
    scrollWheelZoom: false,
    attributionControl: true
  }).setView([34.08, -84.18], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const serviceCounties = new Set([
    "Fulton",
    "Forsyth",
    "Cherokee",
    "Cobb",
    "Gwinnett",
    "DeKalb",
    "Hall",
    "Dawson"
  ]);

  const censusUrl =
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/19/query" +
    "?where=STATE%3D%2713%27&outFields=NAME%2CBASENAME%2CGEOID&returnGeometry=true&outSR=4326&f=geojson";

  fetch(censusUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("County map data could not be loaded");
      }
      return response.json();
    })
    .then(data => {
      const selected = {
        type: "FeatureCollection",
        features: (data.features || []).filter(feature => {
          const props = feature.properties || {};
          const rawName = props.BASENAME || props.NAME || "";
          return serviceCounties.has(rawName.replace(" County", ""));
        })
      };

      const layer = L.geoJSON(selected, {
        style: {
          color: "#a80000",
          weight: 2,
          fillColor: "#e10600",
          fillOpacity: 0.43
        },
        onEachFeature: (feature, countyLayer) => {
          const props = feature.properties || {};
          const rawName = props.BASENAME || props.NAME || "";
          const name = rawName.replace(" County", "");

          countyLayer.bindPopup(`<strong>${name} County</strong><br>Core Junk & Done service area`);

          const center = countyLayer.getBounds().getCenter();
          L.marker(center, {
            interactive: false,
            icon: L.divIcon({
              className: "service-county-label",
              html: name,
              iconSize: null
            })
          }).addTo(map);
        }
      }).addTo(map);

      if (layer.getBounds().isValid()) {
        map.fitBounds(layer.getBounds(), { padding: [22, 22] });
      }

      L.circleMarker([33.749, -84.388], {
        radius: 6,
        color: "#111111",
        weight: 2,
        fillColor: "#ffffff",
        fillOpacity: 1
      })
      .addTo(map)
      .bindPopup("<strong>Atlanta</strong><br>Metro Atlanta service area");
    })
    .catch(() => {
      mapElement.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100%;min-height:420px;padding:30px;text-align:center;background:#f4f4f4;color:#555;">
          Service area map could not load. Core coverage includes Fulton, Forsyth, Cherokee, Cobb, Gwinnett, DeKalb, Hall, Dawson, and jobs throughout Metro Atlanta depending on location and schedule.
        </div>
      `;
    });
}
