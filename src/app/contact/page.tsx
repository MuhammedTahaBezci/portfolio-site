"use client";
import { useState } from "react";

// Button Component
export const Button = ({
  children,
  className = "",
  type = "button",
  ...props
}: React.PropsWithChildren<{
  className?: string;
  type?: "button" | "submit" | "reset";
}>) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
export const Card = ({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={`bg-white shadow-lg rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }: React.PropsWithChildren<{}>) => {
  return <div className="p-4">{children}</div>;
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg p-6">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">İletişim</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                İsim
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="İsminizi girin"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email adresinizi girin"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Mesaj
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mesajınızı yazın"
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Gönder
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
