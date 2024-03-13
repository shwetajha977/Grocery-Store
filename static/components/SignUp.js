export default {
  template: `
  <section class="vh-100">
    <div class="container py-0 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card" style="border-radius: 1rem;">
            <div class="row g-0">
              <div class="col-md-9 col-lg-5 d-flex d-md-block">
                <img
                  src="https://i.pinimg.com/474x/24/23/d8/2423d8821a22ce7507f4313519a989b2.jpg"
                  alt="login form"
                  class="img-fluid"
                  style="border-radius: 1rem 0 0 1rem; height: 100%;"
                />
              </div>
              <div class="col-md-1 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">

                  <form>

                    <div class="d-flex align-items-center mb-1 pb-1">
                      <i class="fas fa-cubes fa-1x me-1" style="color: #ff6219;"></i>
                      <div class="h2 fw-bold mb-0">Fresh Direct</div>
                    </div>

                    <h5 class="fw-normal mb-1 pb-3" style="letter-spacing: 1px;">Create your account</h5>

                    <div class="form-outline mb-3">
                      <div class="form-outline mb-4">
                        <label class="form-label" for="username">Name</label>
                        <input id="username" type="text" name="username" class="form-control form-control-lg" style="width: 550px; height:15px;  min-height:45px;" v-model="cred.username" />
                      </div>

                      <div class="form-outline mb-4">
                        <label class="form-label" for="email">Email address</label>
                        <input type="text" id="email" name="email" class="form-control form-control-lg" style="width: 550px; height:15px;  min-height:45px;" v-model="cred.email" />
                      </div>

                      <div class="form-outline mb-4">
                        <label class="form-label" for="password">Password</label>
                        <input type="password" id="password" name="password" class="form-control form-control-lg" style="width: 550px; height:15px;  min-height:45px;" v-model="cred.password" />
                      </div>

                      <div class="form-outline mb-4">
                        <label class="form-label" for="phone_no">Phone Number</label>
                        <input type="text" id="phone_no" name="phone_no" class="form-control form-control-lg" style="width: 550px; height:15px;  min-height:45px;" v-model="cred.phone_no" />
                      </div>

                      <div class="form-outline mb-4">
                        <label class="form-label" for="address">Address</label>
                        <input type="text" id="address" name="address" class="form-control form-control-lg" style="width: 550px; height:15px;  min-height:45px;" v-model="cred.address" />
                      </div>

                      <div class="form-outline mb-4">
                        <label class="form-label" for="gender">Gender</label>
                        <select id="gender" name="gender" class="form-control form-control-lg" v-model="cred.gender" style="width: 550px; height:15px;  min-height:45px;">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>

                    </div>

                    <div class="pt-1 mb-1">
                      <button class="btn btn-dark btn-lg btn-block" type="button" @click="SignUp">Register</button>
                    </div>
                  </form>
                  <p class="mb-5 pb-lg-2" style="color: #393f81;">Already have an account? 
                      <button @click="login" style="color: #59238F; border: none; background-color: transparent; text-decoration: underline; cursor: pointer;">Login</button>
                    </p>

                  <div class="alert alert-danger" v-if="error">{{error}}</div>
                  <div class="alert alert-success" v-if="message">{{message}}</div>
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
      cred: {
        username: "",
        email: "",
        password: "",
        phone_no: "",
        address: "",
        gender: "",
      },
      error: "",
      message: "",
    };
  },

  methods: {
    login() {
      location.reload();
    },
    SignUp() {
      console.log(this.cred);
      fetch("/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.cred),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Something went wrong");
          }
        })
        .then((data) => {
          if (data.error) {
            this.error = data.error;
          }
          if (data.message) {
            this.message = data.message;
            setTimeout(() => {
              this.message = "";
              location.reload();
            }, 2000);
          }
        });
    },
  },
};
