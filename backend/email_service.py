import os

import resend

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "MindCare <onboarding@resend.dev>")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def is_configured() -> bool:
    return bool(RESEND_API_KEY)


def send_email(to_email: str, subject: str, body: str) -> None:
    if not is_configured():
        raise RuntimeError("Email sending is not configured. Set RESEND_API_KEY in backend/.env")

    resend.Emails.send(
        {
            "from": RESEND_FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "text": body,
        }
    )


def send_email_with_attachment(
    to_email: str, subject: str, body: str, attachment_bytes: bytes, attachment_filename: str
) -> None:
    if not is_configured():
        raise RuntimeError("Email sending is not configured. Set RESEND_API_KEY in backend/.env")

    resend.Emails.send(
        {
            "from": RESEND_FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "text": body,
            "attachments": [
                {
                    "filename": attachment_filename,
                    "content": list(attachment_bytes),
                }
            ],
        }
    )
