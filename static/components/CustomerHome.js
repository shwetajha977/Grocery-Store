export default {
  template: `
    <div>
        <h1 class="text-center" style="color:purple; font-size: 50px; font-family: Times New Roman"> Welcome Customer</h1>
        <p align="center" style="color:black; font-size: 30px; font-family: Times New Roman">Click on the below button to make a request to admin to make you a manager</p>
        <div align="center"><router-link class="btn btn-primary" to="/make-manager-request">Manager Request</router-link></div>
    </div>
    `,
};
