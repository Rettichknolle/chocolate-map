const stage = $("#container");
const hoverLabel = $("#mouseover-label");
const labelTwo = $("#mouseover-labelTwo");
const stageHeight = stage.innerHeight();
const stageWidth = stage.innerWidth();
let companyData = [];
let originData = [];
let groupedByCompany;
let groupedByOrigin;
let maxCompanyAmount = 1;
let maxOriginAmount = 1
let beanAmount = [];
let toggleStatus = 0;

$(function () {
    prepareData();
    calculateCompanyAndOriginPositions();
    createMapCircles();
});


function prepareData() {
    //merge populationData with positionData

    /* positionData.forEach((country) => {
         //console.log(country.alpha3Code);
         populationData.forEach((popData) => {
             if (country.alpha3Code === popData.countryCode) {
                 //console.log("it's a match!");
                 let newCountry = country;
                 newCountry.population = popData.population;
                 data.push(newCountry);
             }
          });
     });*/
    companyData = gmynd.mergeData(beanData, positionData, "companyLocationTotal", "countryName");
    originData = gmynd.mergeData(beanData, positionData, "beanOriginTotal", "countryName");

    beanData = gmynd.mergeData(beanData, positionData, "companyLocationTotal", "countryName");
    gmynd.renameProps(beanData, ["latitude", "longitude"], ["companyLatitude", "companyLongitude"]);
    beanData = gmynd.mergeData(beanData, positionData, "beanOriginTotal", "countryName");
    gmynd.renameProps(beanData, ["latitude", "longitude"], ["originLatitude", "originLongitude"]);

    groupedByCompany = gmynd.groupData(beanData, "companyLocationTotal");
    groupedByOrigin = gmynd.groupData(beanData, "beanOriginTotal");

    //data = gmynd.mergeData(data, originNumbers, "companyLocationTotal", "beanOrigin");

    /*let calculations = [
         {
             value: ""
             method: 
         }
    ]*/
    //beanAmount = gmynd.groupData(beanData, ['companyLocationTotal', 'companyName']);
    console.log("Argentina has: ", +groupedByCompany["Argentina"].length + " companies.");
    /* console.log()
    maxPopulation = getMax(data, "population");
    console.log("maxPopulation ", maxPopulation);
}
 
function getMax(givenData, key) {
    let myMax = givenData[0][key];
    givenData.forEach(element => {
        if(element[key] > myMax) {
            myMax = element[key];
        }
    });
    console.log("maximum ", key, ": ", myMax);
    return myMax;
}
*/

    maxCompanyAmount = gmynd.dataMax(Object.keys(groupedByCompany));
    console.log("maxCompanyAmount ", maxCompanyAmount);

    maxOriginAmount = gmynd.dataMax(Object.keys(groupedByOrigin));
    console.log("maxOriginAmount ", maxOriginAmount);
}

function stackedCompanyDiagram() {
    /*let companyLongitude = gmynd.map(data[i].longitude, -180, 180, 0, stageWidth)
    let companyLatitude = gmynd.map(data[i].latitude, -90, 90, stageHeight, 0)*/
    const companyCount = Object.keys(groupedByCompany).length;
    let companyIndex = 0;
    for (const prop in groupedByCompany) {
        const companyCountries = groupedByCompany[prop];
        console.log(prop, ":", companyCountries.length);
        companyCountries.forEach((company, index) => {
            const width = stageWidth / ((companyCount * 2) - 1);
            const height = 5;
            const diagramY = index * height;
            const diagramX = companyIndex * width * 2
            let companyBox = $("<div></div>")
            companyBox.css({
                position: "absolute",
                width: width,
                height: height,
                left: diagramX,
                top: stageHeight - diagramY,
                "background-color": "#a75f29"
            });
            companyBox.data(companyData[i]);

            companyBox.mouseover(function () {
                companyBox.addClass("highlight");
                hoverLabel.html(`<p>Company: ${companyBox.data().companyName}<p>
                <p>Manufactured: ${companyBox.data().companyLocationTotal}<p><p>Origin: ${companyBox.data().beanOriginTotal}<p>`);
            });
            companyBox.mouseout(function () {
                companyBox.removeClass("highlight");
            });
            stage.append(companyBox)
        });
        companyIndex++;

    }
    /*companyBox.data (data[i]);
    companyBox.mouseover(function () {
        companyBox.addClass("highlight");
        label.text(companyBox.data().companyLocationTotal);
    });*/
}

function drawCompanyMap() {

    for (let i = 0; i < companyData.length; i++) {
        let companyLongitude = gmynd.map(companyData[i].longitude, -180, 180, 0, stageWidth)
        let companyLatitude = gmynd.map(companyData[i].latitude, -90, 90, stageHeight, 0)
        const companyArea = gmynd.map(companyData[i].companyAmount, 1, maxCompanyAmount, 10, 900) * 5;
        //const countryRadius = Math.sqrt(countryArea / Math.PI)
        const companyRadius = gmynd.circleRadius(companyArea);
        //alternativ: data[i]["longitude"]
        let companyCircle = $("<div></div>")
        companyCircle.addClass("companyCircle");
        companyCircle.css({
            width: companyRadius * 2,
            height: companyRadius * 2,
            left: companyLongitude - companyRadius,
            top: companyLatitude - companyRadius + 100,

        });

        companyCircle.data(companyData[i]);

        companyCircle.mouseover(function () {
            companyCircle.addClass("highlight");
            hoverLabel.text(companyCircle.data().companyLocation);
            labelTwo.text(companyCircle.data().companyAmount);
        });

        /*countryCircle.data (data[i]);
 
        countryCircle.mouseover(function() {
            countryCircle.addClass("highlight");
            label.text(countryCircle.data().companyAmount);
        });
           */
        companyCircle.mouseout(function () {
            companyCircle.removeClass("highlight");
            // countryCircle.addclass("no-highlight-anymore"); nach hover andere Farbe, muss in Style.css Rangordnung ändern (highlight unter no highlight)
        });
        //companyCircle.onclick ({ drawOriginMap()});
        stage.append(companyCircle);
    }
}

