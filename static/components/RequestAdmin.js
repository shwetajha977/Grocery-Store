export default {
  template: `
        <div v-if="isAdmin" align="center">
          <h2 style="color:black; font-size: 25px; font-weight: bold;  font-family: Times New Roman">Manager Requests</h2>
            <table class="table table-striped" v-if="isrequest">
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>User ID</th>
                        <th>Approve</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in managerRequests" :key="request.id">
                        <td>{{ request.id }}</td>
                        <td>{{ request.user_id }}</td>
                        <td><button class="btn btn-primary" @click="approveManagerRequest(request.id)">Approve</button>
                        <button class="btn btn-danger" @click="rejectRequest(request.id)">Reject</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else>
                <p>No manager request present at the moment.</p>
            </div>
        </div>
    `,
  data() {
    return {
      isAdmin: false,
      managerRequests: [],
      isrequest: false,
    };
  },
  mounted() {
    this.getManagerRequests();
    // Check if the user is an admin (replace with actual admin check logic)
    this.isAdmin = localStorage.getItem("role") === "admin";
  },
  methods: {
    rejectRequest(requestId) {
      // Simulate rejecting manager request to the backend
      fetch(`/reject-manager-request/${requestId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          this.getManagerRequests();
        })
        .catch((error) => console.error(error));
    },
    getManagerRequests() {
      // Fetch manager requests from the backend (only if user is admin)
      fetch("/get-manager-requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.managerRequests = data.filter((item) => item.status === false);
          this.isrequest = this.managerRequests.length > 0;
        })
        .catch((error) => console.error(error));
    },
    approveManagerRequest(requestId) {
      // Simulate approving manager request to the backend
      fetch(`/approve-manager-request/${requestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          this.getManagerRequests();
        })
        .catch((error) => console.error(error));
    },
  },
};
