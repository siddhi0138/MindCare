from io import BytesIO

from fpdf import FPDF


def generate_assessment_report_pdf(user_name: str, entries: list[dict]) -> bytes:
    pdf = FPDF()
    pdf.set_margin(15)
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 18)
    pdf.cell(0, 12, text="MindCare Assessment Report", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 8, text=f"For: {user_name}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, text=f"Entries: {len(entries)}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    for entry in entries:
        pdf.set_font("Helvetica", "B", 13)
        pdf.cell(0, 9, text=f"{entry['type'].capitalize()} Assessment", new_x="LMARGIN", new_y="NEXT")

        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 6, text=f"Date: {entry['timestamp']}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 6, text=f"Score: {entry['score']}   Level: {entry['level']}", new_x="LMARGIN", new_y="NEXT")

        recommendations = entry.get("recommendations") or []
        if recommendations:
            pdf.cell(0, 6, text="Recommendations:", new_x="LMARGIN", new_y="NEXT")
            for rec in recommendations:
                pdf.cell(0, 6, text=f"  - {rec}", new_x="LMARGIN", new_y="NEXT")

        pdf.ln(4)

    pdf.set_font("Helvetica", "I", 8)
    disclaimer_lines = [
        "This report is generated from self-reported screening tools and is for",
        "informational purposes only. It is not a clinical diagnosis. Please consult",
        "a licensed mental health professional for a full evaluation.",
    ]
    for line in disclaimer_lines:
        pdf.cell(0, 5, text=line, new_x="LMARGIN", new_y="NEXT")

    return bytes(pdf.output())
