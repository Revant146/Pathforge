from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

ROLE_MAP = {
    "CSE": ["AI/ML Engineer", "Frontend Developer", "Backend Developer", "Data Analyst", "Full Stack Developer"],
    "ECE": ["Embedded Systems Engineer", "VLSI Design Engineer", "IoT Developer", "Signal Processing Engineer"],
    "Mechanical": ["CAD/CAM Engineer", "Manufacturing Engineer", "Robotics Engineer"],
    "Civil": ["Structural Engineer", "Environmental Engineer", "Construction Manager"],
}

RESOURCE_GUIDE = """
Use ONLY these real, working URLs for resources:
- Python: https://www.learnpython.org, https://www.youtube.com/watch?v=_uQrJ0TkZlc
- DSA: https://leetcode.com/explore, https://www.geeksforgeeks.org/data-structures, https://neetcode.io
- DSA by topic:
  Arrays: https://leetcode.com/problems/two-sum, https://leetcode.com/problems/best-time-to-buy-and-sell-stock
  Strings: https://leetcode.com/problems/valid-anagram, https://leetcode.com/problems/longest-substring-without-repeating-characters
  Linked Lists: https://leetcode.com/problems/reverse-linked-list, https://leetcode.com/problems/merge-two-sorted-lists
  Trees: https://leetcode.com/problems/maximum-depth-of-binary-tree, https://leetcode.com/problems/invert-binary-tree
- Git: https://learngitbranching.js.org, https://www.youtube.com/watch?v=RGOj5yH7evk
- Web Dev: https://www.freecodecamp.org/learn, https://developer.mozilla.org/en-US/docs/Learn
- AI/ML: https://www.kaggle.com/learn, https://www.youtube.com/watch?v=i_LwzRVP7bg, https://course.fast.ai
- Data Analysis: https://www.kaggle.com/learn/pandas, https://www.youtube.com/watch?v=vmEHCJofslg
- Communication: https://www.coursera.org/learn/communication-skills, https://www.toastmasters.org
- LinkedIn: https://www.linkedin.com/learning, https://university.linkedin.com
- Embedded/Arduino: https://www.arduino.cc/en/Tutorial/HomePage, https://www.youtube.com/watch?v=09zfRaLEasY
- VLSI: https://www.chipverify.com, https://www.youtube.com/watch?v=lGVyGCOKjhU
- C/C++: https://www.learncpp.com, https://www.youtube.com/watch?v=vLnPwxZdW4Y
- SQL: https://sqlzoo.net, https://www.w3schools.com/sql
- System Design: https://github.com/donnemartin/system-design-primer
- Resume/Career: https://www.resumeworded.com, https://www.youtube.com/watch?v=BYUy1yvjHxE
- Aptitude: https://www.placementpreparation.io/quantitative-aptitude/, https://www.placementpreparation.io/logical-reasoning/
- Verbal/Communication: https://www.placementpreparation.io/verbal-ability/, https://www.placementpreparation.io/verbal-reasoning/
- Company prep: https://www.placementpreparation.io/placement-exams/
- TCS specific: https://www.placementpreparation.io/tcs-nqt/
- Infosys specific: https://www.placementpreparation.io/infosys/
- Wipro specific: https://www.placementpreparation.io/wipro-wilp/
- Accenture specific: https://www.placementpreparation.io/accenture/
- Cognizant specific: https://www.placementpreparation.io/cognizant-genc/
- Deloitte specific: https://www.placementpreparation.io/deloitte/
- Zoho specific: https://www.placementpreparation.io/zoho/
"""


# ── Data Models
class UserProfile(BaseModel):
    name: str
    branch: str
    role: str
    goal: str
    current_skills: list[str]
    hours_per_week: int
    quiz_answers: dict = {}
    company: str = ""

class LinkedInProfile(BaseModel):
    name: str
    branch: str
    year: str
    skills: list[str]
    projects: list[str]
    clubs: list[str]

