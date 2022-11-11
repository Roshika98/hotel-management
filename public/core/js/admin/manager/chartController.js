// import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
// import "@alenaksu/json-viewer";


const sdk = new ChartsEmbedSDK({
    baseUrl: "https://charts.mongodb.com/charts-project-0-nlezh", // Optional: ~REPLACE~ with the Base URL from your Embed Chart dialog
});

const chart1 = sdk.createChart({
    chartId: "63674ebc-649b-40ad-8288-61f43bb07719",
    height: "500px",
    width: "400px",
    background: 'transparent',
    showAttribution: false
});

const chart2 = sdk.createChart({
    chartId: "63675a91-ad62-422f-843e-1b7190839db1",
    height: "500px",
    width: "400px",
    background: 'transparent',
    showAttribution: false
});

var newDate = new Date();
var today = newDate.toISOString().split('T')[0];


const chart3 = sdk.createChart({
    chartId: "6368d828-7998-4456-8397-127ada6320ed",
    height: "100px",
    width: "200px",
    background: 'transparent',
    filter: { bookedDate: new Date(today) },
    showAttribution: false
});


const chart4 = sdk.createChart({
    chartId: "6368cd6f-8720-46a3-87b1-d18c7c5524c4",
    height: "100px",
    width: "200px",
    background: 'transparent',
    showAttribution: false
});

const chart5 = sdk.createChart({
    chartId: "6368d539-8d25-4ec2-8eb7-9f5792019052",
    height: "400px",
    width: "400px",
    background: 'transparent',
    showAttribution: false
});

async function renderChart() {

    await chart5.render(document.getElementById('chart5'));
    await chart5.setTheme('dark');

    await chart3.render(document.getElementById('chart3'));
    await chart3.setTheme('dark');

    await chart4.render(document.getElementById('chart4'));
    await chart4.setTheme('dark');

    await chart1.render(document.getElementById("chart1"));
    await chart1.setTheme('dark');

    await chart2.render(document.getElementById('chart2'));
    await chart2.setTheme('dark');

}




renderChart().catch((e) => window.alert(e.message));
