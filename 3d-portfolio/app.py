import base64
from pathlib import Path
from urllib.parse import quote

import streamlit as st

PROFILE_IMAGE_PATH = Path(__file__).resolve().parent / "project images" / "DSC_0341.JPG"


def section_image(title: str, emoji: str, colors: tuple[str, str]) -> str:
    start_color, end_color = colors
    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="{start_color}" />
                <stop offset="100%" stop-color="{end_color}" />
            </linearGradient>
        </defs>
        <rect width="240" height="240" rx="36" fill="url(#bg)" />
        <circle cx="120" cy="92" r="42" fill="rgba(255,255,255,0.18)" />
        <text x="120" y="108" text-anchor="middle" font-size="34">{emoji}</text>
        <text x="120" y="178" text-anchor="middle" fill="white" font-size="22" font-family="Arial, sans-serif" font-weight="700">{title}</text>
    </svg>
    """
    return f"data:image/svg+xml;charset=utf-8,{quote(svg)}"


def tech_image(label: str, short: str, colors: tuple[str, str], icon: str) -> str:
    start_color, end_color = colors
    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" width="190" height="150" viewBox="0 0 190 150">
        <defs>
            <linearGradient id="tech-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="{start_color}" />
                <stop offset="100%" stop-color="{end_color}" />
            </linearGradient>
        </defs>
        <rect width="190" height="150" rx="24" fill="url(#tech-bg)" />
        <circle cx="95" cy="52" r="30" fill="rgba(255,255,255,0.16)" />
        <text x="95" y="61" text-anchor="middle" font-size="26">{icon}</text>
        <text x="95" y="103" text-anchor="middle" fill="white" font-size="28" font-family="Arial, sans-serif" font-weight="700">{short}</text>
        <text x="95" y="128" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">{label}</text>
    </svg>
    """
    return f"data:image/svg+xml;charset=utf-8,{quote(svg)}"


def local_image_data(path: str) -> str:
    image_path = Path(__file__).resolve().parent / path
    suffix = image_path.suffix.lower()
    mime_type = "image/png" if suffix == ".png" else "image/jpeg"
    encoded = base64.b64encode(image_path.read_bytes()).decode("ascii")
    return f"data:{mime_type};base64,{encoded}"

# Set page configuration
st.set_page_config(
    page_title="Aryan Sawant - Portfolio",
    page_icon=str(PROFILE_IMAGE_PATH),
    layout="wide",
)

