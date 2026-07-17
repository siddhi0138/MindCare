import base64
import os
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email import encoders

import requests
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

GMAIL_SENDER_EMAIL = os.getenv("GMAIL_SENDER_EMAIL")
GMAIL_CLIENT_ID = os.getenv("GMAIL_CLIENT_ID")
GMAIL_CLIENT_SECRET = os.getenv("GMAIL_CLIENT_SECRET")
GMAIL_REFRESH_TOKEN = os.getenv("GMAIL_REFRESH_TOKEN")

GMAIL_SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"


def is_configured() -> bool:
    return bool(GMAIL_SENDER_EMAIL and GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET and GMAIL_REFRESH_TOKEN)


def _get_access_token() -> str:
    credentials = Credentials(
        token=None,
        refresh_token=GMAIL_REFRESH_TOKEN,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GMAIL_CLIENT_ID,
        client_secret=GMAIL_CLIENT_SECRET,
    )
    credentials.refresh(Request())
    return credentials.token


def _send_mime_message(message: MIMEMultipart) -> None:
    if not is_configured():
        raise RuntimeError("Gmail sending is not configured. Set GMAIL_* vars in backend/.env")

    message["From"] = f"MindCare <{GMAIL_SENDER_EMAIL}>"
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")

    access_token = _get_access_token()
    response = requests.post(
        GMAIL_SEND_URL,
        headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
        json={"raw": raw},
        timeout=15,
    )
    response.raise_for_status()


def send_email(to_email: str, subject: str, body: str) -> None:
    message = MIMEMultipart()
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))
    _send_mime_message(message)


def send_email_with_attachment(
    to_email: str, subject: str, body: str, attachment_bytes: bytes, attachment_filename: str
) -> None:
    message = MIMEMultipart()
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    part = MIMEBase("application", "octet-stream")
    part.set_payload(attachment_bytes)
    encoders.encode_base64(part)
    part.add_header("Content-Disposition", f'attachment; filename="{attachment_filename}"')
    message.attach(part)

    _send_mime_message(message)
