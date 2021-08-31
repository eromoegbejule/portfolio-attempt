let topTitleDiv = "<h4>Wednesday 4th August 2021</h4>";

let titleDiv =
  "<h1>In California, disadvantaged communities bear the brunt of polluting gas plants.</h1>";

let bylineDiv = "<h4>By Eromo Egbejule, Will Jarrett, and Harrison Connery</h4>";

let descriptionDiv =
  '<p>Three years ago, the California Energy Commission (CEC) was bombarded with more than 1,500 emails that had the same request: &quot;Deny NRG&apos;s request for a further extension on the application for the Puente Power Plant in Oxnard.&quot;</p>' +
  '<p style="max-width:600px; margin-left:auto; margin-right:auto">Emails poured in throughout the summer in opposition to NRG Energy, one of the country’s largest power producers, building a new gas plant. For residents of Oxnard, a city in Southern California that was already home to multiple power stations, the new plant posed too great a health risk. They decided to use every tool at their disposal to keep it from opening: locals testified at a CEC hearing; the mayor instituted a lawsuit against NRG Energy; and a group of youths even penned a <a href="https://www.facebook.com/watch/?v=1841674109183950">rap</a> in solidarity.</p>' +
  '<p style="max-width:600px; margin-left:auto; margin-right:auto">Remarkably, their efforts came to fruition.</p>' +
  '<p style="max-width:600px; margin-left:auto; margin-right:auto">&quot;We won the very first environmental justice review that we&apos;ve ever had in the state,&quot; said Shana Lazerow, legal director at non-profit Communities for a Better Environment. The CEC decided to scrap the project in April 2019.</p>' +
  '<p style="max-width:600px; margin-left:auto; margin-right:auto">This hard-fought win was highly unusual in a state where corporate interests routinely override the objections of host communities and environmentalists. For decades, gas companies in California have secured licenses for siting gas plants near residential areas. As well as contributing to climate change by emitting greenhouse gases, these plants have released thousands of tons of nitrogen oxides and fine particles, which can cause respiratory problems.</p>' +
  '<p style="max-width:600px; margin-left:auto; margin-right:auto">Low-income minority neighborhoods have borne most of the burden. And some experts worry that the power outages California saw in 2020 will be used to justify their continued use for decades to come.</p>';

let footerDiv =
  '<p>This story is based on <a href="https://ampd.epa.gov/ampd/">EPA power plant data</a> and California’s <a href="https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-30">CalEnviroScreen</a>.</p>' +
  '<p><a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> | <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a> | <a href="https://willjarrettdata.github.io/">Will Jarrett Data</a></p>';

let divChapter1 =
  "<h3>Pollution in California</h3>" +
  '<p>Pollution sensors around California reveal that poisonous nitrogen oxides accumulate near gas power plants. Sensors within five miles of plants detect on average 33% more harmful NOx gas than sensors elsewhere.</p>' +
  '<p>In the map to the right, green circle are sensors with low levels of pollution, yellow circles mark sensors with moderate pollution and red sensors have the highest pollution. Click on them for their readings. Gas plants are marked by black squares.</p>' +
  '<img height="200px" src="images/key2.svg">';

let divChapter2 =
  "<h3>Gas power and political power</h3>" +
  '<img src="images/GasPlant_SantaClara.jpg">' +
  '<p class="imageCredit"><a href="https://unsplash.com/photos/bv2pvCGMtzg">American Public Power Association</a></p>' +
  '<p>Analysis of data from the <a href="https://ww3.arb.ca.gov/ei/tools/pollution_map/">EPA</a> and the <a href="https://oehha.ca.gov/calenviroscreen">California Office of Environmental Health Hazard Assessment</a> shows that over half of the state’s gas power stations have been sited in areas classified as “disadvantaged.”</p>' +
  '<p>Mark Specht, Senior Energy Analyst at the Union of Concerned Scientists, suggested that the discrepancy may be down to "systemic racism." He added that he believed that "sometimes companies go down the path of least resistance when they are trying to site gas plants in a community."</p>' +
  '<img height="80px" src="images/key1.svg">';