# Custom CSS for styling
st.markdown(
    """
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #1a1a2e;
            color: #eaeaea;
        }
        .header {
            text-align: center;
            padding: 50px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 28px;
            max-width: 1280px;
            margin: 0 auto 30px;
            backdrop-filter: blur(14px);
            color: #eaeaea;
        }
        .header-profile {
            width: 130px;
            height: 130px;
            object-fit: cover;
            border-radius: 50%;
            margin: 0 auto 22px;
            display: block;
            border: 4px solid rgba(233, 69, 96, 0.85);
            box-shadow: 0 18px 34px rgba(0, 0, 0, 0.28);
        }
        .header h1 {
            font-size: 3em;
            margin: 0;
        }
        .section {
            margin: 40px 0;
            padding: 30px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 28px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
            backdrop-filter: blur(14px);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            max-width: 1280px;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
        }
        .section > img {
            width: 180px;
            height: 180px;
            border-radius: 24px;
            object-fit: cover;
            flex-shrink: 0;
            display: none;
        }
        .section h2 {
            color: #e94560;
            border-bottom: 2px solid #e94560;
            padding-bottom: 5px;
            display: inline-block;
        }
        .section p, .section ul {
            font-size: 1.2em;
            line-height: 1.8;
        }
        .section ul {
            padding-left: 0;
            list-style-position: inside;
        }
        .section ul li {
            margin-bottom: 15px;
        }
        .story {
            font-style: italic;
            color: #c4c4c4;
        }
        .experience-section > div {
            width: 100%;
        }
        .experience-list {
            display: flex;
            flex-direction: column;
            gap: 28px;
            margin-top: 28px;
            width: 100%;
        }
        .experience-card {
            width: min(760px, 82%);
            padding: 24px 28px;
            background: rgba(255, 255, 255, 0.055);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 22px;
            box-shadow: 0 16px 30px rgba(0, 0, 0, 0.16);
            text-align: left;
            display: flex;
            align-items: center;
            gap: 24px;
        }
        .experience-logo {
            width: 110px;
            height: 110px;
            object-fit: contain;
            flex: 0 0 110px;
            padding: 14px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 22px;
            box-shadow: 0 14px 26px rgba(0, 0, 0, 0.18);
        }
        .experience-content {
            flex: 1;
        }
        .experience-card.right {
            align-self: flex-end;
        }
        .experience-card.left {
            align-self: flex-start;
        }
        .experience-card h3 {
            margin-top: 0;
            text-align: center;
        }
        .experience-card ul {
            margin-bottom: 0;
            padding-left: 22px;
            list-style-position: outside;
        }
        .contact {
            text-align: center;
            margin-top: 50px;
            justify-content: center;
            flex-direction: column;
            align-items: center;
        }
        .contact > img {
            margin: 0 auto 10px;
        }
        .contact div {
            width: 100%;
        }
        .contact h2 {
            display: inline-block;
        }
        .contact ul {
            padding-left: 0;
        }
        @media (max-width: 768px) {
            .section {
                flex-direction: column;
                text-align: center;
            }
            .section img {
                width: 160px;
                height: 160px;
            }
            .section ul {
                text-align: center;
            }
            .experience-card {
                width: 100%;
                padding: 22px 18px;
                text-align: left;
                flex-direction: column;
                align-items: center;
            }
            .experience-logo {
                width: 96px;
                height: 96px;
                flex-basis: auto;
            }
            .experience-card.right,
            .experience-card.left {
                align-self: stretch;
            }
            .experience-card ul {
                text-align: left;
            }
            .contact ul {
                text-align: center;
            }
            .contact-links {
                gap: 16px;
            }
            .skill-grid {
                grid-template-columns: repeat(2, minmax(120px, 1fr));
            }
            .project-grid {
                grid-template-columns: 1fr;
            }
        }
        .contact a {
            color: #e94560;
            text-decoration: none;
            font-weight: bold;
        }
        .skill-grid {
            display: grid;
            grid-template-columns: repeat(7, minmax(0, 1fr));
            gap: 18px;
            margin-top: 24px;
        }
        .skill-card {
            text-align: center;
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 18px 14px 14px;
            box-shadow: 0 14px 24px rgba(0, 0, 0, 0.18);
            transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .skill-card:hover {
            transform: scale(1.06);
            box-shadow: 0 18px 34px rgba(0, 0, 0, 0.24);
            border-color: rgba(255, 255, 255, 0.22);
        }
        .skill-logo-wrap {
            width: 92px;
            height: 92px;
            margin: 0 auto 12px;
            border-radius: 22px;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            box-shadow: inset 0 0 0 1px rgba(15, 52, 96, 0.06);
        }
        .skill-card img {
            width: 100%;
            max-width: 56px;
            max-height: 56px;
            height: auto;
            display: block;
            margin: 0 auto;
        }
        .skill-card span {
            display: block;
            color: #eaeaea;
            font-weight: 600;
            font-size: 0.98em;
        }
        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 22px;
            margin-top: 24px;
            width: 100%;
        }
        .project-card {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 22px;
            overflow: hidden;
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18);
        }
        .project-card img {
            width: 100%;
            max-width: none;
            height: 180px;
            object-fit: cover;
            border-radius: 0;
        }
        .project-card-body {
            padding: 18px 18px 20px;
        }
        .project-card h3 {
            margin: 0 0 10px;
            color: #ffffff;
        }
        .project-card ul {
            margin: 0 0 14px;
            padding-left: 0;
            list-style-position: inside;
        }
        .project-link {
            display: inline-block;
            color: #ffd166;
            font-weight: 700;
            text-decoration: none;
        }
        .project-url {
            display: block;
            margin-bottom: 12px;
            color: #74c0fc;
            text-decoration: none;
            word-break: break-all;
        }
        .project-url:hover {
            text-decoration: underline;
        }
        .project-link:hover {
            text-decoration: underline;
        }
        @supports (animation-timeline: view()) {
            .skills-section .skill-card {
                opacity: 0;
                transform: translateY(34px) scale(0.88);
                animation: skill-pop 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) both;
                animation-timeline: view();
                animation-range: entry 10% cover 35%;
            }
            .skills-section .skill-card:nth-child(1) { animation-delay: 0.05s; }
            .skills-section .skill-card:nth-child(2) { animation-delay: 0.12s; }
            .skills-section .skill-card:nth-child(3) { animation-delay: 0.19s; }
            .skills-section .skill-card:nth-child(4) { animation-delay: 0.26s; }
            .skills-section .skill-card:nth-child(5) { animation-delay: 0.33s; }
            .skills-section .skill-card:nth-child(6) { animation-delay: 0.40s; }
            .skills-section .skill-card:nth-child(7) { animation-delay: 0.47s; }
            .skills-section .skill-card:nth-child(8) { animation-delay: 0.54s; }
            .skills-section .skill-card:nth-child(9) { animation-delay: 0.61s; }
            .skills-section .skill-card:nth-child(10) { animation-delay: 0.68s; }
            .skills-section .skill-card:nth-child(11) { animation-delay: 0.75s; }
            .skills-section .skill-card:nth-child(12) { animation-delay: 0.82s; }
            .skills-section .skill-card:nth-child(13) { animation-delay: 0.89s; }
            .skills-section .skill-card:nth-child(14) { animation-delay: 0.96s; }
        }
        @keyframes skill-pop {
            0% {
                opacity: 0;
                transform: translateY(34px) scale(0.88);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        .contact-links {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 28px;
            flex-wrap: wrap;
            padding: 0;
            margin: 20px 0 0;
        }
        .contact-links li {
            list-style: none;
            margin: 0;
        }
        .contact-links a {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 1.12rem;
        }
        .contact-icon {
            width: 24px;
            height: 24px;
            object-fit: contain;
            display: inline-block;
        }
        .contact a:hover {
            text-decoration: underline;
        }
    </style>
    """,
    unsafe_allow_html=True
)