class QuizRequest(BaseModel):
    branch: str
    role: str

class ResumeRequest(BaseModel):
    name: str
    branch: str
    role: str
    skills: list[str]
    projects: list[str]


# ── Health Check
@app.get("/health")
def health():
    return {"status": "running"}


# ── Route 1: Get Quiz Questions
@app.post("/get-quiz")
async def get_quiz(req: QuizRequest):
    prompt = f"""
Generate exactly 5 multiple choice quiz questions to assess a 1st year engineering student's current skill level.
Branch: {req.branch}
Target Role: {req.role}

Rules:
- Questions should range from very basic to intermediate
- Each question tests practical knowledge relevant to {req.role}
- Keep questions short and clear
- 4 options each (A, B, C, D)
- Include one correct answer per question

Return ONLY valid JSON, no explanation, no markdown:
{{
  "questions": [
    {{
      "id": 1,
      "question": "string",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "correct": "A"
    }}
  ]
}}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )
        raw = response.choices[0].message.content
        return json.loads(raw)
    except Exception as e:
        print("QUIZ ERROR:", str(e))
        return {"error": str(e)}


# ── Route 2: Generate Roadmap
@app.post("/generate-roadmap")
async def generate_roadmap(profile: UserProfile):

    level = "beginner"
    if profile.quiz_answers:
        correct = sum(1 for v in profile.quiz_answers.values() if v.get("correct", False))
        if correct >= 4:
            level = "advanced"
        elif correct >= 2:
            level = "intermediate"

    skill_list = ', '.join(profile.current_skills) if profile.current_skills else "none"
    company = profile.company if profile.company else "No specific company"

    prompt = f"""
You are a placement coach for Indian engineering students.
Return ONLY valid JSON. No explanation. No markdown. No code blocks.

Student Profile:
- Name: {profile.name}
- Branch: {profile.branch}
- Target Role: {profile.role}
- Goal: {profile.goal}
- Current Skills: {skill_list}
- Hours per week: {profile.hours_per_week}
- Assessed Level: {level}
- Target Company: {company}

{RESOURCE_GUIDE}

