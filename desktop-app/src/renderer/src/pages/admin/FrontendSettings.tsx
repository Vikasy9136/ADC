import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../services/db";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Color for primary button/backgrounds
const PRIMARY_COLOR = "#21808D";

// Settings keys type for strong typing
export type FrontendSettingsKey =
  | "site_title"
  | "primary_color"
  | "whatsapp_number"
  | "contact_email"
  | "logo_url"
  | "banner_url"
  | "site_online"
  | "about_text"
  | "terms_page"
  | "facebook_url"
  | "instagram_url";

// Strongly typed settings object
export interface FrontendSettingsState {
  site_title: string;
  primary_color: string;
  whatsapp_number: string;
  contact_email: string;
  logo_url: string;
  banner_url: string;
  site_online: string;
  about_text: string;
  terms_page: string;
  facebook_url: string;
  instagram_url: string;
}

const DEFAULTS: FrontendSettingsState = {
  site_title: "",
  primary_color: PRIMARY_COLOR,
  whatsapp_number: "",
  contact_email: "",
  logo_url: "",
  banner_url: "",
  site_online: "true",
  about_text: "",
  terms_page: "",
  facebook_url: "",
  instagram_url: "",
};

export default function FrontendSettings() {
  const [settings, setSettings] = useState<FrontendSettingsState>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploadingKey, setUploadingKey] = useState<FrontendSettingsKey | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("public.frontend_settings").select("*");
      if (data) {
        const vals: FrontendSettingsState = { ...DEFAULTS };
        data.forEach((row: { key: FrontendSettingsKey; value: string }) => {
          if (row.key in vals) vals[row.key as FrontendSettingsKey] = row.value;
        });
        setSettings(vals);
      }
      setLoading(false);
    })();
  }, []);

  // Strongly type key as FrontendSettingsKey
  const handleChange = (key: FrontendSettingsKey, value: string) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    for (const [key, value] of Object.entries(settings) as [FrontendSettingsKey, string][]) {
      await supabase
        .from("frontend_settings")
        .upsert([{ key, value, updated_at: new Date().toISOString() }]);
    }
    setLoading(false);
    setMsg("Settings updated!");
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "logo_url" | "banner_url"
  ) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploadingKey(key);
    const { data, error } = await supabase.storage
      .from("adc-diagnostic-center")
      .upload(`${key}/${Date.now()}-${file.name}`, file, { upsert: true });
    if (data) {
      const url = supabase.storage
        .from("adc-diagnostic-center")
        .getPublicUrl(data.path).data.publicUrl;
      setSettings((s) => ({ ...s, [key]: url || "" }));
      setMsg("Image uploaded");
    } else {
      setMsg(error?.message || "Upload failed");
    }
    setUploadingKey(null);
  };

  // (Rendering below...)

  // [styles same as your previous code]
  // ... rowStyle, colStyle, etc.

  return (
    <div
      style={{
        maxWidth: 830,
        margin: "50px auto",
        padding: "40px 32px",
        background: "#fff",
        borderRadius: "18px",
        border: "1.5px solid #F1F5F9",
        boxShadow:
          "0 3px 24px 0 rgba(34,84,94,0.05),0 1.5px 10px 0 rgba(34,84,94,0.05)",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 600,
          color: PRIMARY_COLOR,
          marginBottom: 10,
          letterSpacing: "-1px",
        }}
      >
        Frontend Settings
      </h1>
      <p style={{ color: "#777", marginBottom: 32, fontSize: 16 }}>
        Control your application's appearance, content and branding.
      </p>

      {/* [RENDERING: rest of your existing JSX, same as before!] */}
      {/* Only difference: all settings accesses are now type safe */}
      {/* ... */}

      {/* Use correct type for key when needed */}
      {/* Example: */}
      {/* onChange={(e) => handleChange("site_title", e.target.value)} */}
      {/* ...as in your code already */}

      {/* [Add the rest of your component code for branding card, images, quill editors, etc.] */}

      {/* ... Insert all the rest of your JSX code here unchanged ... */}

      {/* [last section: Save button and message] */}
      <div>
        <button
          onClick={handleSave}
          style={{
            background: PRIMARY_COLOR,
            color: "white",
            border: "none",
            padding: "13px 44px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: 18,
            marginTop: 6,
            minWidth: 180,
            boxShadow: "0 2px 10px rgba(33,128,141,0.14)",
            letterSpacing: "0.02em",
          }}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
        {msg && (
          <div
            style={{
              marginTop: 15,
              color: "#059669",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}

// [Your same styles below: rowStyle, colStyle, labelStyle, inputStyle, sectionTitle, uploadBtnStyle]