# Header
st.markdown(
    """
    <div class="header">
        <img class="header-profile" src="{profile_image}" alt="Aryan Sawant">
        <h1>Aryan Sawant</h1>
    </div>
    """.format(profile_image=local_image_data("project images/DSC_0341.JPG")),
    unsafe_allow_html=True
)

# Storytelling format with images
# Summary Section
st.markdown(
    """
    <div class="section skills-section">
        <img src="{image}" alt="Profile">
        <div>
            <h2>My Journey</h2>
            <p class="story">I am a Computer Engineering student and data-focused developer who has built practical experience across analytics, dashboards, machine learning, and data engineering. My journey began with a Data Analyst Internship at DRDO, where I worked on aircraft tire defect detection, waste forecasting dashboards, and AI-driven research for defense operations. I later contributed as a Data Analyst at KUIK, building delivery performance pipelines, PostgreSQL optimizations, coverage dashboards, and automation tools for real business problems. Alongside my work experience, I have created projects in customer delivery analytics and network communication, strengthened skills in Python, SQL, PostgreSQL, Power BI, machine learning, and cloud/data tools, and secured 2nd runner-up in the Tantraudgar 2025 Insight Innovators Challenge.</p>
        </div>
    </div>
    """.format(image=section_image("Journey", "🚀", ("#e94560", "#533483"))),
    unsafe_allow_html=True
)

# Experience Section
st.markdown(
    """
    <div class="section skills-section experience-section">
        <img src="{image}" alt="Experience">
        <div>
            <h2>Professional Experience</h2>
            <p class="story">I began my professional journey as a Data Analyst Intern at DRDO, where I worked on cutting-edge projects for the Indian Air Force. This experience laid the foundation for my career in data engineering, and I have since contributed to impactful projects that solve real-world problems.</p>
            <div class="experience-list">
                <div class="experience-card right">
                    <img class="experience-logo" src="{kuik_logo}" alt="KUIK logo">
                    <div class="experience-content">
                        <h3>Data Analyst at KUIK (Aug 2025 - Mar 2026)</h3>
                        <ul>
                            <li>Developed innovative data pipelines to enhance delivery performance for major clients like Amazon and Myntra.</li>
                            <li>Created dashboards that improved visibility into delivery delays and SLA breaches, achieving a 30% improvement.</li>
                            <li>Optimized PostgreSQL queries to boost data reliability and accuracy by 10%.</li>
                            <li>Integrated pincode coverage dashboards to identify serviceable delivery areas for quick and non-quick orders.</li>
                            <li>Developed a Python-based tool to calculate the farthest serviceable delivery point, eliminating manual calculations.</li>
                        </ul>
                    </div>
                </div>
                <div class="experience-card left">
                    <img class="experience-logo" src="{drdo_logo}" alt="DRDO logo">
                    <div class="experience-content">
                        <h3>Data Analyst Intern at DRDO (Jan 2024 - Sep 2024)</h3>
                        <ul>
                            <li>Designed an aircraft tire defect detection system with 93% accuracy for the Indian Air Force.</li>
                            <li>Built Power BI dashboards for waste category forecasting, reducing waste management costs for defense operations.</li>
                            <li>Published a research paper on AI-driven waste management in a high-impact journal.</li>
                            <li>Improved analytical accuracy by 9% using data normalization techniques and identified new waste generation areas.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    """.format(
        image=section_image("Experience", "💼", ("#0f9b8e", "#1a5f7a")),
        kuik_logo=local_image_data("project images/thekuik_logo.jfif"),
        drdo_logo=local_image_data("project images/drdo.png"),
    ),
    unsafe_allow_html=True
)

