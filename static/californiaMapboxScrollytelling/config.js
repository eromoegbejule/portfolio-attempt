let topTitleDiv = "<h4>Points Unknown | Assignment | Mapbox Storytelling</h4>";

let titleDiv =
  "<h1>Most of California's Gas Plants are in Disadvantaged Communities. One Community is Fighting Back</h1>";

let bylineDiv = "<p>By Eromo Egbejule</p>";

let descriptionDiv =
  '<p>This story looks at gas plants in California - which has the most concentration of fossil fuel plants in the US - with relation to disadvantaged, low income communities using Mapbox GL JS, in addition to Intersection Observer and Scrollama as the main JavaScript libraries. Oxnard, the focus of the article,, is trying to buck that trend</p>' +
  '<p>---</p>' +
  "<p>Throughout May and early June 2018, the California Energy Commission (CEC) was bombarded with more than 1,500 emails with the same request.  “Deny NRG's request for a further extension on the application for the Puente Power Plant in Oxnard”, they said matter-of-factly. By July, the emails were still wafting in.</p>" +
  "<p>By April 2019, CEC made a final decision to reject the application.</p>"
  '<p style="text-align:center">Scroll to continue<br>▼</p>';

let footerDiv =
  '<p>This story is based on data by California Office of Environmental Health Hazard Assessment tool, <a href="https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-30">CalEnviroScreen</a></p>' +
  '<p><a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> | <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a> | <a href="https://brown.columbia.edu">The Brown Institute for Media Innovation</a></p>';

let divChapter1 =
  "<h3>Oxnard Fights Against Yet Another Plant</h3>" +
  '<img src="images/Chapter_1_Image.jpg">' +
  '<p class="imageCredit"><a href="http://www.latimes.com/">Ricardo DeAratanha, LA Times</a></p>' +
  "<p>If the new plant had gone ahead, it would have been the fourth new plant in Oxnard, which already has the most number of coastal power plants statewide It was a hard-fought win but also a rare one in a climate where other gas plant operators routinely override objections of environmentalists and disadvantaged populations.</p>";

let divChapter2 =
  "<h3>But California's Disadvantaged Communities Still House Most of these Gas Plants</h3>" +
  '<img src="images/Chapter_2_Image.jpg">' +
  '<p class="imageCredit"><a href="https://www.greenamerica.org/environmental-justice-fossil-fuels-telecoms">Green America</a></p>' +
  "<p>These plants are less than 10km away from residential areas. According to a 2017 report by Californian-based energy science and policy research institute, PSE Healthy Energy, more than two-thirds of peaker plants are located in areas considered to be in the most disadvantaged half of communities in the state.</p>";

let divChapter3 =
  "<h3>Health Risks. Schools at Risk. Beaches For Pensioners Gone.</h3>" +
  '<img src="images/Chapter_3_Image.jpg">' +
  '<p class="imageCredit"><a href="https://earthjustice.org/blog/2014-march/california-cities-in-fracas-over-huge-gas-fired-power-plant">Earthjustice</a></p>' +
  "<p>85% of Oxnard's 200,000 residents for instance, fall into this category of undocumented immigrants with no healthcare plans despite poor air quality in the area. The other communities follow a similar pattern and the locals are exposed to all of the greenhouse gases from these fossil fuel plants, as well as agricultural pesticides by-products since California is a major farming state. Experts say this has led to increased risk of cancer and premature baby deliveries.</p>";

let divChapter5 =
  "<h3>Fossil Power VS Political Power</h3>" +
  '<img src="images/Chapter_4_Image.jpg">' +
  '<p class="imageCredit"><a href="https://www.politico.com/states/california/story/2021/08/04/newsom-can-reference-trump-in-argument-against-recall-judge-says-1389479">Jeff Chiu, AP Photo</a></p>' +
  "<p>The rolling blackouts of 200/2001 triggered by market manipulations led first to many gas licenses being issued, then the recall of Governor Gray Davis and the election of Arnold Schwarzenegger as his successor. Two decades later, it is almost déjà vu: Governor Gavin Newsom is on the verge of being recalled after 2020's blackouts that were not resolved by his desperate moves of licensing new gas plants and reopening old ones. In 1989, Sacramento the state capital also made history by being first community to shut down a nuclear power plant by public vote.</p>";

var config = {
  style: "mapbox://styles/egbejulee/ckrxpt9q70xqy17qqp94lpk92",
  accessToken:
    "pk.eyJ1IjoiZWdiZWp1bGVlIiwiYSI6ImNrcm03eTNvdDUyMngycXIyeGJiaDF4bjQifQ.QDsLNFwhi0vOAU9dsBPN_Q",
  showMarkers: true,
  markerColor: "#3FB1CE",
  theme: "light",
  use3dTerrain: true,
  topTitle: topTitleDiv,
  title: titleDiv,
  subtitle: "",
  byline: bylineDiv,
  description: descriptionDiv,
  footer: footerDiv,
  chapters: [
    {
      id: "overallMap",
      alignment: "left",
      hidden: false,
      chapterDiv: divChapter1,
      location: {
        center: [-119.1664, 34.1962],
        zoom: 10,
        zoomSmall: 9,
        pitch: 0,
        bearing: 0,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: [],
    },
    {
      id: "incomeUnderlay",
      alignment: "left",
      hidden: false,
      title: "",
      image: "",
      description: "",
      chapterDiv: divChapter2,
      location: {
        center: [-118.7289, 35.3444],
        zoom: 10,
        zoomSmall: 9,
        pitch: 0,
        bearing: 0,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [
        {
          layer: "calenviroscreen",
          opacity: 1,
          duration: 300,
        },
      ],
      onChapterExit: [
        {
          layer: "calenviroscreen",
          opacity: 0,
          duration: 300,
        },
      ],
    },
    {
      id: "oxnard",
      alignment: "left",
      hidden: false,
      title: "",
      image: "",
      description: "",
      chapterDiv: divChapter3,
      location: {
        center: [-119.1664, 34.1962],
        zoom: 16,
        zoomSmall: 14,
        pitch: 40,
        bearing: -7,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [
        {
          layer: "calenviroscreen",
          opacity: 0,
          duration: 300,
        },
      ],
      onChapterExit: [
        {
          layer: "calenviroscreen",
          opacity: 0,
          duration: 300,
        },
      ],
    },
    {
      id: "sacramento",
      alignment: "right",
      hidden: false,
      title: "",
      image: "",
      description: "",
      chapterDiv: divChapter5,
      location: {
        center: [-121.12, 38.3384],
        zoom: 15,
        zoomSmall: 14,
        pitch: 40,
        bearing: 8,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [
        {
          layer: "calenviroscreen",
          opacity: 1,
          duration: 300,
        },
      ],
      onChapterExit: [
        {
          layer: "calenviroscreen",
          opacity: 0,
          duration: 300,
        },
      ],
    },
  ],
};