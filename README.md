# Grocery-Store
It is a multi user application used for buying grocery items. A user can buy many products from one or multiple
sections. Store manager can add, delete and edit products. Admin can add, delete and edit categories and if store
manager want to add, delete and edit categories then it should be take permission from admin. Every category
can have a number of products. System will automatically reflect the latest product/category added.
Technologies Used
● Flask for application code
● VueJs for UI and Jinja templates Bootstrap for HTML generation and css styling
● SQLite as the database for the application
● Flask_security(Token based Authentication) as well as JWT is used for secure user login
● Flask_celery for async_jobs
● Flask_restful for building RESTful APIs
● Redis for caching
● Redis for celery jobs
 Database Schema
There are a total of 9 different tables for handling different functionalities of the applications:
➢ User:
❖ It represents information about users.
❖ It have columns such as “id”, “username”, “email”, “password”, “phone_no”, “address”,
“gender”, “active”, “last_login_at”, “fs_uniquifier”, “roles” and “orders” columns.
❖ User link with RolesUser table through roles column and order table through orders column.
➢ Role:
❖ It store role of user such as admin, manager and customer.
❖ It have “id”, “name” and “description” columns to store description about roles.
➢ RolesUsers:
❖ It have two foreign key relation with User table and Role table.
❖ It link user with their roles.
❖ It have “id”, “user_id for relation with user” and “role_id for relation with role” columns.
➢ ManagerRequest:
❖ It is used for request which send by normal user to admin to make them manager.
❖ It have “MR_id”, “user_id for relation with user”, “status” and “manager” columns.
➢ CategoryRequest:
❖ It is used for request which send by manager to admin to approve them to add, delete or edit
categories.
❖ It have “CR_id”, “user_id for relation with user”, “C_name”, “newC_name”, “CR_type” and
“status” columns.
➢ Categories:
❖ It is used to store information about categories.
❖ It have “C_id” and “C_name” columns.
➢ Products:
❖ It is used to store information about products.
❖ It have “P_id”, “P_name”, “C_name”, “MFG”, “EXP”, “quantity”, “rate_per_unit”, “unit”, “sold”
and “P_user for relation with user” columns.
➢ Cart:
❖ It is used to store information about items in user shopping carts.
❖ It have “c_id”, “P_id”, “P_name”, “quantity”, “rate_per_unit”, “total” and “user_id for relation
with user” columns
➢ Order:
❖ It is used to store information about user orders.
❖ It have “o_id”, “P_name”, “quantity”, “rate_per_unit”, “total”, “P_id for relation with products”
and “user_id for relation with user”.
API design
The table schema has been implemented for CRUD operations with API endpoints. This allows for easy
manipulation of data using HTTP requests such as GET, POST, PUT and DELETE. By providing a standardized
way to interact with the data, the API ensures that the database is always in sync with the application’s needs.
This makes it easier to maintain and update the application over time.
Architecture and features
VueJs is used to make website faster and more responsive. The design is focused on creating a smooth
experience for users by integrating Vue components seamlessly on a single page. Data retrieval speed is boosted
by incorporating Redis and caching. Additionally, automated alert notifications and monthly reports using celery
jobs is also integrated. These enhancements together create a sophisticated and strong system that prioritizes
speed, efficiency, and automation to provide users with a great digital experience. 
