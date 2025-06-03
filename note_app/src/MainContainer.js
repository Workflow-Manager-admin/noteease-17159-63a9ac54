import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * The main container for the NoteEase app. Handles displaying, creating,
 * editing, deleting, searching, and categorizing notes using a local state.
 * Light theme, primary color: #4A90E2, secondary: #FFFFFF, accent: #F5A623.
 */
function MainContainer() {
  // Note structure: { id, title, content, category }
  const [notes, setNotes] = useState([
    // Example seed
    {
      id: 1,
      title: "Welcome to NoteEase",
      content: "This is your first note. Edit or delete me!",
      category: "General",
    },
  ]);
  // Modal state for creating/editing
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNote, setModalNote] = useState(null);
  // State for search
  const [search, setSearch] = useState("");
  // State for category filter
  const [categories] = useState([
    "All",
    "General",
    "Work",
    "Personal",
    "Ideas",
    "ToDo",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filtered notes based on search and category
  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      selectedCategory === "All" || note.category === selectedCategory;
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // PUBLIC_INTERFACE
  // Open modal to create a new note
  function handleAddNote() {
    setModalNote({ id: null, title: "", content: "", category: "General" });
    setModalOpen(true);
  }

  // PUBLIC_INTERFACE
  // Open modal to edit a note
  function handleEditNote(note) {
    setModalNote({ ...note });
    setModalOpen(true);
  }

  // PUBLIC_INTERFACE
  // Save new or edited note
  function handleModalSave(note) {
    if (note.id) {
      // Edit
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? note : n))
      );
    } else {
      // Create
      const nextId = notes.length
        ? Math.max(...notes.map((n) => n.id)) + 1
        : 1;
      setNotes((prev) => [
        ...prev,
        { ...note, id: nextId }
      ]);
    }
    setModalOpen(false);
    setModalNote(null);
  }

  // PUBLIC_INTERFACE
  // Delete note
  function handleDeleteNote(id) {
    if (window.confirm("Delete this note?")) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  }

  // PUBLIC_INTERFACE
  // Modal component (inline)
  function NoteModal({ note, open, onSave, onCancel, categories }) {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [category, setCategory] = useState(note.category || "General");
    if (!open) return null;
    return (
      <div style={modalOverlayStyle}>
        <form
          style={modalStyle}
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim().length === 0) return;
            onSave({ ...note, title, content, category });
          }}
        >
          <h2 style={{ margin: 0, color: "#4A90E2" }}>
            {note.id ? "Edit Note" : "New Note"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            style={inputStyle}
            maxLength={64}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <textarea
            placeholder="Write your note here..."
            value={content}
            style={textareaStyle}
            rows={7}
            onChange={(e) => setContent(e.target.value)}
          />
          <select
            style={selectStyle}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories
              .filter((c) => c !== "All")
              .map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
          </select>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                ...modalButtonStyle,
                background: "#CCCCCC",
                color: "#333",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...modalButtonStyle,
                background: "#4A90E2",
                color: "#FFF",
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  // Main UI render
  return (
    <div style={rootStyle}>
      {/* Sidebar for categories */}
      <aside style={sidebarStyle}>
        <h3 style={{ marginTop: 0, color: "#4A90E2", fontWeight: 600 }}>
          Categories
        </h3>
        <ul style={categoryListStyle}>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                style={{
                  ...categoryButtonStyle,
                  background:
                    selectedCategory === cat ? "#4A90E211" : "transparent",
                  color: selectedCategory === cat ? "#4A90E2" : "#333",
                  fontWeight: selectedCategory === cat ? 600 : 400,
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main content */}
      <div style={mainContentStyle}>
        {/* Search bar */}
        <div style={searchBarStyle}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            aria-label="Search notes"
            style={searchInputStyle}
          />
        </div>
        {/* Notes List */}
        <div style={notesListStyle}>
          {filteredNotes.length === 0 ? (
            <div style={{ color: "#888", textAlign: "center", marginTop: 48 }}>
              No notes found.
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                style={noteCardStyle}
                onClick={() => handleEditNote(note)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditNote(note);
                }}
              >
                <div style={noteTitleRowStyle}>
                  <span style={{ fontWeight: 600 }}>{note.title}</span>
                  <span style={noteCategoryBadgeStyle(note.category)}>
                    {note.category}
                  </span>
                </div>
                <div style={{ color: "#555", fontSize: 15 }}>
                  {note.content.length > 72
                    ? note.content.slice(0, 72) + "…"
                    : note.content}
                </div>
                <button
                  style={deleteButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                  aria-label="Delete note"
                  tabIndex={-1}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
        {/* Floating Add Button */}
        <button
          style={fabStyle}
          onClick={handleAddNote}
          aria-label="Add note"
          title="Add note"
        >
          +
        </button>
      </div>
      {/* Note Modal */}
      <NoteModal
        open={modalOpen}
        note={modalNote || { id: null, title: "", content: "", category: "General" }}
        onSave={handleModalSave}
        onCancel={() => {
          setModalOpen(false);
          setModalNote(null);
        }}
        categories={categories}
      />
    </div>
  );
}

/**
 * === Styles (inline for this single file component) ===
 * Ideally, these would be moved to CSS for large projects.
 */
const rootStyle = {
  display: "flex",
  minHeight: "100vh",
  background: "#F6F7FB",
  fontFamily:
    "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif"
};
const sidebarStyle = {
  width: 170,
  background: "#FFF",
  borderRight: "1px solid #E3E8F0",
  padding: "36px 16px 12px 20px",
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};
const categoryListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 4,
};
const categoryButtonStyle = {
  width: "100%",
  padding: "8px 0",
  border: "none",
  background: "none",
  cursor: "pointer",
  borderRadius: 6,
  textAlign: "left",
  outline: "none",
  fontSize: 16,
  transition: "background 0.12s",
};
const mainContentStyle = {
  flex: 1,
  padding: "40px 0 0 0",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};
const searchBarStyle = {
  background: "#FFF",
  padding: "24px 32px 12px 32px",
  borderBottom: "1px solid #EEF1F7",
  position: "sticky",
  top: 0,
  zIndex: 10,
};
const searchInputStyle = {
  width: "100%",
  maxWidth: 480,
  fontSize: 16,
  padding: "10px 16px",
  border: "1px solid #DADCE0",
  borderRadius: 8,
  outline: "none",
  background: "#F9FAFB",
};
const notesListStyle = {
  padding: "30px 26px 60px 26px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gridGap: "24px",
};
const noteCardStyle = {
  boxShadow: "0 2px 8px #D7E7FB33",
  background: "#FFF",
  borderRadius: 10,
  padding: "16px 18px 36px 16px",
  cursor: "pointer",
  border: "1.5px solid #E4E8F1",
  minHeight: 72,
  position: "relative",
  transition: "box-shadow 0.14s, border-color 0.14s",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};
const deleteButtonStyle = {
  position: "absolute",
  right: 8,
  top: 9,
  background: "#F5A62322",
  border: "none",
  borderRadius: 7,
  color: "#F5A623",
  padding: "3px 8px",
  cursor: "pointer",
  fontSize: 16,
  transition: "background 0.12s",
};
const noteCategoryBadgeStyle = (cat) => ({
  fontWeight: 500,
  background: cat === "ToDo" ? "#4A90E217" : "#F5A62319",
  color: "#4A90E2",
  fontSize: 13,
  borderRadius: 6,
  padding: "3px 11px",
  marginLeft: 8,
  alignSelf: "center",
  display: "inline-block"
});
const noteTitleRowStyle = {
  fontSize: 17,
  marginBottom: 5,
  display: "flex",
  alignItems: "center"
};
const fabStyle = {
  position: "fixed",
  right: 42,
  bottom: 34,
  background:
    "linear-gradient(90deg, #4A90E2 70%, #F5A623 140%)",
  color: "#FFF",
  border: "none",
  boxShadow: "0 4px 15px #3785d133",
  borderRadius: "50%",
  width: 56,
  height: 56,
  fontSize: 34,
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 111,
  transition: "box-shadow 0.13s, background 0.13s",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.20)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle = {
  background: "#FFF",
  borderRadius: 12,
  padding: "28px 28px 22px 28px",
  minWidth: 360,
  maxWidth: "97vw",
  boxShadow: "0 8px 40px #4A90E220",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const inputStyle = {
  padding: "8px 12px",
  fontSize: 15,
  borderRadius: 7,
  border: "1px solid #E3E6EE",
  background: "#FAFAFC",
  marginTop: 9,
};

const textareaStyle = {
  padding: "9px 12px",
  fontSize: 15,
  borderRadius: 5,
  border: "1px solid #E3E6EE",
  background: "#F9FAFC",
  marginTop: 7,
  resize: "vertical",
};

const selectStyle = {
  padding: "8px 10px",
  fontSize: 15,
  borderRadius: 7,
  border: "1px solid #E3E6EE",
  background: "#F9FAFC",
  marginTop: 7,
  width: 148,
};

const modalButtonStyle = {
  padding: "8px 20px",
  borderRadius: 8,
  border: "none",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

export default MainContainer;
