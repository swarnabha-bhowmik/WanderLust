    const taxSwitch = document.getElementById("switchCheckDefault");
    const priceDisplays = document.querySelectorAll(".price-display");

    function formatPrice(value) {
        return `₹${Number(value).toLocaleString("en-IN")} / night`;
    }

    function updatePrices() {
        priceDisplays.forEach((priceEl) => {
            const normalPrice = Number(priceEl.dataset.normalPrice);
            const gstPrice = Number(priceEl.dataset.gstPrice);

            priceEl.textContent = taxSwitch.checked
                ? formatPrice(gstPrice)
                : formatPrice(normalPrice);
        });
    }

    taxSwitch.addEventListener("change", updatePrices);
    updatePrices();