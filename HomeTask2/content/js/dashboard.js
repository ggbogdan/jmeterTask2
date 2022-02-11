/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.893, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8181818181818182, 500, 1500, "Open Random Product Page  \/hp-spectre-xt-pro-ultrabook"], "isController": false}, {"data": [0.8867924528301887, 500, 1500, "Open Random Product Page  \/samsung-series-9-np900x4c-premium-ultrabook"], "isController": false}, {"data": [0.9857142857142858, 500, 1500, "ADD TO CART \/htc-one-mini-blue"], "isController": false}, {"data": [0.581, 500, 1500, "Shopping Cart"], "isController": false}, {"data": [0.9836065573770492, 500, 1500, "ADD TO CART \/night-visions"], "isController": false}, {"data": [1.0, 500, 1500, "ADD TO CART \/samsung-series-9-np900x4c-premium-ultrabook"], "isController": false}, {"data": [0.9958333333333333, 500, 1500, "ADD TO CART \/flower-girl-bracelet"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "Open Random Product Page  \/htc-one-mini-blue"], "isController": false}, {"data": [0.96, 500, 1500, "Open Random Product Page  \/apple-macbook-pro-13-inch"], "isController": false}, {"data": [1.0, 500, 1500, "ADD TO CART \/pride-and-prejudice"], "isController": false}, {"data": [0.9743589743589743, 500, 1500, "ADD TO CART \/htc-one-m8-android-l-50-lollipop"], "isController": false}, {"data": [0.975609756097561, 500, 1500, "Open Random Product Page  \/ray-ban-aviator-sunglasses"], "isController": false}, {"data": [0.96875, 500, 1500, "ADD TO CART \/hp-envy-6-1180ca-156-inch-sleekbook"], "isController": false}, {"data": [1.0, 500, 1500, "ADD TO CART \/ray-ban-aviator-sunglasses"], "isController": false}, {"data": [1.0, 500, 1500, "ADD TO CART \/portable-sound-speakers"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "Open Random Product Page  \/beats-pill-20-wireless-speaker"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "Open Random Product Page  \/pride-and-prejudice"], "isController": false}, {"data": [0.976, 500, 1500, "Open Host Page"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "ADD TO CART \/beats-pill-20-wireless-speaker"], "isController": false}, {"data": [0.9836065573770492, 500, 1500, "Open Random Product Page  \/night-visions"], "isController": false}, {"data": [0.973, 500, 1500, "Search Random Product"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "Open Random Product Page  \/htc-one-m8-android-l-50-lollipop"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "Open Random Product Page  \/flower-girl-bracelet"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "ADD TO CART \/hp-spectre-xt-pro-ultrabook"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "ADD TO CART \/first-prize-pies"], "isController": false}, {"data": [0.84375, 500, 1500, "Open Random Product Page  \/hp-envy-6-1180ca-156-inch-sleekbook"], "isController": false}, {"data": [1.0, 500, 1500, "ADD TO CART \/apple-macbook-pro-13-inch"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "Open Random Product Page  \/portable-sound-speakers"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "Open Random Product Page  \/first-prize-pies"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2500, 0, 0.0, 423.7691999999994, 281, 2309, 393.5, 560.0, 594.0, 811.8999999999978, 11.344350966992478, 90.09282940591903, 9.340659408834528], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Open Random Product Page  \/hp-spectre-xt-pro-ultrabook", 11, 0, 0.0, 494.27272727272725, 430, 683, 463.0, 650.8000000000002, 683.0, 683.0, 0.052484421669386314, 0.6479011748160659, 0.04085901044201425], "isController": false}, {"data": ["Open Random Product Page  \/samsung-series-9-np900x4c-premium-ultrabook", 53, 0, 0.0, 484.6226415094339, 404, 834, 471.0, 601.0000000000002, 684.6999999999998, 834.0, 0.26301424246935634, 3.2524169085901447, 0.20866384577688454], "isController": false}, {"data": ["ADD TO CART \/htc-one-mini-blue", 35, 0, 0.0, 330.94285714285706, 289, 535, 314.0, 392.9999999999999, 490.9999999999998, 535.0, 0.16689475616676125, 0.4169155807579883, 0.1790253599562259], "isController": false}, {"data": ["Shopping Cart", 500, 0, 0.0, 557.6079999999997, 391, 1844, 544.0, 618.6000000000001, 729.9, 893.96, 2.315093483474863, 26.285033333005362, 1.7502151951739562], "isController": false}, {"data": ["ADD TO CART \/night-visions", 61, 0, 0.0, 325.42622950819674, 294, 525, 316.0, 341.8, 355.9, 525.0, 0.29305366725437537, 0.737973164571253, 0.3144049614346178], "isController": false}, {"data": ["ADD TO CART \/samsung-series-9-np900x4c-premium-ultrabook", 53, 0, 0.0, 321.35849056603774, 294, 390, 316.0, 350.6, 376.7, 390.0, 0.2632140923831801, 0.6625213939048555, 0.2815952357007703], "isController": false}, {"data": ["ADD TO CART \/flower-girl-bracelet", 120, 0, 0.0, 323.94166666666666, 281, 506, 315.0, 348.8, 390.1499999999998, 501.3799999999998, 0.5637693619540246, 1.4177459766834388, 0.6045334470855472], "isController": false}, {"data": ["Open Random Product Page  \/htc-one-mini-blue", 35, 0, 0.0, 470.3714285714286, 386, 705, 459.0, 536.1999999999999, 656.1999999999997, 705.0, 0.16689475616676125, 1.9954493984040094, 0.1282817171563041], "isController": false}, {"data": ["Open Random Product Page  \/apple-macbook-pro-13-inch", 25, 0, 0.0, 396.6, 339, 707, 374.0, 501.00000000000034, 673.0999999999999, 707.0, 0.12005724329360239, 1.1072138570670496, 0.09326009141158503], "isController": false}, {"data": ["ADD TO CART \/pride-and-prejudice", 27, 0, 0.0, 322.18518518518516, 293, 465, 312.0, 352.6, 420.9999999999998, 465.0, 0.12619122176471412, 0.3141498698945135, 0.13531963769098107], "isController": false}, {"data": ["ADD TO CART \/htc-one-m8-android-l-50-lollipop", 39, 0, 0.0, 333.025641025641, 297, 598, 317.0, 350.0, 576.0, 598.0, 0.1941013109303923, 0.4912022958701214, 0.20819620780784967], "isController": false}, {"data": ["Open Random Product Page  \/ray-ban-aviator-sunglasses", 41, 0, 0.0, 456.75609756097566, 384, 797, 449.0, 479.0, 552.5999999999999, 797.0, 0.20015035685344112, 2.315230099684641, 0.1555903962610937], "isController": false}, {"data": ["ADD TO CART \/hp-envy-6-1180ca-156-inch-sleekbook", 16, 0, 0.0, 334.8125, 293, 572, 319.0, 418.70000000000016, 572.0, 572.0, 0.09193447370386758, 0.233382484758988, 0.09833689280153071], "isController": false}, {"data": ["ADD TO CART \/ray-ban-aviator-sunglasses", 41, 0, 0.0, 320.6585365853659, 288, 439, 315.0, 339.20000000000005, 404.99999999999994, 439.0, 0.20029115494719155, 0.5050691828853651, 0.21483688025764283], "isController": false}, {"data": ["ADD TO CART \/portable-sound-speakers", 27, 0, 0.0, 324.3703703703704, 296, 442, 317.0, 374.2, 419.9999999999999, 442.0, 0.1326136179450783, 0.3339562771059779, 0.14224978542379874], "isController": false}, {"data": ["Open Random Product Page  \/beats-pill-20-wireless-speaker", 23, 0, 0.0, 388.3478260869565, 336, 770, 362.0, 453.40000000000003, 707.3999999999992, 770.0, 0.12144701477957368, 0.9836475967351874, 0.09494235887064836], "isController": false}, {"data": ["Open Random Product Page  \/pride-and-prejudice", 27, 0, 0.0, 468.4444444444444, 398, 571, 463.0, 533.0, 562.1999999999999, 571.0, 0.12609633760192787, 1.527367429549509, 0.09695297832544063], "isController": false}, {"data": ["Open Host Page", 500, 0, 0.0, 383.8599999999999, 313, 2309, 357.5, 405.0, 472.95, 1406.3300000000006, 2.2859546375161734, 17.917303519341463, 1.7122559243371873], "isController": false}, {"data": ["ADD TO CART \/beats-pill-20-wireless-speaker", 23, 0, 0.0, 338.6521739130435, 300, 549, 319.0, 458.40000000000026, 545.1999999999999, 549.0, 0.12148999556297407, 0.30626290831202857, 0.13033144649686237], "isController": false}, {"data": ["Open Random Product Page  \/night-visions", 61, 0, 0.0, 389.59016393442624, 311, 1620, 361.0, 412.0, 466.9, 1620.0, 0.2933552628415064, 2.289968827997634, 0.22438878559337114], "isController": false}, {"data": ["Search Random Product", 500, 0, 0.0, 418.41799999999984, 334, 820, 406.5, 457.90000000000003, 504.95, 730.94, 2.316090809288451, 18.0942242195932, 1.7709771239710768], "isController": false}, {"data": ["Open Random Product Page  \/htc-one-m8-android-l-50-lollipop", 39, 0, 0.0, 518.7179487179485, 406, 1607, 458.0, 663.0, 829.0, 1607.0, 0.19397580773515838, 2.299805270359999, 0.15194674462587537], "isController": false}, {"data": ["Open Random Product Page  \/flower-girl-bracelet", 120, 0, 0.0, 370.8916666666667, 312, 677, 362.0, 407.8, 423.84999999999997, 668.5999999999997, 0.5636793228332402, 4.531448718980022, 0.434360607094374], "isController": false}, {"data": ["ADD TO CART \/hp-spectre-xt-pro-ultrabook", 11, 0, 0.0, 348.99999999999994, 292, 612, 319.0, 570.6000000000001, 612.0, 612.0, 0.05252276384332937, 0.13280835935597543, 0.05618779335157306], "isController": false}, {"data": ["ADD TO CART \/first-prize-pies", 22, 0, 0.0, 329.36363636363643, 290, 561, 315.0, 353.7, 529.9499999999996, 561.0, 0.11167966211825861, 0.2799229315149854, 0.11980479378604209], "isController": false}, {"data": ["Open Random Product Page  \/hp-envy-6-1180ca-156-inch-sleekbook", 16, 0, 0.0, 491.00000000000006, 419, 826, 467.5, 615.3000000000002, 826.0, 826.0, 0.09185108642613163, 1.1877964529693734, 0.07219594061253194], "isController": false}, {"data": ["ADD TO CART \/apple-macbook-pro-13-inch", 25, 0, 0.0, 330.59999999999997, 293, 478, 328.0, 356.6, 442.2999999999999, 478.0, 0.12009242312883996, 0.30353829056842146, 0.1285082749684157], "isController": false}, {"data": ["Open Random Product Page  \/portable-sound-speakers", 27, 0, 0.0, 441.6296296296296, 383, 507, 438.0, 481.6, 497.79999999999995, 507.0, 0.13252184156277608, 1.4594034906621183, 0.1026219845145774], "isController": false}, {"data": ["Open Random Product Page  \/first-prize-pies", 22, 0, 0.0, 452.9090909090908, 385, 605, 450.5, 494.5, 588.6499999999997, 605.0, 0.11276730978205154, 1.3248757317060669, 0.08658775411088102], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2500, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
