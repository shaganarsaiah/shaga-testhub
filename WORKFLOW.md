# SHAGA TestHub Repository Workflow

This document describes the standard procedure for adding a new repository (topic) to SHAGA TestHub.

---

## 1. Create the Repository

Create the topic JSON file.

Example:

```
question-bank/
└── subjects/
    └── educational-psychology/
        └── memory.json
```

or

```
question-bank/
└── subjects/
    └── educational-philosophy/
        └── naturalism.json
```

---

## 2. Import the Repository

Open:

```
repository/repository-loader.js
```

Add the import.

Example:

```javascript
import memory from "../question-bank/subjects/educational-psychology/memory.json" with { type: "json" };
```

---

## 3. Register the Repository

Inside

```javascript
this.questionBanks.push(
    growthDevelopment,
    learning,
    memory,
    idealism
);
```

Add the new repository.

Example:

```javascript
this.questionBanks.push(
    growthDevelopment,
    learning,
    memory,
    motivation,
    idealism,
    naturalism
);
```

---

## 4. Configure Test

Open:

```
build/test-config.json
```

Example:

```json
{
  "subjects": [
    "Educational Psychology"
  ],
  "topic": "Memory",
  "questionCount": 100,
  "difficulty": "Mixed",
  "language": "English",
  "time": 150
}
```

---

## 5. Build

Run

```bash
node build/build-test.js
```

Verify

- Repository loaded
- Topic appears
- Final Questions = Expected Count

---

## 6. Run CBT

```bash
node server.js
```

Open

```
http://localhost:3000
```

Verify

- Correct topic
- Correct question count
- Correct answers
- No console errors

---

## 7. Commit

```bash
git add .
git commit -m "Added <Topic> repository with 100 Dy.E.O questions"
git push
```

---

# Standard Workflow

1. Create topic.json
2. Import repository
3. Register repository
4. Configure test-config.json
5. Run build-test.js
6. Run server.js
7. Verify CBT
8. Commit
9. Push

---

# Repository Checklist

- JSON is valid
- Metadata is correct
- Topic name matches test-config exactly
- Repository imported
- Repository registered
- 100 questions available
- Tested successfully
- Committed to GitHub

---

**Project:** SHAGA TestHub

**Maintainer:** Shaga Narsaiah