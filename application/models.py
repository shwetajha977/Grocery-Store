from flask_security import UserMixin, RoleMixin
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model, UserMixin):
    __tablename__ = "user"
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    phone_no = db.Column(db.String(15), nullable=False)
    address = db.Column(db.String(500), nullable=False)
    gender = db.Column(db.String(10), nullable=False)

    active = db.Column(db.Boolean(), default=True)
    last_login_at = db.Column(
        db.DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship(
        "Role", secondary="roles_users", backref=db.backref("users", lazy="dynamic")
    )
    orders = db.relationship("Order", backref="user")


class Role(db.Model, RoleMixin):
    __tablename__ = "role"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


class RolesUsers(db.Model):
    __tablename__ = "roles_users"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column("user_id", db.Integer, db.ForeignKey("user.id"))
    role_id = db.Column("role_id", db.Integer, db.ForeignKey("role.id"))


class ManagerRequest(db.Model):
    __tablename__ = "manager_request"
    MR_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    status = db.Column(db.Boolean, nullable=False)
    manager = db.relationship("User", backref="manager")


class CategoryRequest(db.Model):
    __tablename__ = "category_request"
    CR_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    C_name = db.Column(db.String, nullable=False)
    newC_name = db.Column(db.String, nullable=True)
    CR_type = db.Column(db.String, nullable=False)
    status = db.Column(db.Boolean, nullable=False)


class Categories(db.Model):
    __tablename__ = "categories"
    C_id = db.Column(db.Integer, primary_key=True)
    C_name = db.Column(db.String(150), nullable=False)


class Products(db.Model):
    __tablename__ = "products"
    P_id = db.Column(db.Integer, primary_key=True)
    P_name = db.Column(db.String(150), nullable=False)
    C_name = db.Column(db.String(150), nullable=False)
    MFG = db.Column(db.String, nullable=False)
    EXP = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    rate_per_unit = db.Column(db.Integer, nullable=False)
    unit = db.Column(db.String(50), nullable=False)
    sold = db.Column(db.Integer, nullable=True, default=0)
    P_user = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)


class Cart(db.Model):
    __tablename__ = "cart"
    c_id = db.Column(db.Integer, primary_key=True)
    P_id = db.Column(db.Integer, nullable=False)
    P_name = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    rate_per_unit = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)


class Order(db.Model):
    __tablename__ = "order"
    o_id = db.Column(db.Integer, primary_key=True)
    P_name = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    rate_per_unit = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    P_id = db.Column(db.Integer, db.ForeignKey("products.P_id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
