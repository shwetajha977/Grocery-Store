import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_ADDRESS = "ShwetaFreshDirect@gmail.com"
SENDER_PASSWORD = "123456789"


def email_sending(to, subject, message, files=None):
    msg = MIMEMultipart()
    msg["From"] = SENDER_ADDRESS
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(message, "html"))
    if files != None:
        with open(files, "rb") as fil:
            part = MIMEApplication(fil.read(), _subtype="zip")
            part.add_header("Content-Disposition", "attachment", filename=files)
            msg.attach(part)
    server = smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
    server.login(SENDER_ADDRESS, SENDER_PASSWORD)
    server.send_message(msg)
    server.quit()
    return True
