document.addEventListener("DOMContentLoaded", () => {
    
  let subMenu = document.getElementById("subMenu");
  let menuIcon = document.getElementById("menu-icon");
  let navLinks = document.querySelector(".nav-links");
  let balanceElement = document.querySelector(".balance-amount p");
  let userNameElement = document.querySelector(".sub-menu .user-info h3");

  // add money part
  const addMoneyBtn = document.querySelector(".add-money-btn");
  const addMoneyModal = document.getElementById("addMoneyModal");
  //const closeModalButtons = addMoneyModal.querySelectorAll(".close-modal");
  const closeModalButtons = document.querySelectorAll(".close-modal");
  const addMoneyForm = document.getElementById("add-money-form");

  // send money part
  const sendMoneyBtn = document.querySelector(".action-item .send");
  const sendMoneyModal = document.getElementById("sendMoneyModal");
  const sendMoneyForm = document.getElementById("send-money-form");
  const recipientSelect = document.getElementById("recipient-select");

  console.log("addMoneyBtn:", addMoneyBtn);
  console.log("addMoneyModal:", addMoneyModal);
  console.log("closeModalButtons:", closeModalButtons);
  console.log("addMoneyForm:", addMoneyForm);

  function fetchAvailableUsers() {
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("currentUserId", userId);

    axios
      .post("../../wallet-server/user/v1/getUsers.php", formData)
      .then((response) => {
        if (response.data.success) {
          recipientSelect.innerHTML = '<option value="">Select a user</option>';

          response.data.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name} (ID: ${user.id})`;
            recipientSelect.appendChild(option);

        
      });
  }
  else{
    console.error('Failed to fetch users:', response.data.message);
  }
})

.catch(error => {
    console.error('Error fetching users:', error);
});
}

sendMoneyBtn.addEventListener("click", () => {
    sendMoneyModal.classList.add("show");
    fetchAvailableUsers(); 
});

closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        sendMoneyModal.classList.remove("show");
    });
});

sendMoneyModal.addEventListener("click", (e) => {
    if (e.target === sendMoneyModal) {
        sendMoneyModal.classList.remove("show");
    }
});

sendMoneyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const recipientId = recipientSelect.value;
    const amount = document.getElementById("send-amount").value;

    const userId = localStorage.getItem('userId');
        const formData = new FormData();
        formData.append('senderId', userId);
        formData.append('recipientId', recipientId);
        formData.append('amount', amount);

        axios.post('../../wallet-server/user/v1/sendMoney.php', formData)
        .then(response =>{
            if (response.data.success) {
                
                balanceElement.textContent = `$${parseFloat(response.data.new_balance).toFixed(2)}`;
                
                
                sendMoneyModal.classList.remove("show");
                sendMoneyForm.reset();

                //fetchTransactions();

                alert('Money sent successfully!');
            }
        })

        .catch(error => {
            console.error('Send money error:', error);
            alert('An error occurred while sending money');
        });
    });

// end of send

  // add money functions

  addMoneyBtn.addEventListener("click", () => {
    addMoneyModal.classList.add("show");
  });

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      addMoneyModal.classList.remove("show");
    });
  });

  addMoneyModal.addEventListener("click", (e) => {
    if (e.target === addMoneyModal) {
      addMoneyModal.classList.remove("show");
    }
  });

  addMoneyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = document.getElementById("amount").value;

    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("amount", amount);

    axios
      .post("../../wallet-server/user/v1/addMoney.php", formData)
      .then((response) => {
        if (response.data.success) {
          balanceElement.textContent = `$${parseFloat(
            response.data.new_balance
          ).toFixed(2)}`;

          addMoneyModal.classList.remove("show");

          addMoneyForm.reset();
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Add money error:", error);
        alert("An error occurred while adding money");
      });
  });

  // end of add money

  document.querySelector(".profile-pic").addEventListener("click", (event) => {
    event.stopPropagation();
    subMenu.classList.toggle("open-menu");
  });

  menuIcon.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (
      !subMenu.contains(event.target) &&
      !event.target.matches(".profile-pic")
    ) {
      subMenu.classList.remove("open-menu");
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !navLinks.contains(event.target) &&
      !event.target.matches(".menu-icon") &&
      !menuIcon.contains(event.target)
    ) {
      navLinks.classList.remove("open");
    }
  });

  const userName = localStorage.getItem("userName");
  if (userName) {
    userNameElement.textContent = userName;
  }

  function fetchUserBalance() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      window.location.href = "../index.html";
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);

    axios
      .post("../../wallet-server/user/v1/getBalance.php", formData)
      .then((response) => {
        if (response.data.success) {
          const formattedBalance = `$${parseFloat(
            response.data.balance
          ).toFixed(2)}`;
          balanceElement.textContent = formattedBalance;
        } else {
          console.error("Failed to fetch balance:", response.data.message);
          console.log(response.data);
          balanceElement.textContent = "$0.00";
        }
      })

      .catch((error) => {
        console.error("Error fetching balance:", error);
        balanceElement.textContent = "$0.00";
      });
  }


  //logout
  function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    window.location.href = "../index.html";
  }

  const logoutLink = document.querySelector(
    '.sub-menu-link[data-action="logout"]'
  );
  if (logoutLink) {
    logoutLink.addEventListener("click", logout);
  }

  fetchUserBalance();
});