let divChapter3 =
  "<h3>Pollution in Los Angeles</h3>" +
  '<img src="images/Pollution_LosAngeles.jpg">' +
  '<p class="imageCredit"><a href="https://unsplash.com/photos/I8dvywXBqS0">Andrea Leopardi</a></p>' +
  '<p>NOx emissions from power plants can lead to ozone pollution in sunny weather. In built-up areas like Los Angeles, this is a significant contributor to smog, and can cause lung damage and respiratory infections.</p>' +
  '<p>Although gas plants are not the biggest source of NOx or fine particles – cars produce more every year – they are stationary and consistent emitters, meaning that nearby communities could be exposed to elevated levels of pollutants every day.</p>';

let divChapter4 =
  "<h3>Magnolia and Olive</h3>" +
  '<img src="images/MagnoliaPowerPlant.jpg">' +
  '<p class="imageCredit"><a href="https://www.google.com/earth/download/gep/agree.html?hl=en-GB">Google Earth Pro</a></p>' +
  '<p>Some gas plants are built in open areas with few neighbors to breathe the pollutants. But many, such as the Magnolia and Olive plants in Burbank, are sited in the center of urban communities. There are over 33,000 people living within a mile of these plants and the tract is in the top 1% most polluted in the state.</p>' +
  '<p>It is hard to say exactly what impacts plants like these have on health, because their pollution mixes with emissions from other sources. But data shows that tracts that host gas plants typically have higher-than-average rates of cardiovascular disease, asthma, and even low birth-weights.</p>';
 
let divChapter5 =
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>The health impacts of harmful pollutants are particularly pronounced for people whose respiratory systems are already weaker than usual. This includes the elderly, the infirm – and children.</p>" +
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>Around Magnolia alone, there are five schools within a mile.</p>" +
  '<div style="display:flex; justify-content:center; align-items:center;"><img style="max-width:400px; min-width:200px;" src="images/MagnoliaSchools.svg"></div>' +
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>And the schools in Burbank are not an outlier. According to data from <a href='https://www.openstreetmap.org/'>OpenStreetMap</a>, at least 80 schools across California fall within a mile of a gas power station.</p>" +
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>Children in poor minority communities face the greatest exposure, with around two-thirds of these schools in disadvantaged areas.</p>" +
  "<embed type='text/html' src='images/GasPlantSchoolSmallMultiples_1280_V3.html' width='100%' height='1150px'></embed>" +
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>Experts say that communities inhabited by wealthy white residents are often barely considered by energy companies.</p>" +
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>“The vital work of ensuring just and equitable access to the benefits of a clean energy economy must start with eliminating the historical inequities which plague the renewable energy sector and our most vulnerable communities,” says Panama Batholomy, Director of the Building Decarbonization Coalition. She noted that renewable power has often benefitted richer communities, while poorer areas tend to be reliant on dirty fuels like gas for longer.</p>" +
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>Activists say that regulators sometimes overlook complaints about new gas projects in poorer areas. A law enacted during an energy crisis in the 1970s gives the CEC the right to make the final decision on power plant sites, subject to judicial review, so citizens have limited tools to stop new constructions.</p>" +
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>These powers were used liberally two decades ago, when a slew of new gas plants and extensions were approved by Governor Gray Davis after landmark blackouts led to a state of emergency. The blackouts were ultimately found to be caused primarily by market manipulation, but the gas plants went ahead nonetheless. Gas power now accounts for almost half of the state’s energy generation.</p>" +
  '<div style="display:flex; justify-content:center; align-items:center;"><img style="max-width:1000px; min-width:200px;" src="images/GasPlantUnitBuilds.svg"></div>' +
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>Now, since California’s blackouts in August 2020, experts are divided on whether history might be repeating itself. Some believe that the failure of Oxnard's plant shows that a new series of power stations is unlikely today. But others point out that incumbent Governor Gavin Newsom, facing the threat of recall, has been handing out gas plant licenses and attempting to reboot old plants.</p>" +
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>“Putting another gas-fired power plant on the beach where these retiring dinosaurs fit is basically locking in another 30 years of industrial beaches instead of parks,” Lazerow warned.</p>" +
  "<p style='max-width:600px; margin-left:auto; margin-right:auto; font-size:18px' class='bigFeature'>“People went to jail because of market manipulation, but we still have people who think that that blackout happened because we didn't have enough gas-fired power plants – and, well, it's happening again.”</p>";
  
