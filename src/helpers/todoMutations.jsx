import { addTodo, updateTodo, deleteTodo } from '../api/todosApi';

export const addMutation = async (newTodo, todos) => {
  const added = await addTodo(newTodo)
  return [...todos, added].sort((a,b) => b.id - a.id);
}

export const addTodoOptions = (newTodo, todos) => {
  return {
    optimisticData: [...todos, newTodo]
    .sort((a,b) => b.id - a.id),
    rollbackOnError: true,
    populateCache: true,
    revalidate: false
  }
}

export const updateMutation = async (updatedTodo, todos) => {
  const updated = await updateTodo(updatedTodo)
  const updatedTodos = todos.map(todo => (todo.id === updated.id ? updated : todo));
  return updatedTodos.sort((a, b) => b.id - a.id);
}

export const deleteMutation = async (todoId, todos) => {
  await deleteTodo(todoId);
  const updatedTodos = todos.filter(todo => todo.id !== todoId);
  return updatedTodos.sort((a, b) => b.id - a.id);
};

export const updateTodoOptions = (updatedTodo) => {
  return {
      // optimistic data displays until we populate cache
      // param is previous data
      optimisticData: (todos) => {
          const prevTodos = todos.filter(todo => {
              return todo.id !== updatedTodo.id
          })
          return [...prevTodos, updatedTodo]
              .sort((a, b) => b.id - a.id)
      },
      rollbackOnError: true,
      // response from API request is 1st param
      // previous data is 2nd param
      populateCache: (updated, todos) => {
          const prevTodos = todos.filter(todo => {
              return todo.id !== updatedTodo.id
          })
          return [...prevTodos, updated]
              .sort((a, b) => b.id - a.id)
      },
      revalidate: false,
  }
}

export const deleteTodoOptions = ({ id }) => {
  return {
      // optimistic data displays until we populate cache
      // param is previous data
      optimisticData: (todos) => {
          return todos.filter(todo => {
              return todo.id !== id
          })
      },
      rollbackOnError: true,
      // response from API request is 1st param
      // previous data is 2nd param
      populateCache: (emptyResponseObj, todos) => {
          return todos.filter(todo => {
              return todo.id !== id
          })
      },
      revalidate: false,
  }
}