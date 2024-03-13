export default {
  template: `
    <div>
      <h1 class="text-center" style="color:purple; font-size: 50px; font-family: Times New Roman">Manager Request System</h1>
      <h4 class="text-center" style="color:black; font-size: 30px; font-family: Times New Roman">Do you want to be a manager?</h4>
      <div align="center">
        <button class="btn btn-primary text-center" type="button" @click="sendManagerRequest" style="font-size: 20px font-family: Times New Roman">Send Request to Admin</button>
      </div>
    </div>
    `,
  data() {
    return {
      request: {
        isAdmin: false,
        managerRequests: [],
      },
    };
  },
  methods: {
    sendManagerRequest() {
      // Simulate sending manager request to the backend
      fetch("/manager-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
          }
        })
        .catch((error) => console.error(error));
    },
  },
};
