export default {
  template: `
    <section class="vh-100"  v-else>
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card" style="border-radius: 1rem;">
            <div class="row g-0">
              <div class="col-md-6 col-lg-5 d-none d-md-block">
                <img src="https://i.pinimg.com/474x/24/23/d8/2423d8821a22ce7507f4313519a989b2.jpg"
                  alt="login form" class="img-fluid" style="border-radius: 1rem 0 0 1rem;" />
              </div>
              <div class="col-md-6 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">
                  <form>
                    <div class="d-flex align-items-center mb-3 pb-1">
                      <i class="fas fa-cubes fa-2x me-3" style="color: #ff6219;"></i>
                      <span class="h1 fw-bold mb-0">Fresh Direct</span>
                    </div>
                    <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">Add your available Categories</h5>
                    <div class="form-outline mb-4">
                      <input type="text" id="C_name" class="form-control form-control-lg" v-model="resource.C_name" />
                      <label class="form-label" for="C_name">Category Name</label>
                    </div>
                    <div class="pt-1 mb-4">
                      <button class="btn btn-dark btn-lg btn-block" type="button" @click="addCategory">Add</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
`,
  data() {
    return {
      resource: {
        C_name: "",
      },
    };
  },
  methods: {
    addCategory() {
      const token = localStorage.getItem("auth-token");
      console.log(this.resource);
      fetch("/add-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(this.resource),
      })
        .then((res) => res.json())
        .then((data) => {
          this.$router.push("/");
        });
    },
  },
};
