# DFD – Diploma Study Buddy

## Level 0
```text
Student ──> Diploma Study Buddy ──> MySQL Database
Admin   ──> Diploma Study Buddy ──> MySQL Database
```

## Level 1
```text
Student
  │
  ├── Login / Signup ───────> Users
  ├── Select Branch/Sem ────> Subjects
  ├── Study Chapter ────────> Chapters
  ├── View Notes ───────────> Notes
  ├── Take Quiz ────────────> Quizzes / Questions
  ├── Mark Progress ────────> Progress
  ├── Ask Doubt ────────────> Doubts
  └── Give Feedback ────────> Feedback

Admin
  └── Add Subject ──────────> Subjects
```