# Projects Section
st.markdown(
    """
    <div class="section skills-section">
        <img src="{image}" alt="Projects">
        <div>
            <h2>Projects</h2>
            <p class="story">Throughout my career, I have worked on impactful projects that solve real-world problems. Here are a few highlights:</p>
            <div class="project-grid">
                <div class="project-card">
                    <img src="{project_one_image}" alt="Customer Delivery Performance Analytics">
                    <div class="project-card-body">
                        <h3>Customer Delivery Performance Analytics</h3>
                        <a class="project-url" href="{project_one_link}" target="_blank">{project_one_label}</a>
                        <ul>
                            <li>Analyzed over 50,000 delivery records to identify patterns and optimize performance.</li>
                            <li>Designed dashboards to track key metrics like on-time delivery rates and hub efficiency.</li>
                            <li>Reduced last-mile SLA breaches by implementing data-driven solutions.</li>
                        </ul>
                        <a class="project-link" href="{project_one_link}" target="_blank">View Project</a>
                    </div>
                </div>
                <div class="project-card">
                    <img src="{project_two_image}" alt="Network Chat Room">
                    <div class="project-card-body">
                        <h3>Network Chat Room</h3>
                        <a class="project-url" href="{project_two_link}" target="_blank">{project_two_label}</a>
                        <ul>
                            <li>Developed a LAN chat application enabling real-time group messaging for local networks.</li>
                            <li>Implemented robust communication protocols for seamless user interaction.</li>
                            <li>Designed an intuitive user interface for efficient communication across active network participants.</li>
                        </ul>
                        <a class="project-link" href="{project_two_link}" target="_blank">View Project</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    """.format(
        image=section_image("Projects", "📊", ("#5f0f40", "#9a031e")),
        project_one_image=local_image_data("project images/download.png"),
        project_two_image=local_image_data("project images/image1.jpg"),
        project_one_link="https://aryans1211-customer-anal-kuik-delivery-analysisdashboard-zouprb.streamlit.app/",
        project_two_link="https://github.com/AryanS1211/Network_Chat_Room.git",
        project_one_label="aryans1211-customer-anal-kuik-delivery-analysisdashboard-zouprb.streamlit.app",
        project_two_label="github.com/AryanS1211/Network_Chat_Room.git",
    ),
    unsafe_allow_html=True
)

# Hackathon Section
st.markdown(
    """
    <div class="section">
        <img src="{image}" alt="Hackathon">
        <div>
            <h2>Hackathon</h2>
            <p class="story">A proud milestone from my competitive data journey, where practical analytics and predictive modelling came together in a high-pressure challenge.</p>
            <div class="project-grid">
                <div class="project-card">
                    <img src="{hackathon_image}" alt="Hackathon win">
                    <div class="project-card-body">
                        <h3>Hackathon Achievement</h3>
                        <ul>
                            <li>Secured 2nd runner-up in the Tantraudgar 2025 Insight Innovators Challenge.</li>
                            <li>Competed in data analytics and predictive modelling with a practical solution.</li>
                            <li>Awarded a cash prize of Rs. 10,000 for the winning performance.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    """.format(
        image=section_image("Hackathon", "🏆", ("#f7971e", "#ffd200")),
        hackathon_image=local_image_data("project images/hackthon.jpeg"),
    ),
    unsafe_allow_html=True
)

