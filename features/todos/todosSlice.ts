import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type Id = string;
export type Status = "todo" | "doing" | "done";

export type Todo = {
  _id: Id;
  title: string;
  description?: string;
  status: Status;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data as T;
}

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const data = await api<{ items: Todo[] }>("/api/todos");
  return data.items as any as Todo[];
});

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (body: { title: string; description?: string; status?: Status; order?: number }) => {
    await api<{ ok: true; id: Id }>("/api/todos", { method: "POST", body: JSON.stringify(body) });
    return true;
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, updates }: { id: Id; updates: Partial<Omit<Todo, "_id">> }) => {
    const data = await api<{ item: Todo }>(`/api/todos/${id}`, { method: "PUT", body: JSON.stringify(updates) });
    return data.item;
  }
);

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id: Id) => {
  await api<{ ok: true }>(`/api/todos/${id}`, { method: "DELETE" });
  return id;
});

export const persistBoard = createAsyncThunk(
  "todos/persistBoard",
  async (columns: Array<{ id: Status; items: Array<{ id: Id }> }>, { dispatch }) => {
    await Promise.all(
      columns.flatMap((col) =>
        col.items.map((item, idx) =>
          api(`/api/todos/${item.id}`, { method: "PUT", body: JSON.stringify({ status: col.id, order: idx }) })
        )
      )
    );
    // Refresh list after batch update
    await (dispatch as any)(fetchTodos());
    return true;
  }
);

interface TodosState {
  loading: boolean;
  error: string | null;
  items: Todo[];
}

const initialState: TodosState = {
  loading: false,
  error: null,
  items: [],
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const start = (s: TodosState) => {
      s.loading = true;
      s.error = null;
    };
    const fail = (s: TodosState, a: any) => {
      s.loading = false;
      s.error = a?.error?.message || (a.payload as any)?.message || "Request failed";
    };
    builder
      .addCase(fetchTodos.pending, start)
      .addCase(fetchTodos.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchTodos.rejected, fail)
      .addCase(createTodo.pending, start)
      .addCase(createTodo.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(createTodo.rejected, fail)
      .addCase(updateTodo.pending, start)
      .addCase(updateTodo.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.items.findIndex((t) => String(t._id) === String(a.payload._id));
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(updateTodo.rejected, fail)
      .addCase(deleteTodo.pending, start)
      .addCase(deleteTodo.fulfilled, (s, a) => {
        s.loading = false;
        s.items = s.items.filter((t) => String(t._id) !== String(a.payload));
      })
      .addCase(deleteTodo.rejected, fail)
      .addCase(persistBoard.pending, start)
      .addCase(persistBoard.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(persistBoard.rejected, fail);
  },
});

export default todosSlice.reducer;
