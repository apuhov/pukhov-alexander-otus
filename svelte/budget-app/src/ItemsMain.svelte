<script>
    import PieChart from './PieChart.svelte';
    import Grid from './ItemsGrid.svelte';
    import NewItemForm from './NewItemForm.svelte';
</script>

<div class="container">
    <h2>My personal budget</h2>
    <div>
        <NewItemForm/>
    </div>
    <div class="row">
        <div class="col s6">
            <Grid/>
        </div>
        <div class="col s6">
            <PieChart/>
        </div>
    </div>
</div>
