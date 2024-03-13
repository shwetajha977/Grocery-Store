export default {
  template: `
          <div v-if="isAdmin" align="center">
          <h2 style="color:black; font-size: 25px; font-weight: bold;  font-family: Times New Roman">Category Requests</h2>
            <table class="table table-striped" v-if="isrequest">
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Type of Request</th>
                        <th>Approve</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in categoryRequests" :key="request.CR_id">
                        <td>{{ request.C_name }}</td>
                        <td>{{ request.CR_type }}</td>
                        <td>
                          <div v-if="request.CR_type == 'add'">
                            <button class="btn btn-primary" @click="approveAddRequest(request.CR_id)">Approve</button>
                            <button class="btn btn-danger" @click="rejectRequest(request.CR_id)">Reject</button>
                          </div>
                          <div v-if="request.CR_type == 'delete'">
                            <button class="btn btn-primary" @click="approveDeleteRequest(request.CR_id)">Approve</button>
                            <button class="btn btn-danger" @click="rejectRequest(request.CR_id)">Reject</button>
                          </div>
                          <div v-if="request.CR_type == 'update'">
                            <button class="btn btn-primary" @click="approveUpdateRequest(request.CR_id)">Approve</button>
                            <button class="btn btn-danger" @click="rejectRequest(request.CR_id)">Reject</button>
                          </div>                     
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-else>
                <p>No category request present at the moment.</p>
            </div>
        </div>
    `,
  data() {
    return {
      categoryRequests: [],
      isAdmin: false,
      isrequest: false,
    };
  },
  mounted() {
    this.getCategoryRequests();
    this.isAdmin = localStorage.getItem("role") === "admin";
  },
  methods: {
    rejectRequest(requestId) {
      fetch(`/reject-category-request/${requestId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          this.getCategoryRequests();
        })
        .catch((error) => console.error(error));
    },
    getCategoryRequests() {
      fetch("/get-category-requests", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.categoryRequests = data.filter((item) => item.status === false);
          this.isrequest = this.categoryRequests.length > 0;
        })
        .catch((error) => console.error(error));
    },
    approveAddRequest(requestId) {
      fetch(`/approve-add-category-request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          this.getCategoryRequests();
        })
        .catch((error) => console.error(error));
    },
    approveDeleteRequest(requestId) {
      fetch(`/approve-delete-category-request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          this.getCategoryRequests();
        })
        .catch((error) => console.error(error));
    },
    approveUpdateRequest(requestId) {
      fetch(`/approve-update-category-request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          this.getCategoryRequests();
        })
        .catch((error) => console.error(error));
    },
  },
};
