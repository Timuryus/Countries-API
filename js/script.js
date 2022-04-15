const routeList = [
  {
    title: "All countries",
    route: "all",
  },
  {
    title: "Africa",
    route: "africa",
  },
  {
    title: "Americas",
    route: "americas",
  },
  {
    title: "Asia",
    route: "asia",
  },
  {
    title: "Europe",
    route: "europe",
  },
  {
    title: "Oceania",
    route: "oceania",
  },
];

const endpointList = {
  all: "all",
  name: "name",
  capital: "capital",
  region: "region",
};
const $navBar = document.querySelector(".list");
const $container = document.querySelector(".row");
const $loader = document.querySelector(".loader");
const $select = document.querySelector(".select");
const $search = document.querySelector(".search");
const $country = document.querySelector(".countries");
function getBase(endpoint, cb) {
  fetch(`https://restcountries.com/v3.1/${endpoint}`)
    .then((res) => res.json())
    .then((res) => cb(res));
}

window.addEventListener("load", () => {
  const links = routeList
    .map(({ title, route }) => {
      return routeTemplate(title, route);
    })
    .join("");

  $loader.innerHTML = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
  $navBar.innerHTML = links;

  getBase(endpointList.all, (res) => {
    Template(res);
  });
});

function routeTemplate(title, route) {
  return `
        <li>
            <a onclick = "getRoute('${route}')">${title}</a>
        </li>
    
    `;
}

function getRoute(route) {
  console.log(route);
  if (route === "all") {
    getBase(`${endpointList.all}`, (res) => {
      Template(res);
    });
  } else {
    getBase(`${endpointList.region}/${route}`, (res) => {
      Template(res);
    });
  }
}

function Template(base) {
  const template = base
    .map((item) => {
      return card(item);
    })
    .join("");

  $container.innerHTML = template;
}

function card(country) {
  return `
    <div class ="card-box">
        <div class="card-header">
            <i>${country.name.common} ${country.flag ? country.flag : "..."}</i>
        </div>
        <div class ="card-image">
            <img src ="${country.flags.svg}">
        </div>
        <div class ="card-footer">
            <button class ="btn" onclick ="getMore('${
              country.name.common
            }')">More</button>
        </div>
    </div>`;
}

function getMore(more) {
  getBase(`${endpointList.name}/${more}`, (res) => {
    MoreTemplate(res);
    console.log(res);
  });
}

function MoreTemplate(base) {
  const template = base
    .map(
      ({
        area,
        borders,
        capital,
        capitalInfo: { latlng },
        car: { side, signs },
        coatOfArms: { png, svg },
        continents,
        fifa,
        flag,
        flags: { png: pngs, svg: svgs },
        independent,
        landlocked,
        name: { common, official, nativeName },
        population,
        postalCode: { format, regex },
        region,
        startOfWeek,
        status,
        subregion,
        timezones,
      }) => {
        return `
      <div class ="infoList">
          <div>
            <i>Area:${area}</i>
            <i>Borders:${borders}</i>
            <i>capital:${capital}</i>
            <i>CapitalInfo:${latlng}</i>
            <i>Car:${side} ${signs}</i>
            <i>Continents:${continents}</i>
            <div class="image">
              <img class="img1" src ="${png}">
              <img class="img2" src ="${svg}">
            </div>
            <i>Fifa:${fifa}</i>
            <i>Flag:${flag}</i>
            <div class="image2">
              <img class="img3" src ="${pngs}">
              <img class="img4" src ="${svgs}">
            </div>
            <i>Independent:${independent}</i>
            <i>Landlocked:${landlocked}</i>
          </div>
          <div>
            <i>${common} </br>${official}</i>
            <i>Population:${population}</i>
            <i>PostalCode:</br>Format:${format}</br>Regex:${regex}</i>
            <i>Region:${region}</i>
            <i>StartofWeek:${startOfWeek}</i>
            <i>Status:${status}</i>
            <i>Sugregion:${subregion}</i>
            <i>Timezones:${timezones}</i>
          </div>
      </div>  
      `;
      }
    )
    .join("");

  $container.innerHTML = template;
}

$select.addEventListener("change", (e) => {
  var value = e.target.value;

  if (value === "capital") {
    $search.setAttribute("placeholder", "Search by Capital...");
  } else {
    $search.setAttribute("placeholder", "Search by Name...");
  }
});

$search.addEventListener("input", (e) => {
  var value = e.target.value;
  var selected = $select.value;

  if (selected === "capital") {
    getBase(`${endpointList.capital}/${value}`, (res) => {
      Template(res);
    });
  } else {
    getBase(`${endpointList.name}/${value}`, (res) => {
      Template(res);
    });
  }
});
