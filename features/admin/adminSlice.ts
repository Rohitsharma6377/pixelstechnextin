import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Id = string;

export type Contact = {
  _id: Id;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "NEW" | "READ" | "ARCHIVED";
  createdAt: string;
};

export type TeamMember = {
  _id: Id;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string | null;
  socials?: { twitter?: string; linkedin?: string; github?: string; instagram?: string; website?: string };
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Testimonial = {
  _id: Id;
  name: string;
  company?: string;
  message: string;
  rating?: number;
  avatarUrl?: string | null;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Project = {
  _id: Id;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
  tags?: string[];
  url?: string;
  repoUrl?: string;
  featured?: boolean;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Blog = {
  _id: Id;
  title: string;
  slug: string;
  imageUrl?: string | null;
  category?: string | null;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  authorId?: Id;
  shortDescription?: string | null;
  longDescription?: string | null;
  published?: boolean;
  createdAt?: string;
};

export type Author = {
  _id: Id;
  name: string;
  designation?: string;
  bio?: string;
  imageUrl?: string | null;
};

async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data as T;
}

export const fetchContacts = createAsyncThunk("admin/fetchContacts", async () => {
  const data = await api<{ items: Contact[] }>("/api/contact");
  return data.items;
});

export const fetchTeam = createAsyncThunk("admin/fetchTeam", async () => {
  const data = await api<{ items: TeamMember[] }>("/api/team");
  return data.items;
});

export const createTeam = createAsyncThunk("admin/createTeam", async (body: Omit<TeamMember, "_id">) => {
  const data = await api<{ ok: true; id: Id }>("/api/team", { method: "POST", body: JSON.stringify(body) });
  return data.id;
});

export const deleteTeam = createAsyncThunk("admin/deleteTeam", async (id: Id) => {
  await api<{ ok: true }>(`/api/team/${id}`, { method: "DELETE" });
  return id;
});

export const updateTeam = createAsyncThunk(
  "admin/updateTeam",
  async ({ id, updates }: { id: Id; updates: Partial<TeamMember> }) => {
    const data = await api<{ item: TeamMember }>(`/api/team/${id}`, { method: "PUT", body: JSON.stringify(updates) });
    return data.item;
  }
);

export const fetchProjects = createAsyncThunk("admin/fetchProjects", async () => {
  const data = await api<{ items: Project[] }>("/api/projects");
  return data.items;
});

export const createProject = createAsyncThunk("admin/createProject", async (body: Partial<Project> & { title: string }) => {
  const data = await api<{ ok: true; id: Id; slug: string }>("/api/projects", { method: "POST", body: JSON.stringify(body) });
  return data.id;
});

export const deleteProject = createAsyncThunk("admin/deleteProject", async (id: Id) => {
  await api<{ ok: true }>(`/api/projects/${id}`, { method: "DELETE" });
  return id;
});

export const updateProject = createAsyncThunk(
  "admin/updateProject",
  async ({ id, updates }: { id: Id; updates: Partial<Project> }) => {
    const data = await api<{ item: Project }>(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(updates) });
    return data.item;
  }
);

export const fetchTestimonials = createAsyncThunk("admin/fetchTestimonials", async () => {
  const data = await api<{ items: Testimonial[] }>("/api/testimonials");
  return data.items;
});

export const createTestimonial = createAsyncThunk("admin/createTestimonial", async (body: Omit<Testimonial, "_id">) => {
  const data = await api<{ ok: true; id: Id }>("/api/testimonials", { method: "POST", body: JSON.stringify(body) });
  return data.id;
});

export const deleteTestimonial = createAsyncThunk("admin/deleteTestimonial", async (id: Id) => {
  await api<{ ok: true }>(`/api/testimonials/${id}`, { method: "DELETE" });
  return id;
});

export const updateTestimonial = createAsyncThunk(
  "admin/updateTestimonial",
  async ({ id, updates }: { id: Id; updates: Partial<Omit<Testimonial, "_id">> }) => {
    const data = await api<{ item: Testimonial }>(`/api/testimonials/${id}`, { method: "PUT", body: JSON.stringify(updates) });
    return data.item;
  }
);

export const fetchBlogs = createAsyncThunk("admin/fetchBlogs", async () => {
  const data = await api<{ posts: Blog[] }>("/api/blog");
  return data.posts;
});

export const createBlog = createAsyncThunk(
  "admin/createBlog",
  async (body: { title: string; content: string; imageUrl?: string | null; tags?: string[]; category?: string; metaTitle?: string; metaDescription?: string; metaKeywords?: string[]; authorId?: Id; shortDescription?: string; longDescription?: string }) => {
    const data = await api<{ ok: true; id: Id; slug: string }>("/api/blog", { method: "POST", body: JSON.stringify(body) });
    return data.id;
  }
);

export const updateBlog = createAsyncThunk(
  "admin/updateBlog",
  async ({ slug, updates }: { slug: string; updates: Partial<{
    title: string; content: string; imageUrl?: string | null; tags?: string[]; category?: string; metaTitle?: string; metaDescription?: string; metaKeywords?: string[]; authorId?: Id; shortDescription?: string; longDescription?: string; published?: boolean
  }> }) => {
    const data = await api<{ ok: true }>(`/api/blog/${slug}`, { method: "PUT", body: JSON.stringify(updates) });
    return { slug };
  }
);

// Authors
export const fetchAuthors = createAsyncThunk("admin/fetchAuthors", async () => {
  const data = await api<{ items: Author[] }>("/api/authors");
  return data.items;
});

export const createAuthor = createAsyncThunk("admin/createAuthor", async (body: Omit<Author, "_id">) => {
  const data = await api<{ ok: true; id: Id }>("/api/authors", { method: "POST", body: JSON.stringify(body) });
  return data.id;
});

export const updateAuthor = createAsyncThunk(
  "admin/updateAuthor",
  async ({ id, updates }: { id: Id; updates: Partial<Omit<Author, "_id">> }) => {
    const data = await api<{ item: Author }>(`/api/authors/${id}`, { method: "PUT", body: JSON.stringify(updates) });
    return data.item;
  }
);

export const deleteAuthor = createAsyncThunk("admin/deleteAuthor", async (id: Id) => {
  await api<{ ok: true }>(`/api/authors/${id}`, { method: "DELETE" });
  return id;
});

interface AdminState {
  loading: boolean;
  error: string | null;
  contacts: Contact[];
  team: TeamMember[];
  projects: Project[];
  testimonials: Testimonial[];
  blogs: Blog[];
  authors: Author[];
}

const initialState: AdminState = {
  loading: false,
  error: null,
  contacts: [],
  team: [],
  projects: [],
  testimonials: [],
  blogs: [],
  authors: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const start = (s: AdminState) => {
      s.loading = true;
      s.error = null;
    };
    const fail = (s: AdminState, a: any) => {
      s.loading = false;
      s.error = a?.error?.message || (a.payload as any)?.message || "Request failed";
    };
    builder
      .addCase(fetchContacts.pending, start)
      .addCase(fetchContacts.fulfilled, (s, a) => {
        s.loading = false;
        s.contacts = a.payload;
      })
      .addCase(fetchContacts.rejected, fail)
      .addCase(fetchTeam.pending, start)
      .addCase(fetchTeam.fulfilled, (s, a) => {
        s.loading = false;
        s.team = a.payload;
      })
      .addCase(fetchTeam.rejected, fail)
      .addCase(createTeam.pending, start)
      .addCase(createTeam.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(createTeam.rejected, fail)
      .addCase(deleteTeam.pending, start)
      .addCase(deleteTeam.fulfilled, (s, a) => {
        s.loading = false;
        s.team = s.team.filter((m) => String(m._id) !== String(a.payload));
      })
      .addCase(deleteTeam.rejected, fail)
      .addCase(updateTeam.pending, start)
      .addCase(updateTeam.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.team.findIndex((m) => String(m._id) === String(a.payload._id));
        if (idx !== -1) s.team[idx] = a.payload as any;
      })
      .addCase(updateTeam.rejected, fail)
      .addCase(fetchProjects.pending, start)
      .addCase(fetchProjects.fulfilled, (s, a) => {
        s.loading = false;
        s.projects = a.payload;
      })
      .addCase(fetchProjects.rejected, fail)
      .addCase(createProject.pending, start)
      .addCase(createProject.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(createProject.rejected, fail)
      .addCase(deleteProject.pending, start)
      .addCase(deleteProject.fulfilled, (s, a) => {
        s.loading = false;
        s.projects = s.projects.filter((p) => String(p._id) !== String(a.payload));
      })
      .addCase(deleteProject.rejected, fail)
      .addCase(updateProject.pending, start)
      .addCase(updateProject.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.projects.findIndex((p) => String(p._id) === String(a.payload._id));
        if (idx !== -1) s.projects[idx] = a.payload as any;
      })
      .addCase(updateProject.rejected, fail)
      .addCase(fetchTestimonials.pending, start)
      .addCase(fetchTestimonials.fulfilled, (s, a) => {
        s.loading = false;
        s.testimonials = a.payload;
      })
      .addCase(fetchTestimonials.rejected, fail)
      .addCase(createTestimonial.pending, start)
      .addCase(createTestimonial.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(createTestimonial.rejected, fail)
      .addCase(deleteTestimonial.pending, start)
      .addCase(deleteTestimonial.fulfilled, (s, a) => {
        s.loading = false;
        s.testimonials = s.testimonials.filter((t) => String(t._id) !== String(a.payload));
      })
      .addCase(deleteTestimonial.rejected, fail)
      .addCase(updateTestimonial.pending, start)
      .addCase(updateTestimonial.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.testimonials.findIndex((t) => String(t._id) === String(a.payload._id));
        if (idx !== -1) s.testimonials[idx] = a.payload as any;
      })
      .addCase(updateTestimonial.rejected, fail)
      .addCase(fetchBlogs.pending, start)
      .addCase(fetchBlogs.fulfilled, (s, a) => {
        s.loading = false;
        s.blogs = a.payload;
      })
      .addCase(fetchBlogs.rejected, fail)
      .addCase(createBlog.pending, start)
      .addCase(createBlog.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(createBlog.rejected, fail)
      .addCase(updateBlog.pending, start)
      .addCase(updateBlog.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(updateBlog.rejected, fail)
      .addCase(fetchAuthors.pending, start)
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.loading = false;
        s.authors = a.payload;
      })
      .addCase(fetchAuthors.rejected, fail)
      .addCase(createAuthor.pending, start)
      .addCase(createAuthor.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(createAuthor.rejected, fail)
      .addCase(updateAuthor.pending, start)
      .addCase(updateAuthor.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.authors.findIndex((x) => String(x._id) === String(a.payload._id));
        if (idx !== -1) s.authors[idx] = a.payload as any;
      })
      .addCase(updateAuthor.rejected, fail)
      .addCase(deleteAuthor.pending, start)
      .addCase(deleteAuthor.fulfilled, (s, a) => {
        s.loading = false;
        s.authors = s.authors.filter((x) => String(x._id) !== String(a.payload));
      })
      .addCase(deleteAuthor.rejected, fail);
  },
});

export default adminSlice.reducer;