function drawOriginMap() {

    for (let i = 0; i < companyData.length; i++) {
        let originLongitude = gmynd.map(companyData[i].longitude, -180, 180, 0, stageWidth)
        let originLatitude = gmynd.map(companyData[i].latitude, -90, 90, stageHeight, 0)
        const originArea = gmynd.map(companyData[i].originAmount, 1, maxOriginAmount, 10, 900) * 5;
        //const countryRadius = Math.sqrt(countryArea / Math.PI)
        const originRadius = gmynd.circleRadius(originArea);
        //alternativ: data[i]["longitude"]
        let originCircle = $("<div></div>")
        originCircle.addClass("originCircle");
        originCircle.css({
            width: originRadius * 2,
            height: originRadius * 2,
            left: originLongitude - originRadius,
            top: originLatitude - originRadius + 100,

        });

        originCircle.data(companyData[i]);

        originCircle.mouseover(function () {
            originCircle.addClass("highlight");
            hoverLabel.text(originCircle.data().beanOrigin);
            labelTwo.text(originCircle.data().originAmount);
        });

        /*countryCircle.data (data[i]);
 
        countryCircle.mouseover(function() {
            countryCircle.addClass("highlight");
            label.text(countryCircle.data().companyAmount);
        });
           */
        originCircle.mouseout(function () {
            originCircle.removeClass("highlight");
            // countryCircle.addclass("no-highlight-anymore"); nach hover andere Farbe, muss in Style.css Rangordnung ändern (highlight unter no highlight)
        });
        //companyCircle.onclick ({ drawOriginMap()});
        stage.append(originCircle);
    }
}

function calculateCompanyAndOriginPositions() {
    var radius = gmynd.circleRadius(200);

    for (const prop in groupedByCompany) {
        let companyLongitude = gmynd.map(groupedByCompany[prop][0].companyLongitude, -180, 180, 0, stageWidth)
        let companyLatitude = gmynd.map(groupedByCompany[prop][0].companyLatitude, -90, 90, stageHeight, 0)
        //circleCount = Object.keys(groupedByCompany[prop]).length;
        circleCount = groupedByCompany[prop].length;

        for (i = 0; i < circleCount; i++) {
            const companyCountries = groupedByCompany[prop];
            console.log(prop, ":", companyCountries.length);
            // companyCountries.forEach((companyLocationTotal, index) => {
            // console.log(index);
            let theta = 2.39998131 * i; //unbedingt mit dieser Zahl rumspielen! 2.2 kommt ganz cool
            let spiralRadius = radius * Math.sqrt(theta) * 0.3; // *1.5 entzerrt alles ein bisschen
            let xPos = (companyLongitude) + Math.cos(theta) * spiralRadius;
            let yPos = (companyLatitude) + Math.sin(theta) * spiralRadius;
            groupedByCompany[prop][i].companyX = xPos;
            groupedByCompany[prop][i].companyY = yPos;
        };

    }

    for (const prop in groupedByOrigin) {
        let originLongitude = gmynd.map(groupedByOrigin[prop][0].originLongitude, -180, 180, 0, stageWidth)
        let originLatitude = gmynd.map(groupedByOrigin[prop][0].originLatitude, -90, 90, stageHeight, 0)
        circleCount = groupedByOrigin[prop].length;

        for (i = 0; i < circleCount; i++) {
            const originCountries = groupedByOrigin[prop];
            console.log(prop, ":", originCountries.length);
            // companyCountries.forEach((companyLocationTotal, index) => {
            // console.log(index);
            let theta = 2.39998131 * i; //unbedingt mit dieser Zahl rumspielen! 2.2 kommt ganz cool
            let spiralRadius = radius * Math.sqrt(theta) * 0.3; // *1.5 entzerrt alles ein bisschen
            let xPos = (originLongitude) + Math.cos(theta) * spiralRadius;
            let yPos = (originLatitude) + Math.sin(theta) * spiralRadius;
            groupedByOrigin[prop][i].originX = xPos;
            groupedByOrigin[prop][i].originY = yPos;
        };
    }



    /* $( ".toggleOrigin" ).click(function() {
         $( ".block" ).animate({ "left": "+=50px" }, "slow" );
       });
        
       $( "#left" ).click(function(){
         $( ".block" ).animate({ "left": "-=50px" }, "slow" );
       });*/

}

function createMapCircles() {
    console.log("creating circles");
    const radius = gmynd.circleRadius(70);
    beanData.forEach(chocolate => {
        let chocCirc = $("<div></div>");
        chocCirc.addClass("chocCirc");
        chocCirc.css({
            position: "absolute",
            width: radius,
            height: radius,
            left: chocolate.originX,
            top: chocolate.originY,
            "background-color": "#6D340C",
            "border-radius": "50%"
        });
        chocCirc.data(chocolate);
        stage.append(chocCirc)
    })
}

function companyCluster() {
    console.log("showing companies");
    let circles = $(".chocCirc");
    circles.each(function () {
        let dat = $(this).data();
        $(this).animate({
            left: dat.companyX,
            top: dat.companyY
        }, 500);
    });
}

function originCluster() {
    console.log("showing origins");
    let circles = $(".chocCirc");
    circles.each(function () {
        let dat = $(this).data();
        $(this).animate({
            left: dat.originX,
            top: dat.originY
        }, 500);
    });
}