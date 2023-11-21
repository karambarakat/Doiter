export type ITodo = { name: string; completed: boolean; id: string };

export function getAllTodos() {
  return [
    {
      id: "1",
      name: "hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world",
      completed: true,
    },
    { id: "2", name: "hello world", completed: true },
    { id: "3", name: "hello world", completed: false },
    { id: "4", name: "hello world", completed: true },
  ] as ITodo[];
}

export function createTodo(data: Omit<ITodo, "id">) {
  return data;
}

export function updateTodo(id: string, data: Omit<ITodo, "id">) {
  return data;
}

export function deleteTodo(id: string) {
  return id;
}
