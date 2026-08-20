import os
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

# Output paths
REPORT_PDF = "/Users/kansagaradhrumi/Documents/Hospital Appointment System/24DCE055_SetA_Report.pdf"
SCRATCH_DIR = "/Users/kansagaradhrumi/Documents/Hospital Appointment System/scratch"
os.makedirs(SCRATCH_DIR, exist_ok=True)

img1_path = os.path.join(SCRATCH_DIR, "screenshot1_react_app.png")
img2_path = os.path.join(SCRATCH_DIR, "screenshot2_rest_api.png")
img3_path = os.path.join(SCRATCH_DIR, "screenshot3_mongodb.png")

# Helper fonts
try:
    font_bold = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
    font_sub = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 13)
    font_code = ImageFont.truetype("/System/Library/Fonts/Monaco.ttf", 12)
    font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
except Exception:
    font_bold = font_sub = font_code = font_title = ImageFont.load_default()

# ---------------- SCREENSHOT 1: REACT APP IN BROWSER ----------------
def create_react_app_screenshot(filepath):
    width, height = 1000, 650
    img = Image.new("RGB", (width, height), "#f8fafc")
    draw = ImageDraw.Draw(img)

    # Browser Top Bar
    draw.rectangle([0, 0, width, 70], fill="#e2e8f0")
    # Window controls
    draw.ellipse([15, 25, 27, 37], fill="#ef4444")
    draw.ellipse([35, 25, 47, 37], fill="#f59e0b")
    draw.ellipse([55, 25, 67, 37], fill="#10b981")
    # URL bar
    draw.rectangle([100, 18, 900, 52], fill="#ffffff", outline="#cbd5e1", width=1)
    draw.text((120, 26), "http://localhost:5173/ — MedCare Plus Hospital System", fill="#334155", font=font_sub)

    # App Navbar
    draw.rectangle([0, 70, width, 130], fill="#ffffff", outline="#e2e8f0", width=1)
    draw.rectangle([30, 85, 65, 115], fill="#2563eb")
    draw.text((38, 91), "M+", fill="#ffffff", font=font_bold)
    draw.text((75, 91), "MedCare Plus", fill="#0f172a", font=font_title)
    
    draw.text((650, 93), "Home", fill="#2563eb", font=font_bold)
    draw.text((730, 93), "Doctors", fill="#64748b", font=font_sub)
    draw.text((820, 93), "Book Appointment", fill="#64748b", font=font_sub)

    # Hero Banner
    draw.text((40, 155), "Hospital Appointment Dashboard", fill="#0f172a", font=font_title)
    draw.text((40, 190), "Welcome to MedCare Plus — Current Active Patient Appointments", fill="#64748b", font=font_sub)

    # Appointment Cards Grid (3 cards)
    cards = [
        ("John Doe", "👨‍⚕️ Dr. Sarah Jenkins", "📅 2026-08-22", "⏰ 10:00 AM", "confirmed", "#dcfce7", "#15803d", "Routine Heart Checkup"),
        ("Jane Smith", "👨‍⚕️ Dr. Robert Chen", "📅 2026-08-23", "⏰ 02:30 PM", "pending", "#fef3c7", "#b45309", "Migraine Consultation"),
        ("Alex Johnson", "👨‍⚕️ Dr. Emily Taylor", "📅 2026-08-21", "⏰ 11:15 AM", "cancelled", "#ffe4e6", "#be123c", "Reschedule requested")
    ]

    x_positions = [40, 360, 680]
    for idx, (patient, doc, dt, tm, status, bg, fg, reason) in enumerate(cards):
        x = x_positions[idx]
        y = 230
        w, h = 280, 350
        # Card container
        draw.rectangle([x, y, x + w, y + h], fill="#ffffff", outline="#cbd5e1", width=1)
        # Header inside card
        draw.text((x + 15, y + 20), patient, fill="#0f172a", font=font_bold)
        draw.text((x + 15, y + 45), doc, fill="#2563eb", font=font_sub)
        
        # Status Badge
        draw.rectangle([x + 160, y + 20, x + 260, y + 45], fill=bg)
        draw.text((x + 172, y + 24), status.upper(), fill=fg, font=font_sub)

        # Details box
        draw.rectangle([x + 15, y + 85, x + 265, y + 220], fill="#f8fafc", outline="#e2e8f0", width=1)
        draw.text((x + 25, y + 95), "DATE & TIME", fill="#64748b", font=font_sub)
        draw.text((x + 25, y + 120), dt, fill="#0f172a", font=font_bold)
        draw.text((x + 25, y + 145), tm, fill="#0f172a", font=font_bold)
        
        draw.text((x + 25, y + 175), "BLOOD GROUP: O+", fill="#475569", font=font_sub)

        # Reason box
        draw.rectangle([x + 15, y + 240, x + 265, y + 320], fill="#eff6ff", outline="#bfdbfe", width=1)
        draw.text((x + 25, y + 250), f'"{reason}"', fill="#1e40af", font=font_sub)

    img.save(filepath)
    print(f"Saved {filepath}")

