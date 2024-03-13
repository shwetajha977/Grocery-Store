from flask_restful import Resource, Api, reqparse, fields, marshal_with
from .models import (
    db,
    Role,
    User,
    RolesUsers,
    ManagerRequest,
    CategoryRequest,
    Categories,
    Products,
    Cart,
    Order,
)
from flask_security import auth_required, roles_required, current_user
from flask import jsonify, request, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash


cat_parser = reqparse.RequestParser()
cat_parser.add_argument("C_name", type=str, required=True)


def cat_to_json(category):
    return {"id": category.C_id, "C_name": category.C_name}


class CategoryResource(Resource):
    def get(self):
        categories = Categories.query.all()
        categories = [cat_to_json(category) for category in categories]
        return jsonify(categories)

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        args = cat_parser.parse_args()
        category_name = args["C_name"]
        if category_name is None:
            return jsonify({"error": "Category name is required"}), 400

        category = Categories(C_name=category_name)
        db.session.add(category)
        db.session.commit()
        return jsonify(cat_to_json(category))


# Parser for product data
product_parser = reqparse.RequestParser()
product_parser.add_argument("P_name", type=str, required=True)
product_parser.add_argument("C_name", type=str, required=True)
product_parser.add_argument("MFG", type=str, required=True)
product_parser.add_argument("EXP", type=str, required=True)
product_parser.add_argument("unit", type=str, required=True)
product_parser.add_argument("rate_per_unit", type=int, required=True)
product_parser.add_argument("quantity", type=int, required=True)


def product_to_json(product):
    return {
        "P_id": product.P_id,
        "P_name": product.P_name,
        "C_name": product.C_name,
        "MFG": product.MFG,
        "EXP": product.EXP,
        "unit": product.unit,
        "rate_per_unit": product.rate_per_unit,
        "quantity": product.quantity,
        "sold": product.sold,
    }


class ProductResource(Resource):
    def get(self):
        products = Products.query.all()
        products = [product_to_json(product) for product in products]
        return jsonify(products)

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        args = product_parser.parse_args()
        product_name = args["P_name"]
        category_name = args["C_name"]
        unit = args["unit"]
        MFG = args["MFG"]
        EXP = args["EXP"]
        unit = args["unit"]
        rate_per_unit = args["rate_per_unit"]
        quantity = args["quantity"]

        # Find or create the category
        category = Categories.query.filter_by(C_name=category_name).first()

        if not category:
            category = Categories(C_name=category_name)
            db.session.add(category)
            db.session.commit()

        # Create the product and associate it with the category
        product = Products(
            P_name=product_name,
            C_name=category_name,
            MFG=MFG,
            EXP=EXP,
            unit=unit,
            rate_per_unit=rate_per_unit,
            quantity=quantity,
            P_user=user_id,
            sold=0,
        )

        db.session.add(product)
        db.session.commit()

        return jsonify(product_to_json(product))


# Parser for user data
user_parser = reqparse.RequestParser()
user_parser.add_argument("username", type=str, required=True)
user_parser.add_argument("email", type=str, required=True)
user_parser.add_argument("password", type=str, required=True)
user_parser.add_argument("phone_no", type=str, required=True)
user_parser.add_argument("address", type=str, required=True)
user_parser.add_argument("gender", type=str, required=True)


def user_to_json(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "password": user.password,
        "phone_no": user.phone_no,
        "address": user.address,
        "gender": user.gender,
    }


class UserResource(Resource):
    def post(self):
        args = user_parser.parse_args()
        username = args["username"]
        email = args["email"]
        password = args["password"]
        phone_no = args["phone_no"]
        address = args["address"]
        gender = args["gender"]

        # Create the product and associate it with the category
        with app.app_context():
            user_datastore = app.security.datastore
            if user_datastore.find_user(email=email):
                return jsonify({"error": "User already exists"}), 400
            user_datastore.create_user(
                username=username,
                email=email,
                password=generate_password_hash(password),
                phone_no=phone_no,
                address=address,
                gender=gender,
            )
            db.session.commit()
            user = user_datastore.find_user(email=email)
            role = user_datastore.find_role("customer")
            user_datastore.add_role_to_user(user, role)
            db.session.commit()
            return {"message": "User created successfully"}


manager_request_parser = reqparse.RequestParser()
manager_request_parser.add_argument("user_id", type=str, required=True)


class ManagerRequestResource(Resource):
    @jwt_required()
    def post(self):
        args = manager_request_parser.parse_args()
        user_id = args["user_id"]
        current_user_id = get_jwt_identity()

        # Check if the user sending the request is the same as the logged-in user
        if user_id == current_user_id:
            new_request = ManagerRequest(user_id=user_id, status=False)
            db.session.add(new_request)
            db.session.commit()
            return jsonify({"message": "Manager request sent successfully!"}), 200
        else:
            return jsonify({"error": "Invalid user ID"}), 400


class ManagerRequestListResource(Resource):
    def get(self):
        requests = ManagerRequest.query.all()
        return jsonify(
            {
                "requests": [
                    {
                        "MR_id": request.MR_id,
                        "user_id": request.user_id,
                        "status": request.status,
                    }
                    for request in requests
                ]
            }
        )


class ApproveManagerRequestResource(Resource):
    def put(self, request_id):
        request = ManagerRequest.query.get(request_id)
        if request:
            request.status = True
            # Assuming you have a method to add the 'manager' role to the user
            user = User.query.get(request.user_id)
            user.roles.append(Role.query.filter_by(name="manager").first())
            db.session.commit()
            return jsonify({"message": "Manager request approved successfully!"}), 200
        else:
            return jsonify({"error": "Manager request not found!"}), 404
