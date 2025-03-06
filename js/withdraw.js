document.addEventListener("DOMContentLoaded", () => {
    
    const withdrawBtn = document.getElementById("withdraw-btn");
    const withdrawSection = document.getElementById("withdrawSection");
    const requestBtn = document.getElementById("request-btn");
    
    //show hide
    if (requestBtn) {
        requestBtn.addEventListener("click", function() {
            
            if (withdrawSection.style.display === "none") {
                withdrawSection.style.display = "block";
            } else {
                withdrawSection.style.display = "none";
            }
        });
    }
    
    if (withdrawBtn) {
        withdrawBtn.addEventListener("click", function() {
            
            const withdrawAmount = document.getElementById("withdraw-amount").value;
            
            
            if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
                alert("Please enter a valid amount to withdraw");
                return;
            }
            
            
            const userId = localStorage.getItem("userId");
            if (!userId) {
                alert("You are not logged in. Please log in first.");
                return;
            }
            
            
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("amount", withdrawAmount);
            
            
            axios.post("../../wallet-server/user/v1/withdraw.php", formData)
                .then(response => {
                    if (response.data.success) {
                        // Update balance display
                        const balanceElement = document.querySelector(".balance-amount p");
                        balanceElement.textContent = `$${parseFloat(response.data.new_balance).toFixed(2)}`;
                        
                        
                        document.getElementById("withdraw-amount").value = "";
                        
                        withdrawSection.style.display = "none";
                          
                        alert("Withdrawal successful!");
                        
                        if (typeof fetchTransactions === 'function') {
                            fetchTransactions();
                        }
                    } else {
                        alert(response.data.message || "Failed to withdraw money");
                    }
                })
                .catch(error => {
                    console.error("Withdraw error:", error);
                    alert("An error occurred during withdrawal");
                });
        });
    }
});