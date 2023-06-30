const mapping: Record<string, string> = {
  'course-contents': 'course_content',
  exercises: 'exercise',
  quizzes: 'quiz',
  trainers: 'trainer',
  'use-cases': 'use_case',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
