from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Literal
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import random

# ---------------------- 모델 정의 ----------------------

class Student(BaseModel):
    studentName: str
    mbti: str
    role_type: Literal["LEADER", "FOLLOWER", "FLEXIBLE"]

class TeamRequest(BaseModel):
    groupCode: str
    studentsPerTeam: int
    totalStudents: int
    courseName: str
    students: List[Student]

# ---------------------- FastAPI 기본 설정 ----------------------

app = FastAPI()

# CORS 설정 (React 등 외부 접근 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 필요 시 도메인 제한 가능
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------- 알고리즘 함수 ----------------------

mbti_cache = {}
def mbti_to_vector(mbti: str) -> np.ndarray:
    if mbti not in mbti_cache:
        mbti_cache[mbti] = np.array([
            1 if mbti[0] == 'E' else 0,
            1 if mbti[1] == 'S' else 0,
            1 if mbti[2] == 'T' else 0,
            1 if mbti[3] == 'J' else 0
        ])
    return mbti_cache[mbti]

def mbti_vector_diversity(team: List[dict]) -> float:
    if not team:
        return 0.0
    vectors = np.array([mbti_to_vector(s['mbti']) for s in team])
    team_mean = np.mean(vectors, axis=0)
    diversity_scores = 1 - np.abs(team_mean - 0.5) * 2
    return float(np.sum(diversity_scores))

def cooperation_score(team: List[dict]) -> int:
    return sum((1 if m['mbti'][0] == 'I' else 0) + (1 if m['mbti'][3] == 'P' else 0) for m in team)

def final_team_score(team: List[dict], alpha=1.0, beta=0.3) -> float:
    return alpha * mbti_vector_diversity(team) + beta * cooperation_score(team)

def initialize_population(students: List[dict], team_size: int, pop_size: int) -> List[List[List[dict]]]:
    population = []
    for _ in range(pop_size):
        shuffled = students[:]
        random.shuffle(shuffled)
        teams = [shuffled[i:i+team_size] for i in range(0, len(shuffled), team_size)]
        population.append(teams)
    return population

def fitness(teams: List[List[dict]]) -> float:
    return sum(final_team_score(team) for team in teams)

def selection(population: List[List[List[dict]]], num_parents: int) -> List[List[List[dict]]]:
    return sorted(population, key=lambda p: -fitness(p))[:num_parents]

def crossover(parent1: List[List[dict]], parent2: List[List[dict]]) -> List[List[dict]]:
    all_students = {s['studentName']: s for team in parent1 + parent2 for s in team}.values()
    shuffled = list(all_students)
    random.shuffle(shuffled)
    team_size = len(parent1[0])
    return [shuffled[i:i+team_size] for i in range(0, len(shuffled), team_size)]

def mutate(teams: List[List[dict]], mutation_rate=0.1):
    if random.random() < mutation_rate:
        flat = [s for team in teams for s in team]
        i1, i2 = random.sample(range(len(flat)), 2)
        flat[i1], flat[i2] = flat[i2], flat[i1]
        team_size = len(teams[0])
        return [flat[i:i+team_size] for i in range(0, len(flat), team_size)]
    return teams

def genetic_algorithm(students: List[dict], team_size: int, generations=100, pop_size=30, alpha=1.0, beta=0.3, epsilon=1e-4):
    population = initialize_population(students, team_size, pop_size)
    prev_best_score = None

    for _ in range(generations):
        parents = selection(population, pop_size // 2)
        children = []
        while len(children) < pop_size:
            p1, p2 = random.sample(parents, 2)
            child = crossover(p1, p2)
            child = mutate(child)
            children.append(child)
        population = children

        current_best = max(population, key=fitness)
        current_score = fitness(current_best)

        if prev_best_score is not None and abs(current_score - prev_best_score) < epsilon:
            break
        prev_best_score = current_score

    return max(population, key=fitness)

# ---------------------- API 엔드포인트 ----------------------

@app.post("/cluster/make-teams")
def make_teams(request: TeamRequest):
    students = [s.dict() for s in request.students]
    team_size = request.studentsPerTeam

    best_teams = genetic_algorithm(students, team_size)

    return {
        "groupCode": request.groupCode,
        "teams": best_teams
    }