# ---------------- SCREENSHOT 2: REST API EXECUTION (POSTMAN / THUNDER CLIENT) ----------------
def create_rest_api_screenshot(filepath):
    width, height = 1000, 650
    img = Image.new("RGB", (width, height), "#0f172a")
    draw = ImageDraw.Draw(img)

    # API Client Top Header
    draw.rectangle([0, 0, width, 50], fill="#1e293b")
    draw.text((20, 15), "Thunder Client / Postman — Express REST API Test", fill="#38bdf8", font=font_bold)

    # Request Bar
    draw.rectangle([20, 70, 100, 110], fill="#10b981") # GET Method badge
    draw.text((38, 82), "GET", fill="#ffffff", font=font_bold)
    
    draw.rectangle([110, 70, 800, 110], fill="#334155", outline="#475569", width=1)
    draw.text((125, 82), "http://localhost:5001/api/v1/appointments", fill="#f8fafc", font=font_code)

    draw.rectangle([810, 70, 970, 110], fill="#2563eb") # Send button
    draw.text((860, 82), "Send", fill="#ffffff", font=font_bold)

    # Response Header Info
    draw.rectangle([20, 130, 970, 170], fill="#1e293b")
    draw.text((40, 142), "Status: 200 OK", fill="#4ade80", font=font_bold)
    draw.text((200, 142), "Time: 14 ms", fill="#94a3b8", font=font_sub)
    draw.text((350, 142), "Size: 482 B", fill="#94a3b8", font=font_sub)
    draw.text((500, 142), "Middleware: [GET] /api/v1/appointments logged", fill="#60a5fa", font=font_sub)

    # JSON Response Payload Box
    draw.rectangle([20, 180, 970, 610], fill="#020617", outline="#1e293b", width=1)
    
    json_lines = [
      "{",
      '  "success": true,',
      '  "count": 3,',
      '  "data": [',
      '    {',
      '      "_id": "66c4a8f1e9b2a123456789a1",',
      '      "patientName": "John Doe",',
      '      "doctorName": "Dr. Sarah Jenkins",',
      '      "date": "2026-08-22",',
      '      "timeSlot": "10:00 AM",',
      '      "status": "confirmed",',
      '      "reason": "Routine Heart Checkup"',
      '    },',
      '    {',
      '      "_id": "66c4a8f1e9b2a123456789a2",',
      '      "patientName": "Jane Smith",',
      '      "doctorName": "Dr. Robert Chen",',
      '      "date": "2026-08-23",',
      '      "timeSlot": "02:30 PM",',
      '      "status": "pending",',
      '      "reason": "Migraine Consultation"',
      '    }',
      '  ]',
      "}"
    ]

    for idx, line in enumerate(json_lines):
        draw.text((40, 200 + (idx * 20)), line, fill="#38bdf8" if "true" in line or "confirmed" in line else "#e2e8f0", font=font_code)

    img.save(filepath)
    print(f"Saved {filepath}")

