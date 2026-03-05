export interface LessonStep {
  text?: string;
  command?: string;
  action?: string;
  interactive?: boolean;
  auto_commands?: string[];
}

export interface Lesson {
  title: string;
  steps: LessonStep[];
}

export async function loadLesson(n: number): Promise<Lesson> {
  const res = await fetch(`/lessons/lesson_${n}.json`);
  if (!res.ok) throw new Error(`Lesson ${n} not found`);
  return res.json();
}
