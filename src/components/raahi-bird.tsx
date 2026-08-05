type RaahiBirdProps = {
  className?: string;
  carrying?: boolean;
  label?: string;
};

export function RaahiBird({ className = "", carrying = true, label }: RaahiBirdProps) {
  const labelled = Boolean(label);

  return (
    <svg
      className={className}
      viewBox="0 0 280 210"
      role={labelled ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      <g stroke="#44332f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M78 145 C38 132 20 104 24 76 C56 91 79 105 101 128Z" fill="#6f8794" />
        <path d="M91 137 C49 103 48 57 67 24 C91 54 109 87 119 124Z" fill="#8ca1aa" />
        <path d="M103 132 C87 84 105 38 139 12 C144 55 140 94 129 128Z" fill="#aebbc0" />
        <ellipse cx="147" cy="132" rx="76" ry="48" fill="#80959f" />
        <path d="M118 130 C129 90 174 76 205 98 C185 108 171 128 169 158 C148 154 130 145 118 130Z" fill="#617985" />
        <path d="M184 113 C202 72 245 66 259 93 C240 103 225 120 218 142 C203 140 191 128 184 113Z" fill="#9aabb1" />
        <circle cx="215" cy="91" r="34" fill="#aebbc0" />
        <path d="M243 88 L273 101 L244 110Z" fill="#e2a342" />
        <circle cx="225" cy="82" r="5" fill="#2c2422" stroke="none" />
        <circle cx="227" cy="80" r="1.6" fill="#ffffff" stroke="none" />
        <path d="M97 159 L64 190 L117 177Z" fill="#667d88" />
        <path d="M118 170 L96 202 L143 180Z" fill="#8799a0" />
        <path d="M158 174 C164 184 167 192 164 201" fill="none" />
        <path d="M181 171 C187 183 190 191 187 201" fill="none" />
        <path d="M154 202 h20 M177 202 h21" fill="none" strokeWidth="4" />
      </g>

      {carrying ? (
        <g transform="translate(167 145) rotate(7)">
          <path d="M0 0 C8 11 10 21 8 31" fill="none" stroke="#8f2f2a" strokeWidth="4" strokeLinecap="round" />
          <rect x="-22" y="25" width="66" height="45" rx="5" fill="#f8e8bf" stroke="#44332f" strokeWidth="4" />
          <path d="M-20 29 L11 52 L42 29" fill="#fff3d5" stroke="#44332f" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="11" cy="52" r="8" fill="#b74235" stroke="#7d2923" strokeWidth="2" />
        </g>
      ) : null}
    </svg>
  );
}

export function RaahiMark({ className = "" }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 64 64" focusable="false">
        <path d="M8 39 C16 18 35 10 52 18 C40 23 32 31 28 45 C20 45 13 43 8 39Z" fill="currentColor" />
        <circle cx="47" cy="21" r="8" fill="currentColor" />
        <path d="M54 21 L63 25 L54 29Z" fill="#e7ac45" />
        <path d="M24 43 L18 56 L35 46Z" fill="currentColor" />
        <path d="M33 43 L31 58 L45 46Z" fill="currentColor" opacity=".72" />
      </svg>
    </span>
  );
}