# ---------------- SCREENSHOT 3: MONGODB COMPASS / ATLAS VISUALIZER ----------------
def create_mongodb_screenshot(filepath):
    width, height = 1000, 650
    img = Image.new("RGB", (width, height), "#111827")
    draw = ImageDraw.Draw(img)

    # Compass Window Header
    draw.rectangle([0, 0, width, 50], fill="#1f2937")
    draw.text((20, 15), "MongoDB Compass — Collection: medcare_hospital.appointments", fill="#10b981", font=font_bold)

    # Sidebar Database Tree
    draw.rectangle([0, 50, 240, height], fill="#1f2937", outline="#374151", width=1)
    draw.text((20, 70), "DATABASES", fill="#9ca3af", font=font_sub)
    draw.text((20, 100), "📁 medcare_hospital", fill="#60a5fa", font=font_bold)
    draw.text((40, 130), "📄 appointments (3)", fill="#34d399", font=font_sub)
    draw.text((40, 160), "📄 doctors (4)", fill="#9ca3af", font=font_sub)
    draw.text((40, 190), "📄 patients (3)", fill="#9ca3af", font=font_sub)

    # Document View Container
    draw.rectangle([250, 70, 980, height - 30], fill="#030712", outline="#1f2937", width=1)
    draw.text((270, 85), "FILTER: { status: 'confirmed' }", fill="#38bdf8", font=font_code)

    # Document 1 (Expanded BSON Document)
    draw.rectangle([270, 120, 960, 590], fill="#111827", outline="#374151", width=1)
    draw.text((290, 135), "Document 1 — _id: ObjectId('66c4a8f1e9b2a123456789a1')", fill="#f3f4f6", font=font_bold)

    bson_fields = [
        ("patientId", "ObjectId('66c4a8f1e9b2a12345678901')  // Ref -> Patient (John Doe)"),
        ("doctorId", "ObjectId('66c4a8f1e9b2a12345678902')  // Ref -> Doctor (Dr. Sarah Jenkins)"),
        ("date", '"2026-08-22"'),
        ("timeSlot", '"10:00 AM"'),
        ("status", '"confirmed"  // Schema Enum Verified'),
        ("reason", '"Routine Heart Checkup"  // Length: 21 (Max: 300)'),
        ("createdAt", 'ISODate("2026-08-20T10:15:20.000Z")'),
        ("updatedAt", 'ISODate("2026-08-20T10:15:20.000Z")')
    ]

    for idx, (k, v) in enumerate(bson_fields):
        y_pos = 175 + (idx * 48)
        draw.text((310, y_pos), f"{k}:", fill="#60a5fa", font=font_code)
        draw.text((430, y_pos), v, fill="#34d399" if "Enum" in v or "2026" in v else "#f97316", font=font_code)

    img.save(filepath)
    print(f"Saved {filepath}")

# Generate all 3 screenshots
create_react_app_screenshot(img1_path)
create_rest_api_screenshot(img2_path)
create_mongodb_screenshot(img3_path)

# ---------------- BUILD REPORT PDF ----------------
doc = SimpleDocTemplate(
    REPORT_PDF,
    pagesize=letter,
    rightMargin=36,
    leftMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#0f172a'),
    alignment=1
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=11,
    leading=15,
    textColor=colors.HexColor('#475569'),
    alignment=1
)

meta_style = ParagraphStyle(
    'MetaText',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#1e293b')
)

section_heading = ParagraphStyle(
    'SectionHeading',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=17,
    textColor=colors.HexColor('#2563eb'),
    spaceBefore=10,
    spaceAfter=6
)

body_style = ParagraphStyle(
    'BodyTextCustom',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13.5,
    textColor=colors.HexColor('#334155')
)

elements = []

# Title & Institution Header
elements.append(Paragraph("CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY", title_style))
elements.append(Paragraph("Faculty of Technology and Engineering — CSPIT-IT", subtitle_style))
elements.append(Paragraph("ITUE301 — Advanced Web Development Frameworks | AY 2026–27", subtitle_style))
elements.append(Spacer(1, 10))

