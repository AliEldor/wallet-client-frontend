document.addEventListener("DOMContentLoaded", () => {
    function fetchTransactions() {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const formData = new FormData();
        formData.append("userId", userId);

        axios.post("../../wallet-server/user/v1/getTransactions.php", formData)
            .then((response) => {
                if (response.data.success) {
                    updateTransactionHistory(response.data.transactions);
                } else {
                    console.error("Failed to fetch transactions:", response.data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching transactions:", error);
            });
    }

    function updateTransactionHistory(transactions) {
        const transactionContainer = document.querySelector(".card");
        
        // Clear existing transactions(hardcoded)
        const existingItems = transactionContainer.querySelectorAll(".transaction-item");
        existingItems.forEach(item => item.remove());

        // Create transaction items
        transactions.forEach(transaction => {
            const transactionItem = document.createElement("div");
            transactionItem.classList.add("transaction-item");

            
            const transactionDate = new Date(transaction.created_at);
            const formattedDate = transactionDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            // Determine amount sign and class
            const amountClass = transaction.transaction_type === 'transfer' ? 'amount-negative' : 'amount-positive';
            const amountSign = transaction.transaction_type === 'transfer' ? '-' : '+';

            transactionItem.innerHTML = `
                <div class="transaction-title"><p>${transaction.transaction_type}</p></div>
                <div class="transaction-date"><p>${formattedDate}</p></div>
                <div class="transaction-amount ${amountClass}">
                    <p>${amountSign}$${parseFloat(transaction.amount).toFixed(2)}</p>
                </div>
            `;

            
            const viewAllBtn = transactionContainer.querySelector(".view-all-btn");
            transactionContainer.insertBefore(transactionItem, viewAllBtn);
        });
    }

    
    fetchTransactions();

    // refresh transactions after money sendin
    const addMoneyForm = document.getElementById("add-money-form");
    const sendMoneyForm = document.getElementById("send-money-form");

    function refreshTransactionsAfterAction(event) {
        event.preventDefault();
        setTimeout(fetchTransactions, 500);
    }

    if (addMoneyForm) {
        addMoneyForm.addEventListener("submit", refreshTransactionsAfterAction);
    }

    if (sendMoneyForm) {
        sendMoneyForm.addEventListener("submit", refreshTransactionsAfterAction);
    }
});