Roadmap Rules:
- Week 1: Fundamentals for {profile.role} + Git basics (https://learngitbranching.js.org)
- Week 2: Core technical skills specific to {profile.role}
- Week 3: Hands-on practice or project work for {profile.role}
- Week 4: Advanced technical skills for {profile.role}
- Week 5: Communication skills — professional email writing, elevator pitch, interview communication (use https://www.toastmasters.org and https://www.placementpreparation.io/verbal-ability/)
- Week 6: LinkedIn profile optimization + resume building (use https://university.linkedin.com and https://www.resumeworded.com)
- Week 7: Mock interview prep + industry-specific knowledge for {profile.role}
- Week 8: Final project polish + career planning for {profile.role}
- For any week involving DSA or algorithms, include at least 1 specific LeetCode problem link matching the week's topic
- IMPORTANT: Every single week must have a specific, descriptive theme. Never use "String" or placeholder text.

Company-specific rules:
- If TCS: include aptitude prep (https://www.placementpreparation.io/tcs-nqt/) in week 3, add verbal and logical reasoning tasks, focus on TCS NQT pattern
- If Infosys: include Infosys prep (https://www.placementpreparation.io/infosys/) in week 3, focus on coding and reasoning
- If Wipro: include Wipro prep (https://www.placementpreparation.io/wipro-wilp/) in week 3, add aptitude tasks
- If Cognizant: include Cognizant GenC prep (https://www.placementpreparation.io/cognizant-genc/) in week 3
- If Accenture: include Accenture prep (https://www.placementpreparation.io/accenture/) in week 3, focus on communication and case studies
- If Deloitte: include Deloitte prep (https://www.placementpreparation.io/deloitte/) in week 3, focus on aptitude and verbal
- If Zoho: include Zoho prep (https://www.placementpreparation.io/zoho/) in week 3, focus on strong DSA and product thinking
- If Google/Microsoft/Amazon/Flipkart: include system design (https://github.com/donnemartin/system-design-primer) from week 5, hard LeetCode problems from week 4, focus on problem solving

Branch-specific rules:
- If ECE + Embedded: include Arduino/microcontroller tasks from week 1
- If CSE + AI/ML: include Kaggle from week 3, fast.ai from week 4
- If CSE + Frontend: include freeCodeCamp from week 1
- If CSE + Backend: include system design primer from week 5
- If CSE + Data Analyst: include SQL from week 2, Pandas from week 3

Level-specific rules:
- If beginner: include more foundational tasks, slower pace
- If intermediate: skip basics, go deeper faster
- If advanced: focus on projects, system design, and advanced topics

IMPORTANT: Every resource URL must be a real working URL from the list provided above.
Each week must have exactly 5 tasks and 3 resources.

Return this exact JSON structure:
{{
  "level": "{level}",
  "weeks": [
    {{
      "week": 1,
      "theme": "string",
      "tasks": ["task1", "task2", "task3", "task4", "task5"],
      "resources": [
        {{"title": "string", "url": "string", "type": "video|article|practice"}}
      ],
      "milestone": "string"
    }}
  ]
}}

Generate exactly 8 weeks. Make each week genuinely different and specific to {profile.role} and {company}.
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=3000
        )
        raw = response.choices[0].message.content
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            retry = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "user", "content": prompt},
                    {"role": "assistant", "content": raw},
                    {"role": "user", "content": "Return ONLY the JSON object. Nothing else."}
                ],
                temperature=0.3,
                max_tokens=3000
            )
            return json.loads(retry.choices[0].message.content)
    except Exception as e:
        print("ROADMAP ERROR:", str(e))
        return {"error": str(e)}


# ── Route 3: Generate LinkedIn Bio
@app.post("/generate-linkedin")
async def generate_linkedin(profile: LinkedInProfile):
    prompt = f"""
Write a LinkedIn About section for a {profile.year} year {profile.branch} engineering student.

Name: {profile.name}
Skills: {', '.join(profile.skills)}
Projects: {', '.join(profile.projects)}
Clubs/Activities: {', '.join(profile.clubs)}

Rules:
- Exactly 3 paragraphs
- Sound human, not robotic or buzzword-heavy
- First paragraph: who they are and what they study
- Second paragraph: what they have built or done
- Third paragraph: what they are looking for
- Max 150 words total
- Do not use phrases like "passionate", "dynamic", "leverage"
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8
        )
        return {"bio": response.choices[0].message.content}
    except Exception as e:
        print("LINKEDIN ERROR:", str(e))
        return {"error": str(e)}


# ── Route 4: Generate Resume Tips
@app.post("/generate-resume")
async def generate_resume(req: ResumeRequest):
    prompt = f"""
Generate a resume summary and bullet points for a 1st year {req.branch} engineering student targeting {req.role}.

Name: {req.name}
Skills: {', '.join(req.skills)}
Projects: {', '.join(req.projects)}

Return ONLY valid JSON, no markdown:
{{
  "summary": "2 sentence professional summary",
  "skills_section": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "project_bullets": ["bullet1", "bullet2", "bullet3"],
  "tips": ["tip1", "tip2", "tip3"]
}}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print("RESUME ERROR:", str(e))
        return {"error": str(e)}


# ── Route 5: Get Roles for Branch
@app.get("/get-roles/{branch}")
def get_roles(branch: str):
    return {"roles": ROLE_MAP.get(branch, [])}


# ── Route 6: Save Progress
@app.post("/save-progress")
async def save_progress(data: dict):
    try:
        with open("progress.json", "w") as f:
            json.dump(data, f)
        return {"status": "saved"}
    except Exception as e:
        return {"error": str(e)}


# ── Route 7: Get Progress
@app.get("/get-progress")
async def get_progress():
    try:
        with open("progress.json", "r") as f:
            return json.load(f)
    except:
        return {}