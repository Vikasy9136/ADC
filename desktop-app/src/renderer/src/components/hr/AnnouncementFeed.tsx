import React from "react";

// Add explicit item type
export interface Announcement {
  id: string | number;
  title: string;
  date: string;
}

interface Props {
  data?: Announcement[];
}

export default function AnnouncementFeed({ data = [] }: Props) {
  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#134252" }}>Announcements</h3>
      <ul style={{ margin: 0, padding: 0 }}>
        {data.length === 0 && <li style={{ color: "#626C71" }}>No announcements yet.</li>}
        {data.map(a => (
          <li key={a.id} style={{ marginBottom: 13, listStyle: "none" }}>
            <strong style={{ color: "#21808D" }}>{a.title}</strong> - <small style={{ color: "#626C71" }}>{a.date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
