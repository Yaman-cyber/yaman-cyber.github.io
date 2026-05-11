"""Build an ATS-friendly 2-page PDF CV.

Single-column layout, real selectable text, standard Helvetica fonts,
no images/tables/columns/headers/footers. Section headings in bold caps
with an underline rule. Saves to assets/cv/Yaman_Arab_CV.pdf.
"""
from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "cv" / "Yaman_Arab_CV.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "Name", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=22, leading=24, spaceAfter=2,
)
contact_style = ParagraphStyle(
    "Contact", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10, leading=12, spaceAfter=8,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=11, leading=13,
    spaceBefore=6, spaceAfter=2,
)
role_style = ParagraphStyle(
    "Role", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10, leading=12, spaceBefore=4, spaceAfter=0,
)
dates_style = ParagraphStyle(
    "Dates", parent=styles["Normal"],
    fontName="Helvetica-Oblique", fontSize=9, leading=11, spaceAfter=2,
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=9.5, leading=11.5, spaceAfter=1,
)
summary_style = ParagraphStyle(
    "Summary", parent=styles["Normal"],
    fontName="Helvetica", fontSize=9.5, leading=12, spaceAfter=2,
)


def hr():
    return HRFlowable(width="100%", thickness=0.5, color="#888888",
                      spaceBefore=0, spaceAfter=3)


def section(title):
    return [Paragraph(title.upper(), section_style), hr()]


def role_block(company, title, dates, lines):
    parts = [
        Paragraph(f"<i>{company}</i>, &nbsp;<b>{title}</b>", role_style),
        Paragraph(dates, dates_style),
    ]
    for line in lines:
        parts.append(Paragraph(line, body_style))
    return KeepTogether(parts)


