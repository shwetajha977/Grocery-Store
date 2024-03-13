from flask import Flask, render_template
from application.models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore
from config import DevelopmentConfig
from flask_restful import Api
from application.sec import datastore
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.security import generate_password_hash
from application import worker
from application import task

app = None
api = None
celery = None
cache = None


def create_app():
    app = Flask(__name__, template_folder="templates")  # application instance
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api = Api(app)
    app.app_context().push()
    jwt = JWTManager(app)
    app.security = Security(app, datastore)  # Flask Security
    celery = worker.celery
    celery.conf.update(
        broker_url=app.config["CELERY_BROKER_URL"],
        result_backend=app.config["CELERY_RESULT_BACKEND"],
        broker_connection_retry_on_startup=True,
        timezone="Asia/Kolkata",
    )
    celery.Task = worker.CeleryWorker
    app.app_context().push()

    with app.app_context():
        import application.views

        db.create_all()
        datastore.find_or_create_role(name="admin", description="User is Admin")
        datastore.find_or_create_role(name="manager", description="User is Manager")
        datastore.find_or_create_role(name="customer", description="User is Customer")
        db.session.commit()
        if not datastore.find_user(email="admin@gmail.com"):
            datastore.create_user(
                username="Shweta Jha",
                email="admin@gmail.com",
                password=generate_password_hash("admin"),
                phone_no="6390775633",
                address="2/81 Kanchan Nagar A, Shuklaganj, Unnao, Uttar Pradesh 209871",
                gender="Female",
                roles=["admin"],
            )
            db.session.commit()
    return app, api, celery


app, api, celery = create_app()


from application.resources import CategoryResource
from application.resources import ProductResource
from application.resources import UserResource


api.add_resource(CategoryResource, "/add-categories")
api.add_resource(ProductResource, "/add-products")
api.add_resource(UserResource, "/add-user")


@app.errorhandler(403)
def not_authorized(e):
    return render_template("/security/403.html"), 403


@app.errorhandler(404)
def page_not_found(e):
    return render_template("/security/404.html"), 404


@app.errorhandler(405)
def not_authorized(e):
    return render_template("/security/403.html"), 405


if __name__ == "__main__":
    app.run(debug=True)
