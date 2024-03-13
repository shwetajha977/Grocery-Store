import SignUp from "./SignUp.js";

export default {
  template: `
  <SignUp v-if="SignUpForm"/>
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
                  <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">Sign into your account</h5>
                  <div class="form-outline mb-4">
                    <input type="text" id="email" class="form-control form-control-lg"  v-model="cred.email" />
                    <label class="form-label" for="email">Email address</label>
                  </div>
                  <div class="form-outline mb-4">
                    <input type="password" id="password" class="form-control form-control-lg" v-model="cred.password" />
                    <label class="form-label" for="password">Password</label>
                  </div>
                  <div class="pt-1 mb-4">
                    <button class="btn btn-dark btn-lg btn-block" type="button" @click="login">Login</button>
                  </div>
                  <p class="mb-5 pb-lg-2" style="color: #393f81;">Don't have an account? 
                  <button @click="showSignUp" style="color: #59238F; border: none; background-color: transparent; text-decoration: underline; cursor: pointer;">Register</button></p>
                </form>
                <div class="alert alert-danger" v-if="error"> {{error}} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    `,
  components: {
    SignUp,
  },
  data() {
    return {
      cred: {
        email: null,
        password: null,
      },
      error: null,
      SignUpForm: false,
    };
  },
  methods: {
    showSignUp() {
      this.SignUpForm = true;
    },
    async login() {
      const res = await fetch("/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.cred),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("auth-token", data.access_token);
        localStorage.setItem("role", data.role);
        if (data.role === "admin") {
          this.$router.push({ path: "/admin-home" });
        }
        if (data.role === "manager") {
          this.$router.push({ path: "/manager-home" });
        }
        if (data.role === "customer") {
          this.$router.push({ path: "/customer-home" });
        }
      } else {
        this.error = data.message;
      }
    },
  },
};
