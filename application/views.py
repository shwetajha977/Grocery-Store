from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required
from .models import (
    db,
    User,
    Role,
    RolesUsers,
    ManagerRequest,
    CategoryRequest,
    Categories,
    Products,
    Cart,
    Order,
)
from sqlalchemy import or_
from flask_restful import marshal, fields
from .sec import datastore
from flask_security import (
    Security,
    SQLAlchemyUserDatastore,
    login_required,
    roles_accepted,
    current_user,
)
from application import task
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/admin")
@auth_required("token")
@roles_required("admin")
def admin():
    return "Hello, Admin!"


@app.get("/customer")
@auth_required("token")
@roles_required("customer")
def customer():
    return "Hello, customer!"


@app.get("/manager")
@auth_required("token")
@roles_required("manager")
def manager():
    return "Hello, manager!"


@app.post("/user-login")
def user_login():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email is required"})
    user = datastore.find_user(email=email)
    if not user:
        return jsonify({"message": "User not found"})
    if check_password_hash(user.password, data.get("password")):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Invalid password"})


@app.route("/get-products", methods=["GET"])
def get_products():
    products = Products.query.all()
    product_list = [
        {
            "P_id": product.P_id,
            "P_name": product.P_name,
            "C_name": product.C_name,
            "MFG": product.MFG,
            "EXP": product.EXP,
            "quantity": product.quantity,
            "rate_per_unit": product.rate_per_unit,
            "unit": product.unit,
        }
        for product in products
    ]
    return jsonify({"products": product_list})


@app.route("/get-my-products", methods=["GET"])
@jwt_required()
def get_my_products():
    P_user = get_jwt_identity()
    products = Products.query.filter_by(P_user=P_user).all()
    product_list = [
        {
            "P_id": product.P_id,
            "P_name": product.P_name,
            "C_name": product.C_name,
            "MFG": product.MFG,
            "EXP": product.EXP,
            "quantity": product.quantity,
            "rate_per_unit": product.rate_per_unit,
            "unit": product.unit,
        }
        for product in products
    ]
    return jsonify({"products": product_list})


@app.route("/get-categories", methods=["GET"])
def get_categories():
    categories = Categories.query.all()
    category_list = [
        {
            "C_id": category.C_id,
            "C_name": category.C_name,
        }
        for category in categories
    ]
    return jsonify({"categories": category_list})