var config = {
  style: "mapbox://styles/willjarrett/ckrwbjcka1p1p18qgvx2lnldy",
  accessToken:
    "pk.eyJ1Ijoid2lsbGphcnJldHQiLCJhIjoiY2tyd2NrcGxhMGZkeTJvb2U1djdjcWhjciJ9.ZW7zFyP-Ye5TDLa1hXmXQg",
  showMarkers: false,
  markerColor: "#3FB1CE",
  theme: "light",
  use3dTerrain: false,
  topTitle: topTitleDiv,
  title: titleDiv,
  subtitle: "",
  byline: bylineDiv,
  description: descriptionDiv,
  footer: footerDiv,
  chapters: [
    {
      id: "sensorMap",
      alignment: "left",
      hidden: false,
      chapterDiv: divChapter1,
      location: {
        center: [-123, 36.7],
        zoom: 5,
        zoomSmall: 9,
        pitch: 0,
        bearing: 0,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [
        {
          layer: "plants",
          opacity: 1,
          duration: 100,
        },
        {
          layer: "allSensors1",
          opacity: 0.5,
          duration: 100,
        },
        {
          layer: "gasPlantData",
          opacity: 0,
          duration: 100,
        },
      ],
      onChapterExit: [],
    },
    {
      id: "overallMap",
      alignment: "left",
      hidden: false,
      chapterDiv: divChapter2,
      location: {
        center: [-123, 36.7],
        zoom: 5,
        zoomSmall: 9,
        pitch: 0,
        bearing: 0,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [
        {
          layer: "gasPlantData",
          opacity: 1,
          duration: 100,
        },
        {
          layer: "allSensors1",
          opacity: 0,
          duration: 100,
        },
        {
          layer: "plants",
          opacity: 0,
          duration: 100,
        },
      ],
      onChapterExit: [
        {
          layer: "gasPlantData",
          opacity: 0,
          duration: 100,
        },
      ],
    },
    {
      id: "LosAngeles",
      alignment: "left",
      hidden: false,
      title: "",
      image: "",
      description: "",
      chapterDiv: divChapter3,
      location: {
        center: [-118.315, 34],
        zoom: 9,
        zoomSmall: 14,
        pitch: 40,
        bearing: -7,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [
        {
          layer: "gasPlantData",
          opacity: 1,
          duration: 100,
        },
      ],
      onChapterExit: [
        {
          layer: "gasPlantData",
          opacity: 0,
          duration: 100,
        },
      ],
    },
    {
      id: "AESAlamitos",
      alignment: "left",
      hidden: false,
      title: "",
      image: "",
      description: "",
      chapterDiv: divChapter4,
      location: {
        center: [-118.31655, 34.1775],
        zoom: 17,
        zoomSmall: 20,
        pitch: 50,
        bearing: -20,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [
        {
          layer: "gasPlantData",
          opacity: 0,
          duration: 100,
        },
      ],
      onChapterExit: [],
    },
    {
      id: "satellite",
      alignment: "full",
      chapterDiv: divChapter5,
    },
  ],
};


  console.log(plants)
  // Create the popup
  map.on('click', 'plants', function (e) {
    var name = e.features[0].properties.facility_name;
    var year = e.features[0].properties.start_date;
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('The ' +name + ' plant went online on ' +year)
        .addTo(map);
  });
  // Change the cursor to a pointer when the mouse is over the us_states_elections layer.
  map.on('mouseenter', 'plants', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'plants', function () {
    map.getCanvas().style.cursor = '';
  });
  
  map.on('click', 'allSensors1', function (e) {
    var name = e.features[0].properties.local_site_name;
    var pollution = e.features[0].properties.arithmetic_mean;
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('The nitrogen oxide reading at '+name+ ' sensor is '+ pollution+  ' parts per billion.')
        .addTo(map);
  });
  map.on('mouseenter', 'allSensors1', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'allSensors1', function () {
    map.getCanvas().style.cursor = '';
  });
  map.on('click', 'nox', function (e) {
    var name = e.features[0].properties.local_site_name;
    var pollution = e.features[0].properties.arithmetic_mean;
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(name+' The nitrogen oxide reading at this sensor is '+ pollution+  ' parts per billion')
        .addTo(map);
  });
  map.on('mouseenter', 'nox', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'nox', function () {
    map.getCanvas().style.cursor = '';
  });