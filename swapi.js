var swplanets = (() => {
  let basePage = "https://swapi.co/api/planets/",
      svgElement = document.querySelector("svg"),
      svgNs = "http://www.w3.org/2000/svg",
      planetInfo = document.querySelector("#planet-info"),
      nextPage = basePage,
      planets = [],
      largestPlanet,
      largestPlanetDiameter = 0;

  let findLargestPlanetInPage = (data) => {
    let dataObject, resultsArray, resultsLength, planetData;
    nextPage = data["next"];
    resultsArray = data["results"];
    resultsLength = resultsArray.length;
    for(let i = 0; i < resultsLength; ++i){
      planetData = resultsArray[i];
      planets.push([planetData["name"], Number(planetData["diameter"])]);
      if(Number(planetData["diameter"]) > largestPlanetDiameter){
        largestPlanetDiameter = Number(planetData["diameter"]);
        largestPlanet = planetData["name"];
      }
    }
  };

  let fetchDataInPage = (url, callback) => {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {
      if(ajax.readyState == 4 && ajax.status == 200){
        callback(JSON.parse(ajax.response));
        if(nextPage !== null){
          console.log(nextPage);
          fetchDataInPage(nextPage, callback)
        }
        else{
          drawPlanets();
        }
      }
    };
    ajax.open("GET", url, true);
    ajax.send();
  };

  let fetchAllData = () => {
    fetchDataInPage(nextPage, findLargestPlanetInPage);
  };

  let randomColor = () => {
    let r1 = parseInt(Math.random() * 10),
        r2 = parseInt(Math.random() * 10),
        g1 = parseInt(Math.random() * 10),
        g2 = parseInt(Math.random() * 10),
        b1 = parseInt(Math.random() * 10),
        b2 = parseInt(Math.random() * 10);
    return "#"+r1+""+r2+""+g1+""+g2+""+b1+""+b2;
  }

  let drawPlanet = (cx, cy, radius, name, diameter) => {
    let planet = document.createElementNS(svgNs, "circle");
    planet.setAttributeNS(null, "cx", cx);
    planet.setAttributeNS(null, "cy", cy);
    planet.setAttributeNS(null, "r", radius);
    planet.setAttributeNS(null, "fill", randomColor());
    planet.setAttributeNS(null, "data-name", name);
    planet.setAttributeNS(null, "data-diameter", diameter);
    svgElement.appendChild(planet);
  };

  let drawPlanets = () => {
    let cx = 5, cy = 100, name, diameter, radius;
    planets.sort((planet1, planet2) => {
      if(isNaN(planet1[1])) return 1;
      else if(isNaN(planet2[1])) return -1;
      else return planet1[1] - planet2[1];
    });
    for(let planet of planets){
      name = planet[0];
      diameter = planet[1];
      if (!isNaN(diameter)){
        radius = 200 * (diameter/largestPlanetDiameter)/2;
        cx += 2 * radius;
        if (cx > svgElement.getClientRects()[0].width){
          cx = 2 * radius;
          cy += 2 * radius;
        }
        drawPlanet(cx + 2, cy, radius, name, diameter);
      }
    }
  }

  let displayPlanetInfo = (name, diameter) => {
    var template = `<h2>${name}</h2><p>Diameter: ${diameter}</p>`;
    planetInfo.innerHTML = "";
    planetInfo.innerHTML = template;
  }

  let svgAddMouseoverListener = () => {
    svgElement.addEventListener('mouseover', (evt) => {
      let target = evt.target;
      if(target.getAttribute("data-name")){
        displayPlanetInfo(target.getAttribute("data-name"), target.getAttribute("data-diameter"));
      }
    });
  }

  let init = () => {
    fetchAllData();
    svgAddMouseoverListener();
  }

  return {init};

})();

window.onload = swplanets.init;
