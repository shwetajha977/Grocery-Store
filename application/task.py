from application.worker import celery
from datetime import datetime, timedelta
from celery.schedules import crontab
from jinja2 import Template
from application.email import email_sending
from application.models import User, Order, Categories, Products, db
import os, csv, zipfile
from flask import jsonify


@celery.on_after_finalize.connect
def setup_daily_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=19, minute=35),
        send_daily_email.s(),
        name="send_daily_email",
    )


@celery.on_after_finalize.connect
def setup_monthly_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(day_of_month="24", hour=19, minute=35),
        send_monthly_email.s(),
        name="send_monthly_email",
    )


@celery.task()
def send_daily_email():
    users = User.query.all()
    for user in users:
        if datetime.now() - user.last_login_at >= timedelta(minutes=5):
            with open("templates/daily_email_template.html") as f:
                template = Template(f.read())
                message = template.render(name=user.username)

            email_sending(to=user.email, subject="Daily Report", message=message)
    return "Daily email sent successfully!"


@celery.task()
def send_monthly_email():
    users = User.query.all()
    database = (
        db.session.query(
            User.id,
            User.username,
            User.email,
            Order.P_name,
            Order.quantity,
            Order.total,
        )
        .join(Order, User.id == Order.user_id)
        .all()
    )
    for user in users:
        products = []
        total_amount = 0
        for alpha in database:
            if user.id == alpha.id:
                total_amount += alpha.total
                details = {
                    "Product_name": alpha.P_name,
                    "quantity": alpha.quantity,
                    "total": alpha.total,
                }
                products.append(details)
        with open("templates/monthly_email_template.html") as f:
            template = Template(f.read())
            message = template.render(
                name=user.username, details=products, total=total_amount
            )

        email_sending(to=user.email, subject="Monthly Report", message=message)
    return "Monthly email sent successfully!"


@celery.task
def create_zip(C_name, to):
    categories = Categories.query.filter_by(C_name=C_name).first()
    if categories:
        products = Products.query.filter_by(C_name=C_name).all()
        csv_category = [
            ["Category Name", "Product Name", "Quantity", "Rate Per Unit", "Total"],
        ]
        for product in products:
            csv_category.append(
                [
                    C_name,
                    product.P_name,
                    product.quantity,
                    product.rate_per_unit,
                    product.quantity * product.rate_per_unit,
                ]
            )
        
        cleaned_category = datetime.now().strftime("%Y-%m-%d-%H-%M-%S-%f")
        download_folder = os.path.expanduser("~/CSV")
        csv_category_path = os.path.join(download_folder, f"{cleaned_category}.csv")
        with open(csv_category_path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerows(csv_category)

        # Create a zip file
        zip_category_path = os.path.join(download_folder, f"{cleaned_category}.zip")
        with zipfile.ZipFile(zip_category_path, "w") as z:
            z.write(csv_category_path, arcname=f"{cleaned_category}.csv")

        with open("templates/report_template.html") as f:
            template = Template(f.read())
            message = template.render()
        email_sending(to=to, subject="Report", message=message, files=zip_category_path)

    return "Successfully mailed the report!"