# Education Section
st.markdown(
    """
    <div class="section">
        <img src="{image}" alt="Education">
        <div>
            <h2>Education</h2>
            <p class="story">I am currently pursuing Computer Engineering from Pune University, where I have built a strong base in programming, databases, analytics, and problem solving.</p>
            <ul>
                <li><strong>Bachelor of Computer Engineering</strong>, Pune University, 2026, 7.8 CGPA</li>
                <li><strong>Class XII</strong>, Nano Krims Junior College, 2022, 71%</li>
                <li><strong>Class X</strong>, Mahaveer English Medium School, 2020, 81%</li>
            </ul>
        </div>
    </div>
    """.format(image=section_image("Education", "🎓", ("#355c7d", "#6c5b7b"))),
    unsafe_allow_html=True
)

# Skills Section
st.markdown(
    """
    <div class="section">
        <img src="{image}" alt="Skills">
        <div>
            <h2>Skills</h2>
            <p class="story">Most of my work revolves around Python, SQL, dashboards, and data pipelines, with hands-on practice in machine learning, business intelligence, and cloud-based data tools.</p>
            <div class="skill-grid">
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{python_image}" alt="Python"></div><span>Python</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{pandas_image}" alt="Pandas"></div><span>Pandas</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{numpy_image}" alt="NumPy"></div><span>NumPy</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{sql_image}" alt="SQL"></div><span>SQL</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{postgres_image}" alt="PostgreSQL"></div><span>PostgreSQL</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{java_image}" alt="Java"></div><span>Java</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{ml_image}" alt="Machine Learning"></div><span>Machine Learning</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{dl_image}" alt="Deep Learning"></div><span>Deep Learning</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{adf_image}" alt="Azure Data Factory"></div><span>Azure Data Factory</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{supabase_image}" alt="Supabase"></div><span>Supabase</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{powerbi_image}" alt="Power BI"></div><span>Power BI</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{excel_image}" alt="Excel"></div><span>Excel</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{superset_image}" alt="Apache Superset"></div><span>Apache Superset</span></div>
                <div class="skill-card"><div class="skill-logo-wrap"><img src="{looker_image}" alt="Looker Studio"></div><span>Looker Studio</span></div>
            </div>
        </div>
    </div>
    """.format(
        image=section_image("Skills", "🛠", ("#16213e", "#0f3460")),
        python_image="https://cdn.simpleicons.org/python",
        pandas_image="https://cdn.simpleicons.org/pandas",
        numpy_image="https://cdn.simpleicons.org/numpy",
        sql_image="https://img.icons8.com/color/96/000000/sql.png",
        postgres_image="https://cdn.simpleicons.org/postgresql",
        java_image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        ml_image="https://cdn.simpleicons.org/scikitlearn",
        dl_image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
        adf_image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
        supabase_image="https://cdn.simpleicons.org/supabase",
        powerbi_image="https://img.icons8.com/color/96/power-bi-2021.png",
        excel_image="https://img.icons8.com/color/96/microsoft-excel-2019--v1.png",
        superset_image="https://cdn.simpleicons.org/apachesuperset",
        looker_image="https://cdn.simpleicons.org/looker",
    ),
    unsafe_allow_html=True
)

# Contact Section
st.markdown(
    """
    <div class="section contact">
        <img src="{image}" alt="Contact">
        <div>
            <h2>Contact</h2>
            <p>If you'd like to connect or collaborate, feel free to reach out!</p>
            <ul class="contact-links">
                <li><a href="mailto:aryansawant1144@gamil.com"><img class="contact-icon" src="{gmail_icon}" alt="Gmail logo">aryansawant1144@gamil.com</a></li>
                <li><a href="tel:+919604475651"><img class="contact-icon" src="{phone_icon}" alt="Phone icon">+91 9604475651</a></li>
                <li><a href="https://www.linkedin.com/in/aryan-sawant/" target="_blank"><img class="contact-icon" src="{linkedin_icon}" alt="LinkedIn logo">LinkedIn</a></li>
                <li><a href="https://github.com/AryanS1211" target="_blank"><img class="contact-icon" src="{github_icon}" alt="GitHub logo">AryanS1211</a></li>
            </ul>
        </div>
    </div>
    """.format(
        image=section_image("Contact", "📬", ("#1f4068", "#e43f5a")),
        gmail_icon="https://img.icons8.com/color/48/gmail-new.png",
        phone_icon="https://img.icons8.com/color/48/phone.png",
        linkedin_icon="https://img.icons8.com/color/48/linkedin.png",
        github_icon="https://cdn.simpleicons.org/github/FFFFFF",
    ),
    unsafe_allow_html=True
)
