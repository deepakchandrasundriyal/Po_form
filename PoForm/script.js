document.addEventListener("DOMContentLoaded", function () {
    const addItemBtn = document.getElementById("addItem");
    const itemsContainer = document.getElementById("itemsContainer");
    const form = document.getElementById("vendorForm");
    const grandTotalField = document.getElementById("grandTotal");
    document.getElementById('poDate').value = new Date().toISOString().split('T')[0];

    function calculateGrandTotal() {
        let total = 0;
        document.querySelectorAll(".item-total").forEach(item => {
            total += parseFloat(item.value) || 0;
        });
        grandTotalField.value = total.toFixed(2);
    }

    addItemBtn.addEventListener("click", function () {
        const itemRow = document.createElement("div");
        itemRow.classList.add("item");
        itemRow.innerHTML = `
            <input type="text" class="item-name" placeholder="Item Name" required>
            <select class="item-category">
                <option value="Food">Food</option>
                <option value="Beverage">Beverage</option>
                <option value="Dessert">Dessert</option>
            </select>
            <input type="number" class="item-qty" placeholder="Qty" min="1" required>
            <input type="number" class="item-price" placeholder="Unit Price" required>
            <input type="text" class="item-total" placeholder="Total Price" readonly>
            <button type="button" class="removeItem"><i class="fas fa-trash"></i></button>
        `;
        itemsContainer.appendChild(itemRow);
    });

    document.addEventListener("input", function (event) {
        if (event.target.classList.contains("item-qty") || event.target.classList.contains("item-price")) {
            const itemRow = event.target.closest(".item");
            const qty = itemRow.querySelector(".item-qty").value;
            const price = itemRow.querySelector(".item-price").value;
            itemRow.querySelector(".item-total").value = (qty * price).toFixed(2);
            calculateGrandTotal();
        }
    });

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("removeItem")) {
            event.target.closest(".item").remove();
            calculateGrandTotal();
        }
    });
});
document.getElementById("vendorForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    let vendor = document.getElementById("vendor").value;
    let poDate = document.getElementById("poDate").value;
    let paymentMethod = document.getElementById("paymentMethod").value;
    let grandTotal = document.getElementById("grandTotal").value;
    let message = document.getElementById("message").value;
    
    let items = [];
    document.querySelectorAll("#itemsContainer .item").forEach((item) => {
        let name = item.querySelector(".item-name").value;
        let category = item.querySelector(".item-category").value;
        let qty = item.querySelector(".item-qty").value;
        let unitPrice = item.querySelector(".item-price").value;
        let totalPrice = item.querySelector(".item-total").value;
        
        if (name && qty && unitPrice) {
            items.push({ name, category, qty, unitPrice, totalPrice });
        }
    });

    if (!vendor || !poDate || !paymentMethod || items.length === 0) {
        alert("Please fill all required fields!");
        return;
    }
    
    let orderId = "ORD-" + new Date().getTime(); 

    const url = "https://script.google.com/macros/s/AKfycbw9Y6JrdckVLEjb5r3kw-MiT8zM4MompSckevNfxNMuWN8uS_ACFdGHIIX4NiFE9w/exec";

    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                orderId:orderId,
                vendor: vendor,
                poDate: poDate ,
                paymentMethod: paymentMethod,
                grandTotal: grandTotal,
                message:  message,
                items:items
            })
        
        });

        const result = await response.json();
        
        alert("Form submited Sucssfully");
    } catch (error) {
        
        alert("Form submited Sucssfully");
    }
});
