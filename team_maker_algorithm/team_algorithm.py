import json
import numpy as np
import random
from typing import List, Dict

# ---------------------- 1. JSON 불러오기 ----------------------
def load_students_from_json(file_path: str) -> (List[Dict], int):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data['students'], data['studentsPerTeam']

# ---------------------- 2. MBTI 벡터화 ----------------------
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

# ---------------------- 3. 다양성 점수 ----------------------
def mbti_vector_diversity(team: List[Dict]) -> float:
    if not team:
        return 0.0
    vectors = np.array([mbti_to_vector(s['mbti']) for s in team])
    team_mean = np.mean(vectors, axis=0)
    diversity_scores = 1 - np.abs(team_mean - 0.5) * 2
    return float(np.sum(diversity_scores))  # 최대 4.0

# ---------------------- 4. 협동 성향 점수 ----------------------
def cooperation_score(team: List[Dict]) -> int:
    return sum((1 if m['mbti'][0] == 'I' else 0) + (1 if m['mbti'][3] == 'P' else 0) for m in team)

# ---------------------- 5. 혼합 점수 ----------------------
def final_team_score(team: List[Dict], alpha=1.0, beta=0.3) -> float:
    return alpha * mbti_vector_diversity(team) + beta * cooperation_score(team)

# ---------------------- 6. 유전 알고리즘 ----------------------
def initialize_population(students: List[Dict], team_size: int, pop_size: int) -> List[List[List[Dict]]]:
    population = []
    for _ in range(pop_size):
        shuffled = students[:]
        random.shuffle(shuffled)
        teams = [shuffled[i:i+team_size] for i in range(0, len(shuffled), team_size)]
        population.append(teams)
    return population

def fitness(teams: List[List[Dict]]) -> float:
    return sum(final_team_score(team) for team in teams)

def selection(population: List[List[List[Dict]]], num_parents: int) -> List[List[List[Dict]]]:
    return sorted(population, key=lambda p: -fitness(p))[:num_parents]

def crossover(parent1: List[List[Dict]], parent2: List[List[Dict]]) -> List[List[Dict]]:
    all_students = {s['studentName']: s for team in parent1 + parent2 for s in team}.values()
    shuffled = list(all_students)
    random.shuffle(shuffled)
    team_size = len(parent1[0])
    return [shuffled[i:i+team_size] for i in range(0, len(shuffled), team_size)]

def mutate(teams: List[List[Dict]], mutation_rate=0.1):
    if random.random() < mutation_rate:
        flat = [s for team in teams for s in team]
        i1, i2 = random.sample(range(len(flat)), 2)
        flat[i1], flat[i2] = flat[i2], flat[i1]
        team_size = len(teams[0])
        return [flat[i:i+team_size] for i in range(0, len(flat), team_size)]
    return teams

def genetic_algorithm(students: List[Dict], team_size: int, generations=100, pop_size=30, alpha=1.0, beta=0.3, epsilon=1e-4):
    population = initialize_population(students, team_size, pop_size)
    prev_best_score = None

    for gen in range(generations):
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
        print(f"[{gen+1}세대] 최고 점수: {current_score:.4f}")

        if prev_best_score is not None and abs(current_score - prev_best_score) < epsilon:
            print(f"\n✅ 수렴 조건(ε={epsilon}) 만족: {gen+1}세대에서 조기 종료되었습니다.")
            break
        prev_best_score = current_score

    else:
        print(f"\n🔁 최대 세대({generations}) 도달. 종료됨.")

    return max(population, key=fitness)

# ---------------------- 7. 실행 ----------------------
if __name__ == '__main__':
    file_path = './example.json'
    students, students_per_team = load_students_from_json(file_path)
    best_teams = genetic_algorithm(students, students_per_team)

    print("\n========== 유전 알고리즘 팀 구성 결과 ==========\n")
    for i, team in enumerate(best_teams):
        print(f"[Team {i+1}]")
        for member in team:
            print(f"  - {member['studentName']} ({member['mbti']} / {member['role_type']})")
        d_score = mbti_vector_diversity(team)
        c_score = cooperation_score(team)
        print(f"  다양성 점수 = {d_score:.2f}, 협동 성향 점수 = {c_score}\n")