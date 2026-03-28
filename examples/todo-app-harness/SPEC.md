# TaskFlow — Smart Todo Application

## Overview

TaskFlow is a browser-based task management application that combines clean,
opinionated design with AI-assisted task organization. It goes beyond basic
todo lists by offering smart categorization, natural language due dates, and
a focus mode that surfaces the most important work.

## Target Audience

Individual professionals and students who want a fast, keyboard-driven task
manager without the overhead of full project management tools.

## Tech Stack

React + Vite frontend, FastAPI backend, SQLite database.

## Visual Design Language

Minimal, monochrome base with a single accent color (configurable). Dense
information display with generous whitespace. Keyboard-first interaction
model. Dark mode default with light mode toggle. Typography: system font
stack, no custom fonts — speed over personality.

## Core Modules

- **Task Engine** — CRUD operations, state management, persistence
- **Smart Input** — Natural language parsing for dates and categories
- **Focus Mode** — Priority-based task surfacing with timer
- **AI Assistant** — Claude-powered task breakdown and suggestions

## Features

### Task Management
- **Quick add** — As a user, I want to add tasks with a single keyboard shortcut (/) and natural language input ("Buy groceries tomorrow at 5pm")
- **Categories** — As a user, I want to organize tasks into color-coded categories that persist across sessions
- **Due dates** — As a user, I want to set due dates using natural language ("next Friday", "in 3 days") parsed automatically
- **Priority levels** — As a user, I want to mark tasks as high/medium/low priority with visual indicators

### Focus Mode
- **Priority queue** — As a user, I want a focus view that shows only my highest-priority tasks for today
- **Pomodoro timer** — As a user, I want a built-in timer (25/5 min cycles) that tracks time spent per task
- **Completion streak** — As a user, I want to see my daily completion streak to stay motivated

### AI-Assisted Features
- **Task breakdown** — As a user, I want to describe a complex task and have AI break it into subtasks
- **Smart categorization** — As a user, I want new tasks automatically categorized based on content

### Settings & Data
- **Theme toggle** — As a user, I want to switch between dark and light mode
- **Data export** — As a user, I want to export all my tasks as JSON for backup

## Data Model

- **Task** — title, description, category, priority, due_date, completed, created_at
- **Category** — name, color, icon
- **FocusSession** — task_id, start_time, duration, completed