def build():
    story = []

    story.append(Paragraph("Yaman Arab", name_style))
    story.append(Paragraph(
        "yamanarab9@gmail.com &nbsp;•&nbsp; +971 585778599 &nbsp;•&nbsp; "
        "Abu Dhabi, UAE &nbsp;•&nbsp; https://yaman-cyber.github.io",
        contact_style,
    ))

    story += section("Summary")
    story.append(Paragraph(
        "Software Engineer and full-stack developer with 5+ years of "
        "experience delivering scalable web, mobile, and AI-powered "
        "systems for clients across the UAE, Saudi Arabia, France, "
        "Jordan, and Lebanon. Backend team lead on a 4M+ user platform "
        "(Araby.ai). Strong in Node.js, React, AWS, and the integration "
        "of LLMs, autonomous agents, and workflow automation (n8n) into "
        "production products.",
        summary_style,
    ))

    story += section("Experience")

    story.append(role_block(
        "MVP Application and Game Design",
        "Back-end Developer - Team Lead",
        "May 2023 - Present",
        [
            "Spearheaded the back-end development for Araby.ai, a high-impact platform serving over four million users.",
            "Designed and implemented RESTful APIs and expanded a microservices architecture for flexibility, performance, and maintainability.",
            "Built scalable AWS infrastructure (EC2, ELB, Elastic Beanstalk) with auto-scaling and monitoring; rebuilt the architecture to cut server cost by 50% while preserving performance.",
            "Owned CI/CD with GitHub Actions, automating deployments to AWS Elastic Beanstalk, ELB, and EC2 with minimal downtime.",
            "Integrated payment gateways (Hyperpay, PayPal, Payfort, Stripe) for secure transactions.",
            "Integrated multiple LLMs and generative AI models (OpenAI, Anthropic, open-source) and built autonomous agents for content generation, research, summarization, and workflow automation in users' daily tasks.",
            "Designed agent orchestration and tool-calling pipelines so agents invoke internal APIs, fetch data, and chain multi-step actions on behalf of users.",
            "Built and maintained n8n workflow automations powering recurring AI tasks, scheduled jobs, and cross-service integrations for both user-facing features and internal operations.",
            "Authored unit and integration tests; provided technical leadership through code reviews, mentoring, and engineering standards.",
        ],
    ))

    story.append(role_block(
        "My-Things App",
        "Full-stack Developer",
        "Sep 2022 - Present",
        [
            "Built and maintained a Node.js + SQL Server backend with high performance and scalability.",
            "Implemented real-time features with SignalR and WebSockets for live updates and notifications.",
            "Developed responsive React front-end components integrated with backend APIs.",
            "Built customer-service chatbots and integrated open-source Qwen models to handle support conversations, FAQs, and ticket triage end-to-end.",
            "Created AI-powered internal tools for data analytics, business stats, and natural-language report generation.",
            "Developed AI form-filling and document-extraction tools that auto-populate fields and parse customer documents.",
            "Designed multi-step AI agent workflows with custom pipelines to automate recurring operations and connect internal systems.",
            "Deployed and managed the app on Windows Server VMs; tuned SQL queries and stored procedures.",
        ],
    ))

    story.append(role_block(
        "Jedo App",
        "Full-stack Developer (Contract)",
        "Feb 2022 - May 2024",
        [
            "Developed robust RESTful APIs in Node.js for efficient client-server communication.",
            "Conducted code reviews and refactoring to improve performance and maintainability.",
            "Maintained and optimized database structures, ensuring data integrity and scalability.",
            "Established multiple environments for thorough testing and streamlined deployment.",
            "Integrated third-party services to extend platform functionality.",
        ],
    ))

    story.append(role_block(
        "Cnepho Company",
        "Back-end Developer",
        "May 2021 - May 2023",
        [
            "Developed RESTful APIs for efficient communication between application components.",
            "Built an e-learning platform for a French organization supporting children in underserved neighborhoods.",
            "Designed and deployed e-commerce, social media, and tourism platforms tailored to client requirements.",
            "Led project execution, assigned tasks, and ensured timely delivery of high-quality solutions across multiple client projects.",
            "Provided ongoing post-deployment support, addressing client inquiries and resolving issues.",
        ],
    ))

    story += section("Education")
    edu = [
        ("International University for Science and Technology",
         "Bachelor of Informatics Engineering", "Sep 2017 - Apr 2023"),
        ("Hong Kong University of Science and Technology",
         "Front-End Web Development with React", "Apr 2020"),
        ("University of Michigan",
         "Python for Everybody Specialization", "Mar 2020"),
        ("International University for Science and Technology",
         "Programming Skills in Java", "Dec 2018"),
    ]
    for school, line, date in edu:
        story.append(Paragraph(f"<i>{school}</i>", body_style))
        story.append(Paragraph(f"{line} &nbsp;•&nbsp; {date}", dates_style))

    story += section("Skills")
    skills = (
        "JavaScript • TypeScript • Python • PHP • C# • Node.js • ExpressJS • "
        "ReactJS • NextJS • React Native • Redux • TailwindCSS • Bootstrap • "
        "GraphQL • REST • WebSockets • SignalR • SQL • MongoDB • MySQL • "
        "SQL Server • PostgreSQL • Firebase • Redis • AWS (EC2, ELB, "
        "Elastic Beanstalk, S3) • CI/CD • GitHub Actions • Docker • Laravel "
        "• .NET • Git • Jira • Agile/Scrum • LLM Integration (OpenAI, "
        "Anthropic, open-source) • AI Agents & Tool-calling • n8n Workflow "
        "Automation • Chatbots & Conversational AI • RAG & Vector Databases "
        "• Prompt Engineering"
    )
    story.append(Paragraph(skills, body_style))

    story += section("Honors & Awards")
    story.append(Paragraph(
        "<i>Al Ain University</i>, &nbsp;<b>Guest Evaluator - Graduation Projects Exhibition</b>",
        role_style,
    ))
    story.append(Paragraph("Apr 2025", dates_style))
    story.append(Paragraph(
        "Invited to serve as a guest evaluator at the university's first "
        "graduation project exhibition. Assessed student projects that "
        "contributed to final grades, offering constructive feedback and "
        "professional recommendations. Contributed to bridging the gap "
        "between academic learning and real-world application, while "
        "supporting the development of innovative engineering ideas.",
        body_style,
    ))

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=LETTER,
        title="Yaman Arab - CV",
        author="Yaman Arab",
        subject="Curriculum Vitae",
        keywords="Software Engineer, Full Stack, Node.js, React, AWS, AI, LLM, Agents, n8n",
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
    )
    doc.build(story)
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    build()
