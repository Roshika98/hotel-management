const guestfrom = document.getElementById('guestfrom');
const guestuntil = document.getElementById('guestuntil');
const guestfilter = document.getElementById('guestfilter');
const revenuefrom = document.getElementById('revenuefrom');
const revenueuntil = document.getElementById('revenueuntil');
const revenuefilter = document.getElementById('revenuefilter');
const revenuereset = document.getElementById('revenuereset');
const guestreset = document.getElementById('guestreset');

const sdk = new ChartsEmbedSDK({
    baseUrl: "https://charts.mongodb.com/charts-project-0-nlezh", // Optional: ~REPLACE~ with the Base URL from your Embed Chart dialog
});

const chart1 = sdk.createChart({
    chartId: "63674b0e-7433-4c7c-8b17-f612e4e26ddf",
    height: "500px",
    theme: 'dark',
    background: 'transparent',
    showAttribution: false
});

const chart2 = sdk.createChart({
    chartId: "63675767-8d25-4033-8ff2-9f57928cb813",
    height: "500px",
    theme: 'dark',
    background: 'transparent',
    showAttribution: false
});

const chart3 = sdk.createChart({
    chartId: "636753fd-7433-4bc8-8f3b-f612e4ef2757",
    height: "500px",
    theme: 'dark',
    background: 'transparent',
    showAttribution: false
});


async function renderChart() {

    await chart1.render(document.getElementById("chart1"));


    await chart3.render(document.getElementById('chart3'));
    revenuefilter.addEventListener('click', async (event) => {
        var from = revenuefrom.value;
        var until = revenueuntil.value;
        if (from && until) {
            await chart3.setFilter({ checkOut: { $gte: new Date(from), $lte: new Date(until) } });
        } else {
            await chart3.setFilter({});
        }
    });

    revenuereset.addEventListener('click', async (event) => {
        revenuefrom.value = '';
        revenueuntil.value = '';
        await chart3.setFilter({});
    });

    await chart2.render(document.getElementById('chart2'));
    guestfilter.addEventListener('click', async (event) => {
        var from = guestfrom.value;
        var until = guestuntil.value;
        if (from && until) {
            await chart2.setFilter({ checkIn: { $gte: new Date(from), $lte: new Date(until) } });
        } else {
            await chart2.setFilter({});
        }
    });

    guestreset.addEventListener('click', async (event) => {
        guestfrom.value = '';
        guestuntil.value = '';
        await chart2.setFilter({});
    });


}



renderChart().catch((e) => window.alert(e.message));