<script>
    import Chart from "chart.js";
    import {onMount} from "svelte";
    import {itemsOrdered, categories} from './store.js'

    export var pieChart = null;

    export function updateData() {
        let data = $itemsOrdered.reduce((prev, curr) => {
            (prev[curr.category]) ? prev[curr.category] += +curr.value : prev[curr.category] = +curr.value;
            return prev;
        }, {});
        pieChart.data.labels = Object.keys(data).map(k => $categories.find(c => +c.id === +k).name);
        pieChart.data.datasets[0].data = Object.values(data);
        pieChart.update();
    }

    function createPieChart() {
        let ctx = document.getElementById("doughnut-chart");
        pieChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                datasets: [{
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#eec380", "#faefba"],
                    }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Items by categories'
                },
                legend: {
                    display: true,
                    position: 'right'
                },
            }
        });
        updateData();
    }

    onMount(async () => {
        createPieChart();
        itemsOrdered.subscribe(value => {
            updateData();
        });
    });
</script>

<div class="chart">
    <canvas id="doughnut-chart" width="5%"></canvas>
</div>