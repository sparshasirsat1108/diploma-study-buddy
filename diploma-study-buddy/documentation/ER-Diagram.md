# ER Diagram – Diploma Study Buddy

```text
BRANCH 1 ─────── N SUBJECT 1 ─────── N CHAPTER
                       │                 │
                       ├── N NOTES      │
                       ├── N VIDEOS     │
                       └── N QUIZ 1 ─ N QUESTIONS

USER 1 ─────── N DOUBTS
USER 1 ─────── N PROGRESS N ─────── 1 CHAPTER
USER 1 ─────── N FEEDBACK
USER 1 ─────── N NOTIFICATIONS
```

## Primary keys
- users.id
- branches.id
- semesters.id
- subjects.id
- chapters.id
- notes.id
- videos.id
- quizzes.id
- questions.id
- progress.id
- doubts.id
- feedback.id
- notifications.id

## Important foreign keys
- subjects.branch_id → branches.id
- subjects.semester → semesters.number
- chapters.subject_id → subjects.id
- notes.subject_id → subjects.id
- videos.subject_id → subjects.id
- quizzes.subject_id → subjects.id
- questions.quiz_id → quizzes.id
- progress.user_id → users.id
- progress.chapter_id → chapters.id
- doubts.user_id → users.id
- feedback.user_id → users.id