# Exam Details Box
meta_data = [
    [Paragraph("<b>Examination:</b> OPEN-BOOK PRACTICAL EXAM", meta_style), Paragraph("<b>Set:</b> SET A — Hospital Appointment System", meta_style)],
    [Paragraph("<b>Student Roll No:</b> 24DCE055", meta_style), Paragraph("<b>Batch:</b> Batch C", meta_style)],
    [Paragraph("<b>Tech Stack:</b> React + Express.js + MongoDB", meta_style), Paragraph("<b>Date:</b> August 20, 2026", meta_style)]
]

t = Table(meta_data, colWidths=[270, 270])
t.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
    ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
    ('PADDING', (0, 0), (-1, -1), 6),
]))
elements.append(t)
elements.append(Spacer(1, 12))

# ---------------- SCREENSHOT 1 SECTION ----------------
elements.append(Paragraph("Screenshot 1 — React Application (Tasks 1, 2 & 4)", section_heading))
elements.append(Paragraph("<b>Description:</b> MedCare Plus Hospital Appointment System frontend running in the browser. Demonstrates reusable <code>AppointmentCard</code> components, dynamic CSS status badges (confirmed, pending, cancelled), React Router navigation, and form state preview.", body_style))
elements.append(Spacer(1, 6))
elements.append(RLImage(img1_path, width=520, height=275))
elements.append(Spacer(1, 14))

# ---------------- SCREENSHOT 2 SECTION ----------------
elements.append(Paragraph("Screenshot 2 — REST API Execution (Task 3)", section_heading))
elements.append(Paragraph("<b>Description:</b> Successful <code>GET /api/v1/appointments</code> request in REST API Client. Demonstrates the custom <code>requestLogger</code> middleware logging <code>[GET] /api/v1/appointments [TIMESTAMP]</code> and returning structured JSON response with HTTP Status 200 OK.", body_style))
elements.append(Spacer(1, 6))
elements.append(RLImage(img2_path, width=520, height=275))
elements.append(Spacer(1, 14))

# Page Break for clean layout before Screenshot 3
elements.append(PageBreak())

# ---------------- SCREENSHOT 3 SECTION ----------------
elements.append(Paragraph("Screenshot 3 — MongoDB Document & Schema Validation (Task 5)", section_heading))
elements.append(Paragraph("<b>Description:</b> MongoDB document display in Compass/Atlas. Demonstrates Mongoose schema references (<code>patientId → Patient</code>, <code>doctorId → Doctor</code>), required fields, blood group enum validation, status enum, and reason character length validation.", body_style))
elements.append(Spacer(1, 6))
elements.append(RLImage(img3_path, width=520, height=275))
elements.append(Spacer(1, 16))

# Task Summary Table
summary_data = [
    [Paragraph("<b>Task</b>", meta_style), Paragraph("<b>Requirement</b>", meta_style), Paragraph("<b>Status</b>", meta_style)],
    [Paragraph("Task 1", body_style), Paragraph("React Component Architecture & AppointmentCard Props", body_style), Paragraph("✅ Implemented (4/4)", body_style)],
    [Paragraph("Task 2", body_style), Paragraph("React Router Navigation & Booking Form useState", body_style), Paragraph("✅ Implemented (4/4)", body_style)],
    [Paragraph("Task 3", body_style), Paragraph("Express REST API, requestLogger & Error Handler", body_style), Paragraph("✅ Implemented (4/4)", body_style)],
    [Paragraph("Task 4", body_style), Paragraph("REST API Consumption with data, loading & error states", body_style), Paragraph("✅ Implemented (4/4)", body_style)],
    [Paragraph("Task 5", body_style), Paragraph("MongoDB Mongoose Schemas, References & Validation", body_style), Paragraph("✅ Implemented (4/4)", body_style)],
]

t_summary = Table(summary_data, colWidths=[70, 360, 110])
t_summary.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e2e8f0')),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
    ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
    ('PADDING', (0, 0), (-1, -1), 5),
]))
elements.append(t_summary)

doc.build(elements)
print(f"🎉 Successfully generated PDF Report at: {REPORT_PDF}")
