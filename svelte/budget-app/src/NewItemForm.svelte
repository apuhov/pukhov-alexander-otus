<script>
    import moment from 'moment';
    import {DATE_FORMAT, DATE_FORMAT_MOMENT} from './appSettings'
    import {items, categories} from './store.js';
    import {onMount} from "svelte";

    // errors for form validation
    let errors = {};

    // form inputs default values
    const defaultDate = new Date();
    const defaultValue = 500;

    let modalForm;
    let elemModalForm;
    let elemItemCategory;
    let elemItemDate;
    let elemItemValue;

    onMount(async () => {
        let elemDatePickers = document.querySelectorAll('.datepicker');
        M.Datepicker.init(elemDatePickers, {container: 'body', format: DATE_FORMAT});
        M.FormSelect.init(elemItemCategory);
        modalForm = M.Modal.init(elemModalForm, {'onOpenStart': resetForm});
    });

    function addItem() {
        const formData = new FormData(document.forms.formAddItem);
        if (validateFormData(formData)) {
            items.addItem({
                date: moment(formData.get("item-date"), DATE_FORMAT_MOMENT).format(),
                category: formData.get("item-category"),
                value: formData.get("item-value")
            });
            closeForm();
        }
    }

    function resetForm() {
        errors = {};

        elemItemCategory.selectedIndex = 0;
        elemItemCategory.dispatchEvent(new Event('change'));

        elemItemValue.value = defaultValue;
        M.updateTextFields();

        let datePickerInput = M.Datepicker.getInstance(elemItemDate);
        datePickerInput.setDate(defaultDate);
        datePickerInput.setInputValue();
    }

    function closeForm() {
        modalForm.close();
    }

    function validateFormData(formData) {
        errors = {};
        if (!moment(formData.get("item-date"), DATE_FORMAT_MOMENT).isValid()) {
            errors.date = "Invalid item date";
        }
        if (!formData.get("item-category")) {
            errors.category = "Invalid item category";
        }
        if (formData.get("item-value") <= 0) {
            errors.value = "Invalid item value";
        }
        return (Object.keys(errors).length === 0);
    }
</script>

<style>
    .modal {
        height: 70% !important
    }
</style>

<button data-target="modalNewItem" class="btn modal-trigger">Add new item <i class="material-icons right">add</i>
</button>
<div id="modalNewItem" class="modal" bind:this={elemModalForm}>
    <div class="modal-content">
        <form class="col s12" name="formAddItem">
            <div class="input-field">
                <select name="item-category" id="item-category" bind:this={elemItemCategory}>
                    <option value="" disabled selected>Choose category</option>
                    {#each $categories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>
                <label for="item-category">Item category</label>
                {#if (errors.category)}<span class="red-text text-darken-2">{errors['category']}</span>{/if}
            </div>

            <div class="input-field col s6">
                <label for="item-date">Item date</label>
                <input type=text name="item-date" id="item-date" class="datepicker" bind:this={elemItemDate}>
                {#if (errors.date)}<span class="red-text text-darken-2">{errors['date']}</span>{/if}
            </div>

            <div class="input-field col s6">
                <label for="item-value">Item value</label>
                <input type=number name="item-value" id="item-value" bind:this={elemItemValue}>
                {#if (errors.value)}<span class="red-text text-darken-2">{errors['value']}</span>{/if}
            </div>
            <div class="input-field">
                <button type="submit"
                        on:click|preventDefault={addItem}
                        class="btn waves-effect waves-light">
                    Add Item <i class="material-icons right">add</i>
                </button>
                <button
                        on:click|preventDefault={closeForm}
                        class="btn waves-effect waves-light teal grey right">
                    Close <i class="material-icons right">close</i>
                </button>
            </div>
        </form>
    </div>
</div>

