document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
  
    // Register 
    if (registerForm) {
      registerForm.addEventListener("submit", handleRegister);
    }

    // LOgin
    if(loginForm){
      loginForm.addEventListener("submit", handleLogin);
    }
  });

    function handleRegister(event){
      event.preventDefault();
      const formData = new FormData(event.target);

      axios
          .post("../../wallet-server/models/register.php", formData)
          .then(function (response) {
            if (response.data.success) {
              alert("Registration successful!");
              window.location.href = "../index.html";
            } else {
                if (response.data.errors && response.data.errors.length > 0) {
                    const errorMessage = response.data.errors.join("\n");
                    alert(errorMessage);  
                  } else {
                    alert(response.data.message || "Registration failed");  // General message if no specific errors
                  }
            }
          })
          .catch(function (error) {
            alert("Connection error. Please try again later.");
            console.log(error);
          });
      };



      function handleLogin(event){
        //console.log("Login handler called");
        event.preventDefault();
        //console.log("Default prevented");

        const formData = new FormData(event.target);
        
        
  
        axios
            .post("../wallet-server/models/login.php", formData)
            .then(function (response) {
              console.log(response)
              if (response.data.success) {
                localStorage.setItem('userId', response.data.user_id);
                localStorage.setItem('userName', response.data.user_name);
                //alert("Login successful!");
                
                window.location.href = "../../../digital-wallet/wallet-client/pages/dashboard.html";
              } else {
                  if (response.data.errors && response.data.errors.length > 0) {
                      const errorMessage = response.data.errors.join("\n");
                      console.log(errorMessage)
                      alert(errorMessage);  
                    } else {
                      // General message if no specific errors
                      alert(response.data.message || "Login failed");  
                    }
              }
            })
            .catch(function (error) {
              alert("Connection error. Please try again later.");
              console.log(error);
            });
        };

        
    


  