@app.route("/add-to-cart", methods=["POST"])
@jwt_required()
def add_to_cart():
    try:
        data = request.json
        user_id = get_jwt_identity()
        product_id = data.get("product_id")
        quantity = data.get("quantity")

        # Assuming Product model has a method to get product by ID
        product = Products.query.get(product_id)

        if product and product.quantity >= quantity:
            product.quantity -= quantity
            # Check if the product is already in the user's cart
            existing_cart_item = Cart.query.filter_by(
                user_id=user_id, P_id=product_id
            ).first()
            if existing_cart_item:
                existing_cart_item.quantity += quantity
                existing_cart_item.total = (
                    existing_cart_item.quantity * existing_cart_item.rate_per_unit
                )
            else:
                new_cart_item = Cart(
                    P_id=product_id,
                    P_name=product.P_name,
                    quantity=quantity,
                    rate_per_unit=product.rate_per_unit,
                    total=quantity * product.rate_per_unit,
                    user_id=user_id,
                )
                db.session.add(new_cart_item)
            db.session.commit()
            return jsonify({"message": "Product added to cart successfully!"}), 200
        else:
            return jsonify({"error": "Invalid product or insufficient quantity"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/manager-request", methods=["POST"])
@jwt_required()
def create_manager_request():
    id = get_jwt_identity()
    if ManagerRequest.query.filter_by(user_id=id).first():
        return jsonify({"message": "Manager request already sent!"}), 400
    new_request = ManagerRequest(user_id=id, status=False)
    db.session.add(new_request)
    db.session.commit()
    return jsonify({"message": "Manager request sent successfully!"}), 200


def manager_request_json(manager_request):
    return {
        "id": manager_request.MR_id,
        "user_id": manager_request.user_id,
        "status": manager_request.status,
    }


@app.route("/get-manager-requests", methods=["GET"])
@jwt_required()
def get_manager_requests():
    requests = ManagerRequest.query.all()
    return jsonify([manager_request_json(request) for request in requests])


@app.route("/approve-manager-request/<int:request_id>", methods=["PUT"])
@jwt_required()
def approve_manager_request(request_id):
    request = ManagerRequest.query.get(request_id)
    if request:
        request.status = True
        user = User.query.get(request.user_id)
        role = RolesUsers.query.filter_by(user_id=user.id).first()
        role.role_id = 2
        db.session.commit()
        db.session.delete(request)
        db.session.commit()
        return jsonify({"message": "Manager request approved successfully!"}), 200
    else:
        return jsonify({"message": "Manager request not found!"}), 404


@app.route("/make-add-category-request", methods=["POST"])
@jwt_required()
def create_category_request():
    data = request.get_json()
    user_id = get_jwt_identity()
    C_name = data.get("categoryName")
    CR_type = data.get("actionAdd")
    if CategoryRequest.query.filter_by(C_name=C_name, CR_type=CR_type).first():
        return jsonify({"message": "Category request already sent!"}), 400
    cat = Categories.query.filter_by(C_name=C_name).first()
    if cat:
        return jsonify({"message": "Category already exist!"}), 400
    new_request = CategoryRequest(
        user_id=user_id, C_name=C_name, CR_type=CR_type, status=False
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify({"message": "Category request sent successfully!"}), 200


@app.route("/make-delete-category-request", methods=["POST"])
@jwt_required()
def delete_category_request():
    data = request.get_json()
    user_id = get_jwt_identity()
    C_name = data.get("categories")
    CR_type = data.get("actionDelete")
    if CategoryRequest.query.filter_by(C_name=C_name, CR_type=CR_type).first():
        return jsonify({"message": "Category request already sent!"}), 400
    new_request = CategoryRequest(
        user_id=user_id, C_name=C_name, CR_type=CR_type, status=False
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify({"message": "Category request sent successfully!"}), 200


@app.route("/make-update-category-request", methods=["POST"])
@jwt_required()
def update_category_request():
    data = request.get_json()
    user_id = get_jwt_identity()
    C_name = data.get("categoryName")
    new_category_name = data.get("newCategoryName")
    CR_type = data.get("actionUpdate")
    if CategoryRequest.query.filter_by(C_name=C_name, CR_type=CR_type).first():
        return jsonify({"message": "Category request already sent!"}), 400
    ncat = Categories.query.filter_by(C_name=new_category_name).first()
    if ncat:
        return jsonify({"message": "Category already exist!"}), 400
    cat = Categories.query.filter_by(C_name=C_name).first()
    if not cat:
        return jsonify({"message": "Category does not exist!"}), 400
    new_request = CategoryRequest(
        user_id=user_id,
        C_name=C_name,
        CR_type=CR_type,
        status=False,
        newC_name=new_category_name,
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify({"message": "Category request sent successfully!"}), 200


def category_request_json(category_request):
    return {
        "CR_id": category_request.CR_id,
        "user_id": category_request.user_id,
        "C_name": category_request.C_name,
        "CR_type": category_request.CR_type,
        "status": category_request.status,
    }


@app.route("/get-category-requests", methods=["GET"])
@jwt_required()
def get_category_requests():
    requests = CategoryRequest.query.all()
    return jsonify(
        [category_request_json(request) for request in requests],
    )


@app.route("/reject-manager-request/<int:request_id>", methods=["DELETE"])
@jwt_required()
def reject_manager_request(request_id):
    request = ManagerRequest.query.get(request_id)
    if not request:
        return jsonify({"message": "Manager request not found!"}), 404
    db.session.delete(request)
    db.session.commit()
    return jsonify({"message": "Manager request rejected successfully!"}), 200


@app.route("/reject-category-request/<int:request_id>", methods=["DELETE"])
@jwt_required()
def reject_category_request(request_id):
    request = CategoryRequest.query.get(request_id)
    if not request:
        return jsonify({"message": "Category request not found!"}), 404
    db.session.delete(request)
    db.session.commit()
    return jsonify({"message": "Category request rejected successfully!"}), 200


@app.route("/approve-add-category-request/<int:request_id>", methods=["PUT"])
@jwt_required()
def approve_add_category_request(request_id):
    request = CategoryRequest.query.get(request_id)
    if request.CR_type == "add":
        cat = Categories.query.filter_by(C_name=request.C_name).first()
        if cat:
            return jsonify({"message": "Category already exist!"}), 400
        category = Categories(C_name=request.C_name)
        db.session.add(category)
        db.session.commit()
        db.session.delete(request)
        db.session.commit()
        return jsonify({"message": "Category add successfully!"}), 200
    else:
        return jsonify({"message": "Category request are not valid!"}), 404


@app.route("/approve-delete-category-request/<int:request_id>", methods=["PUT"])
@jwt_required()
def approve_delete_category_request(request_id):
    request = CategoryRequest.query.get(request_id)
    if request.CR_type == "delete":
        category = Categories.query.filter_by(C_name=request.C_name).first()
        db.session.delete(category)
        db.session.commit()
        db.session.delete(request)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully!"}), 200
    else:
        return jsonify({"message": "Category request are not valid!"}), 404


@app.route("/approve-update-category-request/<int:request_id>", methods=["PUT"])
@jwt_required()
def approve_update_category_request(request_id):
    request = CategoryRequest.query.get(request_id)
    if request.CR_type == "update":
        category = Categories.query.filter_by(C_name=request.C_name).first()
        category.C_name = request.newC_name
        db.session.commit()
        db.session.delete(request)
        db.session.commit()
        return jsonify({"message": "Category updated successfully!"}), 200
    else:
        return jsonify({"message": "Category request are not valid!"}), 404


@app.route("/get-carts", methods=["GET"])
@jwt_required()
def get_carts():
    carts = Cart.query.filter_by(user_id=get_jwt_identity()).all()
    cart_list = [
        {
            "c_id": cart.c_id,
            "P_id": cart.P_id,
            "P_name": cart.P_name,
            "quantity": cart.quantity,
            "rate_per_unit": cart.rate_per_unit,
            "total": cart.total,
        }
        for cart in carts
    ]
    return jsonify({"carts": cart_list})


@app.route("/checkout", methods=["POST"])
@jwt_required()
def checkout():
    try:
        user_id = get_jwt_identity()
        cart_items = Cart.query.filter_by(user_id=user_id).all()

        # Assuming you have a method to calculate the grand total
        grand_total = sum(item.total for item in cart_items)

        # Assuming you have a method to create an order
        for item in cart_items:
            new_order = Order(
                user_id=user_id,
                P_name=item.P_name,
                quantity=item.quantity,
                rate_per_unit=item.rate_per_unit,
                P_id=item.P_id,
                total=grand_total,
            )
            db.session.add(new_order)

        # Update sold and quantity in Products table
        for item in cart_items:
            product = Products.query.get(item.P_id)
            product.sold += item.quantity
            product.quantity -= item.quantity

        # Clear the user's cart
        Cart.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        return jsonify({"message": "Order placed successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/search", methods=["GET"])
def search():
    term = request.args.get("term", "").lower()

    products = Products.query.filter(
        or_(
            Products.P_name.ilike(f"%{term}%"),
            Products.C_name.ilike(f"%{term}%"),
            Products.MFG.ilike(f"%{term}%"),
            Products.EXP.ilike(f"%{term}%"),
            Products.rate_per_unit.ilike(f"%{term}%"),
            Products.quantity.ilike(f"%{term}%"),
            Products.unit.ilike(f"%{term}%"),
            Products.sold.ilike(f"%{term}%"),
        )
    ).all()

    results = [
        {
            "P_name": product.P_name,
            "C_name": product.C_name,
            "MFG": product.MFG,
            "EXP": product.EXP,
            "rate_per_unit": product.rate_per_unit,
            "quantity": product.quantity,
            "unit": product.unit,
            "sold": product.sold,
        }
        for product in products
    ]
    return jsonify({"results": results})


@app.route("/user/orders", methods=["GET"])
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    user_orders = Order.query.filter_by(user_id=user_id).all()

    orders_data = [
        {
            "o_id": order.o_id,
            "P_name": order.P_name,
            "quantity": order.quantity,
            "rate_per_unit": order.rate_per_unit,
            "total": order.total,
            "P_id": order.P_id,
            "user_id": order.user_id,
        }
        for order in user_orders
    ]
    return jsonify(orders_data)


@app.route("/delete-product/<int:P_id>", methods=["DELETE"])
@jwt_required()
def delete_product(P_id):
    user_id = get_jwt_identity()
    product = Products.query.filter_by(P_id=P_id, P_user=user_id).first()  # noqa(P_id)
    if product:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully!"}), 200
    else:
        return jsonify({"message": "Product not found!"}), 404


@app.route("/edit-product/<int:P_id>", methods=["PUT"])
@jwt_required()
def edit_product(P_id):
    try:
        product = Products.query.get(P_id)
        if product:
            product.P_name = request.json.get("P_name", product.P_name)
            product.C_name = request.json.get("C_name", product.C_name)
            product.MFG = request.json.get("MFG", product.MFG)
            product.EXP = request.json.get("EXP", product.EXP)
            product.rate_per_unit = request.json.get(
                "rate_per_unit", product.rate_per_unit
            )
            product.quantity = request.json.get("quantity", product.quantity)
            product.unit = request.json.get("unit", product.unit)
            db.session.commit()
            return jsonify({"message": "Product updated successfully!"}), 200
        else:
            return jsonify({"message": "Product not found!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/delete-category/<C_name>", methods=["DELETE"])
@jwt_required()
def delete_category(C_name):
    category = Categories.query.filter_by(C_name=C_name).first()
    if category:
        prod = Products.query.filter_by(C_name=C_name).all()
        if prod:
            for p in prod:
                db.session.delete(p)
        db.session.delete(category)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully!"}), 200
    else:
        return jsonify({"message": "Category not found!"}), 404


@app.route("/edit-category/<C_name>", methods=["PUT"])
@jwt_required()
def edit_category(C_name):
    category = Categories.query.filter_by(C_name=C_name).first()
    if category:
        prod = Products.query.filter_by(C_name=C_name).all()
        if prod:
            for p in prod:
                p.C_name = request.json.get("C_name")
        category.C_name = request.json.get("C_name")
        db.session.commit()
        return jsonify({"message": "Category updated successfully!"}), 200
    else:
        return jsonify({"message": "Category not found!"}), 404


@app.route("/csv/<C_name>", methods=["GET", "POST"])
@jwt_required()
def generate_and_export_csv(C_name):
    id = get_jwt_identity()
    user = User.query.get(id)
    recipient_csv_email = user.email
    task.create_zip.apply_async(args=[C_name, recipient_csv_email])
    return jsonify({"message": "Report generated successfully!"}), 200
